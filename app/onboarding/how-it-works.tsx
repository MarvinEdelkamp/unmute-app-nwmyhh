
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';
import { PaginationDots } from '@/components/PaginationDots';

export default function HowItWorksScreen() {
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
          color={colors.text} 
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
          <Text style={styles.title}>How it works</Text>
          <Text style={styles.subtitle}>Three simple steps</Text>

          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepLeft}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepLine} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Toggle &quot;Open&quot;</Text>
                <Text style={styles.stepDescription}>
                  When you&apos;re ready to connect, tap Open. You&apos;re only visible while it&apos;s on.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepLeft}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepLine} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get matched nearby</Text>
                <Text style={styles.stepDescription}>
                  When someone here shares your interests and is also Open, you both get a quiet notification.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepLeft}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Say hi in person</Text>
                <Text style={styles.stepDescription}>
                  The app creates the opportunity. The real conversation happens face to face.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoIconContainer}>
              <IconSymbol 
                ios_icon_name="lock.fill" 
                android_material_icon_name="lock" 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <Text style={styles.infoText}>
              We never show your exact location. Matches expire quickly if no one responds.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/onboarding/safety')}
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
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: spacing.xxxl + spacing.lg,
  },
  stepsContainer: {
    marginBottom: spacing.xxxl,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  stepLeft: {
    alignItems: 'center',
    width: 56,
  },
  stepNumber: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  stepNumberText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.card,
  },
  stepLine: {
    width: 3,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: spacing.md,
    borderRadius: 2,
  },
  stepContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
  stepDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.secondary,
    padding: spacing.lg + spacing.xs,
    borderRadius: borderRadius.lg,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 22,
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
