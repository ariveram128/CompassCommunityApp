import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { ErrorService } from '../src/services/Error/ErrorService';
// Initialize i18n translations
import '../src/services/i18n/i18n';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize error handling first
    ErrorService.initialize();

    // Initialize core services on app start
    const initializeServices = async () => {
      try {
        // Wait a moment for i18n to finish initializing
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Import services dynamically to avoid circular dependencies
        const { NotificationService } = await import('../src/services/Notification/NotificationService');
        await NotificationService.initialize();
        console.log('App services initialized');
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize app services:', error);
        ErrorService.logServiceError('App', 'initializeServices', error, {
          showToUser: false,
          context: { phase: 'app_startup' }
        });
        // Still allow app to continue
        setIsReady(true);
      }
    };

    initializeServices();
  }, []);

  // Don't render anything until services are ready
  if (!isReady) {
    return null; // or a loading screen
  }

  return (
    <ErrorBoundary>
      <StatusBar style="light" backgroundColor="#1a1a1a" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a1a',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Compass Community',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="report" 
          options={{ 
            title: 'Submit Report',
            presentation: 'modal',
            headerStyle: {
              backgroundColor: '#2a2a2a',
            }
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Configuración',
            headerShown: false
          }} 
        />
        <Stack.Screen 
          name="activity" 
          options={{ 
            title: 'Recent Activity',
            headerStyle: {
              backgroundColor: '#2a2a2a',
            }
          }} 
        />
        <Stack.Screen 
          name="legal" 
          options={{ 
            title: 'Legal & Privacy',
            headerShown: false,
            headerStyle: {
              backgroundColor: '#2a2a2a',
            }
          }} 
        />
      </Stack>
    </ErrorBoundary>
  );
}