// src/application/services/ai.ts
import Constants from 'expo-constants';

interface AIConfig {
  provider: 'openai';
  model: string;
  openaiApiKey?: string;
}

function getAIConfig(): AIConfig | undefined {
  // Expo SDK 53: prefer expoConfig in dev, fallback to manifest.extra for older flows
  const extra = (Constants as any).expoConfig?.extra || (Constants as any).manifest?.extra;
  return extra?.ai as AIConfig | undefined;
}

export async function improveNoteText(
  content: string,
  opts?: { title?: string; category?: string }
): Promise<string> {
  const cfg = getAIConfig();
  if (!cfg || cfg.provider !== 'openai') {
    throw new Error('Configuración de IA no encontrada en app.json (extra.ai).');
  }
  const apiKey = cfg.openaiApiKey || (Constants as any).manifest?.extra?.ai?.openaiApiKey;
  if (!apiKey) {
    throw new Error('Falta OPENAI API KEY. Configura extra.ai.openaiApiKey en app.json o via variables de entorno.');
  }

  const system =
    'Eres un asistente que reescribe notas en español de forma clara, concisa y académica.\n' +
    'Respeta el significado original. Mantén el idioma español. Corrige gramática y mejora la cohesión.';

  const userParts = [
    opts?.category ? `Categoría: ${opts.category}` : undefined,
    `Contenido original:\n${content}`,
    'Reescribe el contenido anterior mejorándolo. Devuelve solo el texto reescrito, sin explicaciones.'
  ].filter(Boolean);

  const body = {
    model: cfg.model || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: userParts.join('\n\n') }
    ],
    temperature: 0.3,
    max_tokens: 800
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    let detail = '';
    try {
      const json = await res.json();
      detail = json?.error?.message || JSON.stringify(json);
      // Mensajes más claros por código
      if (res.status === 401 || res.status === 403) {
        throw new Error('Autenticación fallida con OpenAI (401/403). Verifica tu API Key y permisos. ' + (detail ? `Detalle: ${detail}` : ''));
      }
      if (res.status === 429) {
        throw new Error('Has excedido tu cuota o límite de uso (429). Revisa tu plan y facturación en OpenAI. ' + (detail ? `Detalle: ${detail}` : ''));
      }
      if (res.status >= 500) {
        throw new Error('Servicio de IA temporalmente indisponible (5xx). Intenta de nuevo en unos minutos. ' + (detail ? `Detalle: ${detail}` : ''));
      }
      throw new Error(`Error IA (${res.status}): ${detail || res.statusText}`);
    } catch (_) {
      // Si el body no fue JSON
      const text = detail || (await res.text().catch(() => ''));
      if (res.status === 401 || res.status === 403) {
        throw new Error('Autenticación fallida con OpenAI (401/403). Verifica tu API Key y permisos.');
      }
      if (res.status === 429) {
        throw new Error('Has excedido tu cuota o límite de uso (429). Revisa tu plan y facturación en OpenAI.');
      }
      if (res.status >= 500) {
        throw new Error('Servicio de IA temporalmente indisponible (5xx). Intenta de nuevo en unos minutos.');
      }
      throw new Error(`Error IA (${res.status}): ${text || res.statusText}`);
    }
  }

  const json: any = await res.json();
  const improved = json?.choices?.[0]?.message?.content?.trim();
  if (!improved) {
    throw new Error('La IA no devolvió contenido. Intenta de nuevo.');
  }
  return improved;
}
