
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';
import { PaginationDots } from '@/components/PaginationDots';

export default function SafetyScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <IconSymbol 
          ios_icon_name="chevron.left" 
          android_material_icon_name="arrow_back" 
          size={20} 
          color={colors.surface} 
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.animatedContent,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.infoBg }, shadows.lg]}>
              <IconSymbol 
                ios_icon_name="shield.fill" 
                android_material_icon_name="shield" 
                size={64} 
                color={colors.primary} 
              />
            </View>
          </View>

          <Text style={styles.title}>You are always in control</Text>
          <Text style={styles.subtitle}>Your safety and comfort come first</Text>

          <View style={styles.safetyContainer}>
            <View style={styles.safetyItem}>
              <View style={[styles.iconCircleSmall, { backgroundColor: colors.infoBg }, shadows.sm]}>
                <IconSymbol 
                  ios_icon_name="eye.fill" 
                  android_material_icon_name="visibility" 
                  size={28} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.safetyContent}>
                <Text style={styles.safetyTitle}>Only visible when Open</Text>
                <Text style={styles.safetyDescription}>
                  Toggle off anytime to become invisible
                </Text>
              </View>
            </View>

            <View style={styles.safetyItem}>
              <View style={[styles.iconCircleSmall, { backgroundColor: colors.infoBg }, shadows.sm]}>
                <IconSymbol 
                  ios_icon_name="clock.fill" 
                  android_material_icon_name="schedule" 
                  size={28} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.safetyContent}>
                <Text style={styles.safetyTitle}>Sessions expire</Text>
                <Text style={styles.safetyDescription}>
                  No pressure. If you don't respond, it disappears
                </Text>
              </View>
            </View>

            <View style={styles.safetyItem}>
              <View style={[styles.iconCircleSmall, { backgroundColor: colors.infoBg }, shadows.sm]}>
                <IconSymbol 
                  ios_icon_name="shield.fill" 
                  android_material_icon_name="shield" 
                  size={28} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.safetyContent}>
                <Text style={styles.safetyTitle}>Block & report available</Text>
                <Text style={styles.safetyDescription}>
                  You can always block or report anyone
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      <View style={[styles.bottomContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }, shadows.md]}
          onPress={() => router.push('/onboarding/location')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        
        <PaginationDots total={3} current={1} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 60,
    left: layout.screenPaddingHorizontal,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  animatedContent: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 108 : 120,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 180,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    fontSize: 28,
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.huge,
  },
  safetyContainer: {
    width: '100%',
    gap: spacing.xxl,
  },
  safetyItem: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  iconCircleSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  safetyTitle: {
    ...typography.h2,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  safetyDescription: {
    ...typography.body,
    color: colors.textSecondary,
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
    gap: spacing.lg,
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
});
