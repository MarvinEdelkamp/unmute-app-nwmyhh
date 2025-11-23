
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function RootNavigator() {
  const { user, isLoading, isOnboarded } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoading) {
      // Get the current route from segments
      const inAuthGroup = segments[0] === 'auth';
      const inOnboardingGroup = segments[0] === 'onboarding';
      
      console.log('Current segments:', segments);
      console.log('User:', user);
      console.log('IsOnboarded:', isOnboarded);
      
      // Don't redirect if user is already on auth/onboarding screens
      if (inAuthGroup || inOnboardingGroup) {
        console.log('User is on auth/onboarding screen, not redirecting');
        return;
      }

      // Only redirect to welcome if user hasn't seen onboarding at all
      if (!isOnboarded && !user) {
        console.log('User not onboarded and no user, redirecting to welcome');
        router.replace('/onboarding/welcome');
      } else if (!user) {
        console.log('No user but onboarded, redirecting to signup');
        router.replace('/auth/signup');
      }
    }
  }, [user, isLoading, isOnboarded, segments]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding/welcome" />
      <Stack.Screen name="onboarding/how-it-works" />
      <Stack.Screen name="onboarding/safety" />
      <Stack.Screen name="onboarding/location" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="auth/signin" />
      <Stack.Screen name="auth/interests" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen 
        name="match/pending" 
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="match/confirm" 
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="match/ready" 
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#4A9B94",
      background: "#FFFFFF",
      card: "#FFFFFF",
      text: "#1A1A1A",
      border: "#E5E7EB",
      notification: "#E74C3C",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "#5FBDB5",
      background: "#121212",
      card: "#1E1E1E",
      text: "#FFFFFF",
      border: "#2C2C2C",
      notification: "#FF6B6B",
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <NavigationThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <ThemeProvider>
          <AuthProvider>
            <SessionProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootNavigator />
                <SystemBars style={"auto"} />
              </GestureHandlerRootView>
            </SessionProvider>
          </AuthProvider>
        </ThemeProvider>
      </NavigationThemeProvider>
    </>
  );
}
