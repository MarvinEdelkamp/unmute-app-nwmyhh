
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout, shadows } from '@/styles/commonStyles';
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
          <View style={styles.headerSection}>
            <Text style={styles.title}>How it works</Text>
            <Text style={styles.subtitle}>Three simple steps</Text>
          </View>

          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepNumber, shadows.md]}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepLine} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Toggle "Open"</Text>
                <Text style={styles.stepDescription}>
                  When you're ready to connect, tap Open. You're only visible while it's on.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepNumber, shadows.md]}>
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
                <View style={[styles.stepNumber, shadows.md]}>
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

          <View style={[styles.infoBox, { backgroundColor: colors.infoBg, borderColor: colors.primaryLight }]}>
            <View style={[styles.infoIconContainer, { backgroundColor: colors.surface }]}>
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

      <View style={[styles.bottomContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }, shadows.md]}
          onPress={() => router.push('/onboarding/safety')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        
        <PaginationDots total={3} current={0} />
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
  },
  headerSection: {
    marginBottom: spacing.huge,
  },
  title: {
    ...typography.h1,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  stepsContainer: {
    marginBottom: spacing.huge,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginBottom: spacing.huge,
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
  },
  stepNumberText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.surface,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: spacing.lg,
    borderRadius: 1,
  },
  stepContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  stepDescription: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    ...typography.body,
    color: colors.text,
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
