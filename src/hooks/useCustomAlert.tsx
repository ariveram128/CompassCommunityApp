import React, { useState } from 'react';
import { CustomModal } from '../components/CustomModal';

interface AlertAction {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'destructive' | 'cancel' | 'primary';
}

interface AlertOptions {
  icon?: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  iconColor?: string;
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  actions: AlertAction[];
  options: AlertOptions;
}

export const useCustomAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    actions: [],
    options: {}
  });

  const showAlert = (
    title: string,
    message: string,
    actions: AlertAction[] = [{ text: 'OK', style: 'primary' }],
    options: AlertOptions = {}
  ) => {
    setAlertState({
      visible: true,
      title,
      message,
      actions,
      options
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, visible: false }));
  };

  const AlertComponent = () => (
    <CustomModal
      visible={alertState.visible}
      title={alertState.title}
      message={alertState.message}
      actions={alertState.actions.map(action => ({
        text: action.text,
        onPress: action.onPress || (() => {}),
        style: action.style || 'default'
      }))}
      onClose={hideAlert}
      icon={alertState.options.icon}
      iconColor={alertState.options.iconColor}
    />
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent
  };
}; 