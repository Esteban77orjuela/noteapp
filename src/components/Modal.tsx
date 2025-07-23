import React from "react";
import { Modal as RNModal, View, TouchableWithoutFeedback, StyleSheet } from "react-native";

type ModalProps = {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ visible, onClose, children }: ModalProps) => { 
    return (
        <RNModal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                        {children}
                    </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        width: 350,
        maxWidth: "90%",
        elevation: 5,
    },
});

export default Modal;

