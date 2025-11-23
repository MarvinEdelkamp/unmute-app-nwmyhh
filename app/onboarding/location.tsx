
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';

export default function LocationScreen() {
  const { completeOnboarding } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleEnableLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      // Mark onboarding as complete before navigating
      await completeOnboarding();
      
      if (status === 'granted') {
        router.replace('/auth/signup');
      } else {
        Alert.alert(
          'Location Permission',
          'Location access is needed to find people nearby. You can enable it later in settings.',
          [
            { text: 'OK', onPress: () => router.replace('/auth/signup') }
          ]
        );
      }
    } catch (error) {
      console.log('Location permission error:', error);
      Alert.alert('Error', 'Failed to request location permission');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as complete before navigating
    await completeOnboarding();
    router.replace('/auth/signup');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <IconSymbol 
              ios_icon_name="mappin.circle.fill" 
              android_material_icon_name="location_on" 
              size={64} 
              color={colors.primary} 
            />
            <View style={styles.lockBadge}>
              <IconSymbol 
                ios_icon_name="lock.fill" 
                android_material_icon_name="lock" 
                size={18} 
                color={colors.primary} 
              />
            </View>
          </View>
        </View>

        <Text style={styles.title}>Help Unmute find people near you</Text>
        
        <Text style={styles.description}>
          Location access lets us connect you with people nearby
        </Text>

        <View style={styles.featureContainer}>
          <View style={styles.feature}>
            <View style={styles.checkmark}>
              <IconSymbol 
                ios_icon_name="checkmark" 
                android_material_icon_name="check" 
                size={18} 
                color={colors.card} 
              />
            </View>
            <Text style={styles.featureText}>Only while you&apos;re Open to connect</Text>
          </View>

          <View style={styles.feature}>
            <View style={styles.checkmark}>
              <IconSymbol 
                ios_icon_name="checkmark" 
                android_material_icon_name="check" 
                size={18} 
                color={colors.card} 
              />
            </View>
            <Text style={styles.featureText}>We never show your exact location to others</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleEnableLocation}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Requesting...' : 'Enable Location'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Not now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 80 : 100,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 200,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl + spacing.lg,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.highlight,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg + spacing.xs,
    letterSpacing: -0.5,
    paddingHorizontal: spacing.lg,
    lineHeight: 36,
  },
  description: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl + spacing.lg,
    lineHeight: 26,
    paddingHorizontal: spacing.sm,
  },
  featureContainer: {
    width: '100%',
    gap: spacing.lg + spacing.xs,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    flex: 1,
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    width: '100%',
    minHeight: 58,
    paddingVertical: spacing.lg + spacing.md,
    paddingHorizontal: spacing.xxxl + spacing.xl,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.card,
    letterSpacing: 0.3,
  },
  skipButton: {
    paddingVertical: spacing.md,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
  },
});
