
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Animated, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';
import { PaginationDots } from '@/components/PaginationDots';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { hapticFeedback } from '@/utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    if (page !== currentPage) {
      setCurrentPage(page);
      hapticFeedback.light();
    }
  };

  const scrollToPage = (page: number) => {
    scrollViewRef.current?.scrollTo({ x: page * SCREEN_WIDTH, animated: true });
    hapticFeedback.light();
  };

  const handleEnableLocation = async () => {
    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      await completeOnboarding();
      
      if (status === 'granted') {
        hapticFeedback.success();
        router.replace('/auth/signup');
      } else {
        hapticFeedback.warning();
        router.replace('/auth/signup');
      }
    } catch (error) {
      console.log('Location permission error:', error);
      hapticFeedback.error();
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSkipLocation = async () => {
    await completeOnboarding();
    hapticFeedback.light();
    router.replace('/auth/signup');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        decelerationRate="fast"
      >
        {/* Page 1: Welcome */}
        <View style={styles.page}>
          <ScrollView 
            contentContainerStyle={styles.pageContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <IconSymbol 
                  ios_icon_name="person.2.fill" 
                  android_material_icon_name="people" 
                  size={56} 
                  color={colors.primary} 
                />
                <View style={styles.locationBadge}>
                  <IconSymbol 
                    ios_icon_name="mappin.circle.fill" 
                    android_material_icon_name="location_on" 
                    size={28} 
                    color={colors.card} 
                  />
                </View>
              </View>
            </View>

            <Text style={styles.title}>Unmute</Text>
            <Text style={styles.tagline}>Say hi for real</Text>
            
            <Text style={styles.description}>
              Meet people nearby who share your interests. Right here, right now, in real life.
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
                <Text style={styles.featureText}>No feeds, no scrolling, no social graph</Text>
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
                <Text style={styles.featureText}>Only when you&apos;re open to connect</Text>
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
                <Text style={styles.featureText}>Your privacy is protected</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Page 2: How it works */}
        <View style={styles.page}>
          <ScrollView 
            contentContainerStyle={styles.pageContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
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
        </View>

        {/* Page 3: Safety */}
        <View style={styles.page}>
          <ScrollView 
            contentContainerStyle={styles.pageContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
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
        </View>

        {/* Page 4: Location */}
        <View style={styles.page}>
          <ScrollView 
            contentContainerStyle={styles.pageContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
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
        </View>
      </ScrollView>

      {/* Bottom container with button and pagination */}
      <View style={styles.bottomContainer}>
        {currentPage < 3 ? (
          <TouchableOpacity 
            style={styles.button}
            onPress={() => scrollToPage(currentPage + 1)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.button}
              onPress={handleEnableLocation}
              disabled={locationLoading}
            >
              <Text style={styles.buttonText}>
                {locationLoading ? 'Requesting...' : 'Enable Location'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkipLocation}
            >
              <Text style={styles.skipText}>Not now</Text>
            </TouchableOpacity>
          </>
        )}
        
        <PaginationDots total={4} current={currentPage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    width: SCREEN_WIDTH,
  },
  pageContent: {
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
  locationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.card,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl + spacing.lg,
  },
  description: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.text,
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
  stepsContainer: {
    width: '100%',
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
    gap: spacing.md,
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
  skipButton: {
    paddingVertical: spacing.sm,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
  },
});
