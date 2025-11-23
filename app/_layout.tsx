
import React, { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Redirect } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
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
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('[App] Starting app initialization...');
        console.log('[App] Auth loading state:', loading);
        console.log('[App] User:', user ? 'Logged in' : 'Not logged in');
        console.log('[App] Onboarding completed:', hasCompletedOnboarding);
        console.log('[App] Platform:', Platform.OS);
        
        // Wait for auth to finish loading
        if (!loading) {
          // Small delay to ensure smooth transition
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('[App] App ready, hiding splash screen');
          setAppReady(true);
          setConnectionError(false);
        }
      } catch (error) {
        console.error('[App] Error preparing app:', error);
        // Even if there's an error, mark as ready to show error boundary
        setAppReady(true);
        setConnectionError(true);
      }
    }

    prepare();
  }, [loading]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      try {
        // Hide splash screen once app is ready
        await SplashScreen.hideAsync();
        console.log('[App] Splash screen hidden successfully');
      } catch (error) {
        console.error('[App] Error hiding splash screen:', error);
      }
    }
  }, [appReady]);

  const handleReload = useCallback(() => {
    console.log('[App] Reloading app...');
    // Reset state to trigger re-initialization
    setAppReady(false);
    setConnectionError(false);
    setTimeout(() => {
      setAppReady(true);
    }, 100);
  }, []);

  // Show loading spinner while app is initializing
  if (!appReady || loading) {
    return (
      <View 
        style={styles.loadingContainer}
        onLayout={onLayoutRootView}
      >
        <LoadingSpinner message="Loading Unmute..." fullScreen />
      </View>
    );
  }

  // Show connection error screen if there's an issue
  if (connectionError) {
    return (
      <View style={styles.errorContainer} onLayout={onLayoutRootView}>
        <Text style={styles.errorTitle}>Connection Issue</Text>
        <Text style={styles.errorMessage}>
          Unable to connect to the app. Please check your internet connection and try again.
        </Text>
        <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
          <Text style={styles.reloadButtonText}>Reload App</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine initial route based on app state
  let initialRoute = '/(tabs)';
  
  if (!hasCompletedOnboarding) {
    initialRoute = '/onboarding';
    console.log('[App] Redirecting to onboarding');
  } else if (!user) {
    initialRoute = '/auth/signup';
    console.log('[App] Redirecting to signup');
  } else if (!user.interests || user.interests.length === 0) {
    initialRoute = '/auth/interests';
    console.log('[App] Redirecting to interests');
  } else {
    console.log('[App] Showing main tabs');
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightColors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightColors.background,
    padding: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: lightColors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: lightColors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  reloadButton: {
    backgroundColor: lightColors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
