// CustomAlert.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  confirmText?: string;
  onCancel?: () => void;
  cancelText?: string | null;
  cancelable?: boolean;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  onConfirm,
  confirmText = "OK",
  onCancel,
  cancelText = null,
  cancelable = true,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={
        cancelable ? (event) => onCancel && onCancel() : undefined
      }
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {message && <Text style={styles.message}>{message}</Text>}

          <View style={styles.buttonContainer}>
            {cancelText && (
              <TouchableOpacity
                onPress={onCancel}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.button, styles.confirmButton]}
            >
              <Text style={styles.confirmText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#444",
  },
  buttonContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: "#007BFF",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
  },
});
