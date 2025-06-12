import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    // Initialize core services on app start
    const initializeServices = async () => {
      try {
        // Import services dynamically to avoid circular dependencies
        const { NotificationService } = await import('../src/services/Notification/NotificationService');
        await NotificationService.initialize();
        console.log('App services initialized');
      } catch (error) {
        console.error('Failed to initialize app services:', error);
      }
    };

    initializeServices();
  }, []);

  return (
    <>
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
            title: 'ICE Community Alert',
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
      </Stack>
    </>
  );
}