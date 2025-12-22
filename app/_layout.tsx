
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { setupErrorLogging } from '@/utils/errorLogger';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.log('Error preventing splash screen auto-hide:', error);
});

setupErrorLogging();

const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

function RootLayoutNav() {
  const { user, profile, interests, loading, hasCompletedOnboarding } = useAuth();
  const [appReady, setAppReady] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Check if user has seen onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        setHasSeenOnboarding(completed === 'true');
      } catch (error) {
        console.error('[App] Error checking onboarding status:', error);
        setHasSeenOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  // Force app to be ready after maximum timeout
  useEffect(() => {
    const maxLoadTime = setTimeout(() => {
      console.log('[App] Maximum load time reached, forcing app ready');
      setAppReady(true);
    }, 3000);

    return () => clearTimeout(maxLoadTime);
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('[App] Starting app initialization...');
        console.log('[App] Auth loading state:', loading);
        console.log('[App] User:', user ? 'Logged in' : 'Not logged in');
        console.log('[App] Profile:', profile ? 'exists' : 'null');
        console.log('[App] Interests:', interests.length);
        console.log('[App] Onboarding completed:', hasCompletedOnboarding);
        console.log('[App] Has seen onboarding:', hasSeenOnboarding);
        
        // Wait for auth to finish loading
        if (!loading) {
          console.log('[App] Auth loaded, marking app as ready');
          setAppReady(true);
        }
      } catch (error) {
        console.error('[App] Error preparing app:', error);
        setAppReady(true);
      }
    }

    prepare();
  }, [loading, user, profile, interests, hasCompletedOnboarding, hasSeenOnboarding]);

  // Hide splash screen once app is ready
  useEffect(() => {
    async function hideSplash() {
      if (appReady && !splashHidden) {
        try {
          console.log('[App] Hiding splash screen...');
          await SplashScreen.hideAsync();
          setSplashHidden(true);
          console.log('[App] Splash screen hidden successfully');
        } catch (error) {
          console.error('[App] Error hiding splash screen:', error);
          setSplashHidden(true);
        }
      }
    }

    hideSplash();
  }, [appReady, splashHidden]);

  // Show nothing while loading (splash screen is visible)
  if (!appReady) {
    console.log('[App] App not ready yet, showing splash screen');
    return null;
  }

  console.log('[App] App ready, rendering navigation');
  console.log('[App] Final routing decision - hasSeenOnboarding:', hasSeenOnboarding, 'hasCompletedOnboarding:', hasCompletedOnboarding, 'user:', user ? 'exists' : 'null', 'profile:', profile ? 'exists' : 'null');

  // Determine initial route based on app state
  let initialRoute = null;
  
  // First time users should see onboarding
  if (!hasSeenOnboarding) {
    initialRoute = '/onboarding';
    console.log('[App] Redirecting to onboarding - first time user');
  }
  // Check if user is not logged in
  else if (!user) {
    initialRoute = '/auth/signup';
    console.log('[App] Redirecting to signup - user not logged in');
  }
  // Check if user has no profile
  else if (!profile) {
    initialRoute = '/auth/signup';
    console.log('[App] Redirecting to signup - user has no profile');
  }
  // Check if user has no interests
  else if (interests.length < 3) {
    initialRoute = '/auth/interests';
    console.log('[App] Redirecting to interests - user has less than 3 interests');
  }
  // All checks passed: show main app
  else {
    console.log('[App] Showing main tabs - all checks passed');
  }

  return (
    <View style={{ flex: 1 }}>
      {initialRoute && <Redirect href={initialRoute as any} />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signin" options={{ headerShown: false }} />
        <Stack.Screen name="auth/interests" options={{ headerShown: false }} />
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
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
