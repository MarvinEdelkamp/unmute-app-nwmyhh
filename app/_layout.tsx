
import React, { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { setupErrorLogging } from '@/utils/errorLogger';
import * as SplashScreen from 'expo-splash-screen';
import { lightColors } from '@/styles/commonStyles';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.log('Error preventing splash screen auto-hide:', error);
});

setupErrorLogging();

function RootLayoutNav() {
  const { user, loading, hasCompletedOnboarding } = useAuth();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for auth to finish loading
        if (!loading) {
          // Small delay to ensure smooth transition
          await new Promise(resolve => setTimeout(resolve, 100));
          setAppReady(true);
        }
      } catch (error) {
        console.error('Error preparing app:', error);
        // Even if there's an error, mark as ready to show error boundary
        setAppReady(true);
      }
    }

    prepare();
  }, [loading]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      // Hide splash screen once app is ready
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  // Show loading spinner while app is initializing
  if (!appReady || loading) {
    return (
      <View 
        style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: lightColors.background 
        }}
        onLayout={onLayoutRootView}
      >
        <LoadingSpinner message="Loading Unmute..." fullScreen />
      </View>
    );
  }

  // Determine initial route based on app state
  let initialRoute = '/(tabs)';
  
  if (!hasCompletedOnboarding) {
    initialRoute = '/onboarding';
  } else if (!user) {
    initialRoute = '/auth/signup';
  } else if (!user.interests || user.interests.length === 0) {
    initialRoute = '/auth/interests';
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {initialRoute !== '/(tabs)' && <Redirect href={initialRoute as any} />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signin" options={{ headerShown: false }} />
        <Stack.Screen name="auth/interests" options={{ headerShown: false }} />
        <Stack.Screen name="match/pending" options={{ headerShown: false }} />
        <Stack.Screen name="match/confirm" options={{ headerShown: false }} />
        <Stack.Screen name="match/ready" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AuthProvider>
            <SessionProvider>
              <WidgetProvider>
                <RootLayoutNav />
              </WidgetProvider>
            </SessionProvider>
          </AuthProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
