import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../Style/alertModal'; // Or extract modal styles separately

const AlertModal = ({ visible, onClose, message, emoji = '', type = 'success' }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer,
          type === 'success' ? styles.modalSuccess : styles.modalError
        ]}>
          {emoji && <Text style={styles.modalEmoji}>{emoji}</Text>}
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalClose}>סגור</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
