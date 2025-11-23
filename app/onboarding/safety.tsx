
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout } from '@/styles/commonStyles';
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
          size={24} 
          color={colors.card} 
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
            <View style={styles.iconCircle}>
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
              <View style={styles.iconCircleSmall}>
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
              <View style={styles.iconCircleSmall}>
                <IconSymbol 
                  ios_icon_name="clock.fill" 
                  android_material_icon_name="schedule" 
                  size={28} 
                  color={colors.primary} 
                />
              </View>
              <View style={styles.safetyContent}>
                <Text style={styles.safetyTitle}>Matches expire</Text>
                <Text style={styles.safetyDescription}>
                  No pressure. If you don&apos;t respond, it disappears
                </Text>
              </View>
            </View>

            <View style={styles.safetyItem}>
              <View style={styles.iconCircleSmall}>
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

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/onboarding/location')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
    letterSpacing: -0.5,
    paddingHorizontal: spacing.lg,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl + spacing.lg,
  },
  safetyContainer: {
    width: '100%',
    gap: spacing.xxl + spacing.xs,
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
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  safetyContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
  },
  safetyDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
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
    gap: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    width: '100%',
    minHeight: 56,
    paddingVertical: spacing.lg + spacing.xs,
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
    fontSize: 17,
    fontWeight: '600',
    color: colors.card,
    letterSpacing: 0.2,
  },
});
