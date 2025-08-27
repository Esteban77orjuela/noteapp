// src/helpers/index.test.ts
import { generateUniqueId } from './index';

describe('Helper functions', () => {
  describe('generateUniqueId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });

    it('should generate IDs with timestamp and random parts', () => {
      const id = generateUniqueId();
      const timestampPart = id.split('-')[0];
      
      // Check that the first part is a timestamp
      expect(Number(timestampPart)).toBeGreaterThan(0);
    });
  });
});