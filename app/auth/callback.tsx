
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/styles/commonStyles';

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('[AuthCallback] Callback screen mounted');
    
    // Give the auth context time to process the session
    const timer = setTimeout(() => {
      console.log('[AuthCallback] Redirecting to main app');
      router.replace('/(tabs)/(home)/');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  text: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.text,
  },
});
