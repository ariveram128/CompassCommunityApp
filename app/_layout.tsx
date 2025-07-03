import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { ErrorService } from '../src/services/Error/ErrorService';

export default function RootLayout() {
  useEffect(() => {
    // Initialize error handling first
    ErrorService.initialize();

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

    initializeServices();
  }, []);

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