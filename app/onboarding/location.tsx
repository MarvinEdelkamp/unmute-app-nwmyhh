
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { PaginationDots } from '@/components/PaginationDots';

export default function LocationScreen() {
  const { completeOnboarding } = useAuth();
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const mountedRef = React.useRef(true);

  useEffect(() => {
    console.log('[Location] Screen mounted');
    mountedRef.current = true;
    
    return () => {
      console.log('[Location] Screen unmounting');
      mountedRef.current = false;
    };
  }, []);

  const handleEnableLocation = async () => {
    if (loading || !mountedRef.current) {
      console.log('[Location] Button press ignored - already loading or unmounted');
      return;
    }
    
    try {
      setLoading(true);
      setPermissionStatus('requesting');
      console.log('[Location] Requesting foreground location permissions...');
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('[Location] Permission status:', status);
      
      if (!mountedRef.current) {
        console.log('[Location] Component unmounted, aborting');
        return;
      }
      
      if (status === 'granted') {
        setPermissionStatus('granted');
        console.log('[Location] Permission granted, completing onboarding');
        
        await completeOnboarding();
        
        if (mountedRef.current) {
          router.replace('/auth/signup');
        }
      } else {
        setPermissionStatus('denied');
        console.log('[Location] Permission denied');
        
        Alert.alert(
          'Location Permission',
          'Location access is needed to find people nearby. You can enable it later in settings.',
          [
            { 
              text: 'OK', 
              onPress: async () => {
                if (mountedRef.current) {
                  await completeOnboarding();
                  router.replace('/auth/signup');
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('[Location] Error requesting permission:', error);
      if (mountedRef.current) {
        setPermissionStatus('idle');
        Alert.alert(
          'Error',
          'Failed to request location permission. Please try again.',
          [
            { text: 'OK' }
          ]
        );
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const handleSkip = async () => {
    if (loading || !mountedRef.current) {
      return;
    }
    
    try {
      console.log('[Location] User skipped location permission');
      await completeOnboarding();
      
      if (mountedRef.current) {
        router.replace('/auth/signup');
      }
    } catch (error) {
      console.error('[Location] Error skipping:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.infoBg }, shadows.lg]}>
            <IconSymbol 
              ios_icon_name="mappin.circle.fill" 
              android_material_icon_name="location_on" 
              size={64} 
              color={colors.primary} 
            />
            <View style={[styles.lockBadge, { backgroundColor: colors.surface, borderColor: colors.infoBg }, shadows.sm]}>
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
            <View style={[styles.checkmark, { backgroundColor: colors.primary }, shadows.sm]}>
              <IconSymbol 
                ios_icon_name="checkmark" 
                android_material_icon_name="check" 
                size={18} 
                color={colors.surface} 
              />
            </View>
            <Text style={styles.featureText}>Only while you're Open to connect</Text>
          </View>

          <View style={styles.feature}>
            <View style={[styles.checkmark, { backgroundColor: colors.primary }, shadows.sm]}>
              <IconSymbol 
                ios_icon_name="checkmark" 
                android_material_icon_name="check" 
                size={18} 
                color={colors.surface} 
              />
            </View>
            <Text style={styles.featureText}>We never show your exact location to others</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[
            styles.button,
            { backgroundColor: colors.primary },
            shadows.md,
            (loading || permissionStatus === 'requesting') && { opacity: 0.6 }
          ]}
          onPress={handleEnableLocation}
          disabled={loading || permissionStatus === 'requesting'}
        >
          <Text style={styles.buttonText}>
            {permissionStatus === 'requesting' ? 'Requesting...' : 'Enable Location'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={loading}
        >
          <Text style={styles.skipText}>Not now</Text>
        </TouchableOpacity>
        
        <PaginationDots total={3} current={2} />
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
    paddingBottom: 240,
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
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.huge,
    paddingHorizontal: spacing.sm,
  },
  featureContainer: {
    width: '100%',
    gap: spacing.lg,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
    ...shadows.lg,
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
    color: colors.surface,
    letterSpacing: 0.3,
  },
  skipButton: {
    paddingVertical: spacing.md,
  },
  skipText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
