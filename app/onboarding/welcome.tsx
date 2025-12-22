
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { hapticFeedback } from '@/utils/haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';
const ONBOARDING_COMPLETED_KEY = 'onboarding_completed';

export default function WelcomeScreen() {
  const { theme } = useTheme();

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      hapticFeedback.light();
      router.replace('/onboarding');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/onboarding');
    }
  };

  const handleSkipLogin = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      hapticFeedback.light();
      router.replace('/auth/signup');
    } catch (error) {
      console.error('Error skipping login:', error);
      router.replace('/auth/signup');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.infoBg }, shadows.lg]}>
            <Text style={[styles.bracketsLogo, { color: theme.primary }]}>[ ]</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: theme.primaryDark }]}>Welcome to Unmute</Text>
        <Text style={[styles.tagline, { color: theme.primary }]}>Say hi for real</Text>
        
        <Text style={[styles.description, { color: theme.text }]}>
          Meet people nearby who share your interests. Right here, right now, in real life.
        </Text>

        <View style={styles.featureContainer}>
          <View style={styles.feature}>
            <View style={[styles.checkmark, { backgroundColor: theme.primary }, shadows.sm]}>
              <IconSymbol 
                ios_icon_name="checkmark" 
                android_material_icon_name="check" 
                size={16} 
                color={theme.surface} 
              />
            </View>
            <Text style={[styles.featureText, { color: theme.text }]}>No feeds, no scrolling</Text>
          </View>

          <View style={styles.feature}>
            <View style={[styles.checkmark, { backgroundColor: theme.primary }, shadows.sm]}>
              <IconSymbol 
                ios_icon_name="checkmark" 
                android_material_icon_name="check" 
                size={16} 
                color={theme.surface} 
              />
            </View>
            <Text style={[styles.featureText, { color: theme.text }]}>Real connections only</Text>
          </View>

          <View style={styles.feature}>
            <View style={[styles.checkmark, { backgroundColor: theme.primary }, shadows.sm]}>
              <IconSymbol 
                ios_icon_name="checkmark" 
                android_material_icon_name="check" 
                size={16} 
                color={theme.surface} 
              />
            </View>
            <Text style={[styles.featureText, { color: theme.text }]}>Your privacy protected</Text>
          </View>
        </View>
      </View>

      <View style={[styles.bottomContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.primary }, shadows.md]}
          onPress={handleGetStarted}
        >
          <Text style={[styles.buttonText, { color: theme.surface }]}>
            Get Started
          </Text>
        </TouchableOpacity>

        {isExpoGo && (
          <TouchableOpacity 
            style={[styles.skipButton, { backgroundColor: theme.warningBg, borderColor: theme.warning }]}
            onPress={handleSkipLogin}
          >
            <IconSymbol 
              ios_icon_name="flask.fill" 
              android_material_icon_name="science" 
              size={18} 
              color={theme.warning} 
            />
            <Text style={[styles.skipButtonText, { color: theme.warning }]}>
              Skip Login (Testing)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 100 : 120,
    paddingHorizontal: layout.screenPaddingHorizontal,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.huge,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bracketsLogo: {
    fontSize: 72,
    fontWeight: '300',
    letterSpacing: -4,
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.huge,
    paddingHorizontal: spacing.md,
  },
  featureContainer: {
    width: '100%',
    gap: spacing.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    ...typography.body,
    flex: 1,
  },
  bottomContainer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
    borderTopWidth: 1,
  },
  button: {
    width: '100%',
    minHeight: 56,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.bodyBold,
    fontSize: 17,
    letterSpacing: 0.3,
  },
  skipButton: {
    width: '100%',
    minHeight: 48,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    borderWidth: 1.5,
  },
  skipButtonText: {
    ...typography.bodyBold,
    fontSize: 15,
  },
});
