
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SessionProvider } from '@/contexts/SessionContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { WidgetProvider } from '@/contexts/WidgetContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { setupErrorLogging } from '@/utils/errorLogger';

setupErrorLogging();

function RootLayoutNav() {
  const { user, loading, hasCompletedOnboarding } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <LoadingSpinner message="Loading..." />
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!user) {
    return <Redirect href="/auth/signup" />;
  }

  if (user && (!user.interests || user.interests.length === 0)) {
    return <Redirect href="/auth/interests" />;
  }

  return (
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
