
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Animated, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { router } from 'expo-router';
import { spacing, typography, borderRadius, layout, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';
import { PaginationDots } from '@/components/PaginationDots';
import * as Location from 'expo-location';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { hapticFeedback } from '@/utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const { theme } = useTheme();
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
      await completeOnboarding();
      router.replace('/auth/signup');
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSkipLocation = async () => {
    try {
      await completeOnboarding();
      hapticFeedback.light();
      router.replace('/auth/signup');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/auth/signup');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
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
              <View style={[styles.iconCircle, { backgroundColor: theme.highlight }, shadows.md]}>
                <Text style={[styles.bracketsLogo, { color: theme.primary }]}>[ ]</Text>
              </View>
            </View>

            <Text style={[styles.title, { color: theme.primaryDark }]}>Unmute</Text>
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
                <Text style={[styles.featureText, { color: theme.text }]}>No feeds, no scrolling, no social graph</Text>
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
                <Text style={[styles.featureText, { color: theme.text }]}>Only when you&apos;re open to connect</Text>
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
                <Text style={[styles.featureText, { color: theme.text }]}>Your privacy is protected</Text>
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
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: theme.highlight }, shadows.md]}>
                <IconSymbol 
                  ios_icon_name="arrow.triangle.2.circlepath" 
                  android_material_icon_name="sync" 
                  size={56} 
                  color={theme.primary} 
                />
              </View>
            </View>

            <Text style={[styles.title, { color: theme.primaryDark }]}>How it works</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Three simple steps</Text>

            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={styles.stepLeft}>
                  <View style={[styles.stepNumber, { backgroundColor: theme.primary }, shadows.sm]}>
                    <Text style={[styles.stepNumberText, { color: theme.surface }]}>1</Text>
                  </View>
                  <View style={[styles.stepLine, { backgroundColor: theme.border }]} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.primaryDark }]}>Toggle &quot;Open&quot;</Text>
                  <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                    When you&apos;re ready to connect, tap Open. You&apos;re only visible while it&apos;s on.
                  </Text>
                </View>
              </View>

              <View style={styles.step}>
                <View style={styles.stepLeft}>
                  <View style={[styles.stepNumber, { backgroundColor: theme.primary }, shadows.sm]}>
                    <Text style={[styles.stepNumberText, { color: theme.surface }]}>2</Text>
                  </View>
                  <View style={[styles.stepLine, { backgroundColor: theme.border }]} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.primaryDark }]}>Get matched nearby</Text>
                  <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                    When someone here shares your interests and is also Open, you both get a quiet notification.
                  </Text>
                </View>
              </View>

              <View style={styles.step}>
                <View style={styles.stepLeft}>
                  <View style={[styles.stepNumber, { backgroundColor: theme.primary }, shadows.sm]}>
                    <Text style={[styles.stepNumberText, { color: theme.surface }]}>3</Text>
                  </View>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.primaryDark }]}>Say hi in person</Text>
                  <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                    The app creates the opportunity. The real conversation happens face to face.
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.infoBox, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
              <View style={[styles.infoIconContainer, { backgroundColor: theme.surface }]}>
                <IconSymbol 
                  ios_icon_name="lock.fill" 
                  android_material_icon_name="lock" 
                  size={18} 
                  color={theme.primary} 
                />
              </View>
              <Text style={[styles.infoText, { color: theme.text }]}>
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
              <View style={[styles.iconCircle, { backgroundColor: theme.highlight }, shadows.md]}>
                <IconSymbol 
                  ios_icon_name="shield.fill" 
                  android_material_icon_name="shield" 
                  size={56} 
                  color={theme.primary} 
                />
              </View>
            </View>

            <Text style={[styles.title, { color: theme.primaryDark }]}>You are always in control</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Your safety and comfort come first</Text>

            <View style={styles.safetyContainer}>
              <View style={styles.safetyItem}>
                <View style={[styles.iconCircleSmall, { backgroundColor: theme.highlight }, shadows.sm]}>
                  <IconSymbol 
                    ios_icon_name="eye.fill" 
                    android_material_icon_name="visibility" 
                    size={24} 
                    color={theme.primary} 
                  />
                </View>
                <View style={styles.safetyContent}>
                  <Text style={[styles.safetyTitle, { color: theme.primaryDark }]}>Only visible when Open</Text>
                  <Text style={[styles.safetyDescription, { color: theme.textSecondary }]}>
                    Toggle off anytime to become invisible
                  </Text>
                </View>
              </View>

              <View style={styles.safetyItem}>
                <View style={[styles.iconCircleSmall, { backgroundColor: theme.highlight }, shadows.sm]}>
                  <IconSymbol 
                    ios_icon_name="clock.fill" 
                    android_material_icon_name="schedule" 
                    size={24} 
                    color={theme.primary} 
                  />
                </View>
                <View style={styles.safetyContent}>
                  <Text style={[styles.safetyTitle, { color: theme.primaryDark }]}>Matches expire</Text>
                  <Text style={[styles.safetyDescription, { color: theme.textSecondary }]}>
                    No pressure. If you don&apos;t respond, it disappears
                  </Text>
                </View>
              </View>

              <View style={styles.safetyItem}>
                <View style={[styles.iconCircleSmall, { backgroundColor: theme.highlight }, shadows.sm]}>
                  <IconSymbol 
                    ios_icon_name="shield.fill" 
                    android_material_icon_name="shield" 
                    size={24} 
                    color={theme.primary} 
                  />
                </View>
                <View style={styles.safetyContent}>
                  <Text style={[styles.safetyTitle, { color: theme.primaryDark }]}>Block & report available</Text>
                  <Text style={[styles.safetyDescription, { color: theme.textSecondary }]}>
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
              <View style={[styles.iconCircle, { backgroundColor: theme.highlight }, shadows.md]}>
                <IconSymbol 
                  ios_icon_name="mappin.circle.fill" 
                  android_material_icon_name="location_on" 
                  size={56} 
                  color={theme.primary} 
                />
                <View style={[styles.lockBadge, { backgroundColor: theme.surface, borderColor: theme.highlight }]}>
                  <IconSymbol 
                    ios_icon_name="lock.fill" 
                    android_material_icon_name="lock" 
                    size={16} 
                    color={theme.primary} 
                  />
                </View>
              </View>
            </View>

            <Text style={[styles.title, { color: theme.primaryDark }]}>Help Unmute find people near you</Text>
            
            <Text style={[styles.description, { color: theme.text }]}>
              Location access lets us connect you with people nearby
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
                <Text style={[styles.featureText, { color: theme.text }]}>Only while you&apos;re Open to connect</Text>
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
                <Text style={[styles.featureText, { color: theme.text }]}>We never show your exact location to others</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        {currentPage === 3 ? (
          <>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }, shadows.md]}
              onPress={handleEnableLocation}
              disabled={locationLoading}
            >
              <Text style={[styles.buttonText, { color: theme.surface }]}>
                {locationLoading ? 'Requesting...' : 'Enable Location'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={handleSkipLocation}
            >
              <Text style={[styles.skipText, { color: theme.textSecondary }]}>Not now</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={[styles.swipeHint, { color: theme.textSecondary }]}>Swipe to continue</Text>
        )}
        
        <PaginationDots total={4} current={currentPage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: spacing.huge,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bracketsLogo: {
    fontSize: 64,
    fontWeight: '300',
    letterSpacing: -4,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
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
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
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
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    ...typography.body,
    flex: 1,
    lineHeight: 22,
  },
  stepsContainer: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  stepLeft: {
    alignItems: 'center',
    width: 48,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 22,
    fontWeight: '600',
  },
  stepLine: {
    width: 2,
    flex: 1,
    marginTop: spacing.sm,
    borderRadius: 1,
  },
  stepContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  stepTitle: {
    ...typography.h2,
    fontSize: 18,
    marginBottom: spacing.sm,
  },
  stepDescription: {
    ...typography.body,
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    ...typography.body,
    fontSize: 15,
    lineHeight: 21,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  safetyTitle: {
    ...typography.h2,
    fontSize: 17,
    marginBottom: spacing.xs,
  },
  safetyDescription: {
    ...typography.body,
    lineHeight: 22,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.md,
    borderTopWidth: 1,
  },
  swipeHint: {
    ...typography.body,
    paddingVertical: spacing.lg,
  },
  button: {
    width: '100%',
    minHeight: 52,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.bodyBold,
    fontSize: 17,
  },
  skipButton: {
    paddingVertical: spacing.sm,
  },
  skipText: {
    ...typography.body,
  },
});
