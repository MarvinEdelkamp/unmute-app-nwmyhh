
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SessionProvider } from "@/contexts/SessionContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function RootNavigator() {
  const { user, isLoading, isOnboarded } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isOnboarded) {
        router.replace('/onboarding/welcome');
      } else if (!user) {
        router.replace('/auth/signup');
      }
    }
  }, [user, isLoading, isOnboarded]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding/welcome" />
      <Stack.Screen name="onboarding/how-it-works" />
      <Stack.Screen name="onboarding/safety" />
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
      primary: "rgb(100, 181, 246)",
      background: "rgb(245, 245, 245)",
      card: "rgb(255, 255, 255)",
      text: "rgb(33, 33, 33)",
      border: "rgb(224, 224, 224)",
      notification: "rgb(239, 83, 80)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(100, 181, 246)",
      background: "rgb(18, 18, 18)",
      card: "rgb(28, 28, 30)",
      text: "rgb(255, 255, 255)",
      border: "rgb(44, 44, 46)",
      notification: "rgb(239, 83, 80)",
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <AuthProvider>
          <SessionProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootNavigator />
              <SystemBars style={"auto"} />
            </GestureHandlerRootView>
          </SessionProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
