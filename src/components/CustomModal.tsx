import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface CustomModalAction {
  text: string;
  onPress: () => void;
  style?: 'default' | 'destructive' | 'cancel' | 'primary';
}

interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  actions: CustomModalAction[];
  onClose: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  message,
  actions,
  onClose,
  icon,
  iconColor = '#6366F1'
}) => {
  const getActionStyle = (style: string = 'default') => {
    switch (style) {
      case 'primary':
        return [styles.actionButton, styles.primaryButton];
      case 'destructive':
        return [styles.actionButton, styles.destructiveButton];
      case 'cancel':
        return [styles.actionButton, styles.cancelButton];
      default:
        return [styles.actionButton, styles.defaultButton];
    }
  };

  const getActionTextStyle = (style: string = 'default') => {
    switch (style) {
      case 'primary':
        return [styles.actionText, styles.primaryText];
      case 'destructive':
        return [styles.actionText, styles.destructiveText];
      case 'cancel':
        return [styles.actionText, styles.cancelText];
      default:
        return [styles.actionText, styles.defaultText];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              {icon && (
                <View style={styles.iconContainer}>
                  <Ionicons name={icon} size={24} color={iconColor} />
                </View>
              )}
              <Text style={styles.title}>{title}</Text>
            </View>

            {/* Message */}
            <ScrollView style={styles.messageContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.message}>{message}</Text>
            </ScrollView>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              {actions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={getActionStyle(action.style)}
                  onPress={() => {
                    action.onPress();
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={getActionTextStyle(action.style)}>
                    {action.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#1E1E3F',
    borderRadius: 20,
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  messageContainer: {
    maxHeight: 200,
    marginBottom: 24,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  destructiveButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  defaultButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  destructiveText: {
    color: '#EF4444',
  },
  cancelText: {
    color: '#94A3B8',
  },
  defaultText: {
    color: '#fff',
  },
}); 