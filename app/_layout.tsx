import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { ErrorService } from '../src/services/Error/ErrorService';
// Initialize i18n translations
import { initI18n } from '../src/services/i18n/i18n';

export default function RootLayout() {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    // Initialize error handling first
    ErrorService.initialize();

    // Initialize i18n
    const initializeI18n = async () => {
      try {
        await initI18n();
        setIsI18nReady(true);
        console.log('[App] i18n initialized successfully');
      } catch (error) {
        console.error('[App] Failed to initialize i18n:', error);
        // Still allow app to continue with fallback
        setIsI18nReady(true);
      }
    };

    // Initialize core services on app start
    const initializeServices = async () => {
      try {
        // Import services dynamically to avoid circular dependencies
        const { NotificationService } = await import('../src/services/Notification/NotificationService');
        await NotificationService.initialize();
        console.log('App services initialized');
      } catch (error) {
        console.error('Failed to initialize app services:', error);
        ErrorService.logServiceError('App', 'initializeServices', error, {
          showToUser: false,
          context: { phase: 'app_startup' }
        });
      }
    };

    // Initialize both in parallel
    Promise.all([
      initializeI18n(),
      initializeServices()
    ]);
  }, []);

  // Don't render anything until i18n is ready
  if (!isI18nReady) {
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
            title: 'Privacy Settings',
            headerStyle: {
              backgroundColor: '#2a2a2a',
            }
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