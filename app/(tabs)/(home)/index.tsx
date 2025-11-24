
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';
import { ProgressRing } from '@/components/ProgressRing';
import { spacing, typography, borderRadius, shadows } from '@/styles/commonStyles';
import { hapticFeedback } from '@/utils/haptics';

export default function HomeScreen() {
  const { profile, interests } = useAuth();
  const { isOpen, remainingTime, openSession, closeSession, extendSession, matches } = useSession();
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;
  const mountedRef = React.useRef(true);

  useEffect(() => {
    console.log('[Home] Component mounted');
    mountedRef.current = true;
    
    return () => {
      console.log('[Home] Component unmounting');
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.01,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatEndTime = (seconds: number) => {
    const endTime = new Date(Date.now() + seconds * 1000);
    return endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleToggle = async () => {
    hapticFeedback.medium();
    if (isOpen) {
      await closeSession();
      hapticFeedback.success();
    } else {
      await openSession();
      hapticFeedback.success();
    }
  };

  const handleExtend = async () => {
    hapticFeedback.light();
    await extendSession();
    hapticFeedback.success();
  };

  const pendingMatches = matches.filter(m => 
    m.status === 'pending' || m.status === 'user_a_accepted' || m.status === 'user_b_accepted'
  );
  const readyMatches = matches.filter(m => m.status === 'both_accepted');

  useEffect(() => {
    if (!mountedRef.current) return;

    if (pendingMatches.length > 0) {
      console.log('[Home] Auto-navigating to pending match');
      hapticFeedback.success();
      setTimeout(() => {
        if (mountedRef.current) {
          router.push('/match/pending');
        }
      }, 200);
    } else if (readyMatches.length > 0) {
      console.log('[Home] Auto-navigating to ready match');
      hapticFeedback.success();
      setTimeout(() => {
        if (mountedRef.current) {
          router.push('/match/ready');
        }
      }, 200);
    }
  }, [matches.length, pendingMatches.length, readyMatches.length]);

  const getInterestEmoji = (interest: string) => {
    const emojiMap: { [key: string]: string } = {
      'Hiking': '🥾',
      'Running': '🏃',
      'Yoga': '🧘',
      'Cycling': '🚴',
      'Rock Climbing': '🧗',
      'Photography': '📷',
      'Coffee': '☕',
      'Music': '🎵',
      'Art': '🎨',
      'Reading': '📚',
      'Cooking': '🍳',
      'Gaming': '🎮',
      'Travel': '✈️',
      'Fitness': '💪',
      'Dancing': '💃',
      'Movies': '🎬',
      'Food': '🍕',
    };
    return emojiMap[interest] || '✨';
  };

  const maxTime = 45 * 60;
  const progress = isOpen && remainingTime > 0 ? remainingTime / maxTime : 0;

  const userInterests = interests.map(i => i.interest_label || '').filter(Boolean);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.appTitle, { color: theme.primaryDark }]}>Unmute</Text>
          <View style={styles.locationRow}>
            <IconSymbol 
              ios_icon_name="location.fill" 
              android_material_icon_name="location_on" 
              size={13} 
              color={theme.textSecondary} 
            />
            <Text style={[styles.location, { color: theme.textSecondary }]}>
              {profile?.city || 'Nearby'}
            </Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={() => {
              hapticFeedback.light();
              router.push('/(tabs)/settings');
            }}
            style={[styles.settingsButton, { backgroundColor: theme.surface }, shadows.sm]}
          >
            <IconSymbol 
              ios_icon_name="gearshape.fill" 
              android_material_icon_name="settings" 
              size={22} 
              color={theme.primaryDark} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusTitle, { color: isOpen ? theme.primary : theme.primaryDark }]}>
            {isOpen ? "You're open to connect" : "Ready to connect?"}
          </Text>
          <Text style={[styles.statusDescription, { color: theme.textSecondary }]}>
            {isOpen 
              ? "We're looking for people here with shared interests" 
              : "Tap Open to be visible to people here who share your interests"}
          </Text>

          <View style={styles.circleContainer}>
            {isOpen && (
              <Animated.View 
                style={[
                  styles.glowOuter,
                  {
                    backgroundColor: theme.primary,
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.08, 0.15],
                    }),
                    transform: [{
                      scale: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.06],
                      }),
                    }],
                  },
                ]}
              />
            )}
            
            {isOpen && remainingTime > 0 && (
              <View style={styles.progressRingContainer}>
                <ProgressRing
                  size={240}
                  strokeWidth={5}
                  progress={progress}
                  color={theme.primary}
                  backgroundColor={theme.border}
                />
              </View>
            )}

            <Animated.View 
              style={[
                styles.circle,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <TouchableOpacity
                style={styles.circleButton}
                onPress={handleToggle}
                activeOpacity={0.8}
              >
                {isOpen ? (
                  <LinearGradient
                    colors={[theme.primary, theme.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.circleGradient, shadows.lg]}
                  >
                    <View style={styles.bracketsContainer}>
                      <Text style={[styles.bracket, { color: theme.surface }]}>[ ]</Text>
                    </View>
                    <Text style={[styles.circleText, { color: theme.surface }]}>Open</Text>
                    {remainingTime > 0 && (
                      <Text style={[styles.timerText, { color: theme.surface }]}>
                        {formatTime(remainingTime)}
                      </Text>
                    )}
                  </LinearGradient>
                ) : (
                  <View style={[styles.circleGradient, { backgroundColor: theme.disabled }]}>
                    <View style={styles.bracketsContainer}>
                      <Text style={[styles.bracket, { color: theme.textSecondary }]}>[ ]</Text>
                    </View>
                    <Text style={[styles.circleText, { color: theme.textSecondary }]}>Closed</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>

          {!isOpen && (
            <Text style={[styles.visibilityText, { color: theme.textSecondary }]}>
              You are not visible to others
            </Text>
          )}

          {isOpen && remainingTime > 0 && (
            <View style={styles.sessionInfo}>
              <View style={[styles.timerBadge, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <IconSymbol 
                  ios_icon_name="clock.fill" 
                  android_material_icon_name="schedule" 
                  size={18} 
                  color={theme.primary} 
                />
                <Text style={[styles.sessionTimer, { color: theme.text }]}>
                  Session ends at {formatEndTime(remainingTime)}
                </Text>
              </View>
              <View style={styles.sessionActions}>
                <TouchableOpacity onPress={() => {
                  hapticFeedback.light();
                  closeSession();
                }}>
                  <Text style={[styles.link, { color: theme.textSecondary }]}>Close now</Text>
                </TouchableOpacity>
                <Text style={[styles.separator, { color: theme.textSecondary }]}>•</Text>
                <TouchableOpacity onPress={handleExtend}>
                  <Text style={[styles.linkPrimary, { color: theme.primary }]}>Extend +30 min</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {userInterests.length > 0 && (
          <View style={styles.interestsSection}>
            <Text style={[styles.interestsTitle, { color: theme.text }]}>Your interests</Text>
            <View style={styles.interestsGrid}>
              {userInterests.map((interest, index) => (
                <View key={`user-interest-${index}-${interest}`} style={[styles.interestChip, { backgroundColor: theme.surface, borderColor: theme.border }, shadows.sm]}>
                  <Text style={styles.interestEmoji}>{getInterestEmoji(interest)}</Text>
                  <Text style={[styles.interestText, { color: theme.text }]}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? spacing.massive : 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.huge,
  },
  appTitle: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  location: {
    ...typography.caption,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  settingsButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: spacing.huge,
  },
  statusTitle: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  statusDescription: {
    ...typography.body,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.huge,
    lineHeight: 24,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
    height: 280,
  },
  glowOuter: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  progressRingContainer: {
    position: 'absolute',
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  circleButton: {
    width: '100%',
    height: '100%',
  },
  circleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bracketsContainer: {
    marginBottom: spacing.xs,
  },
  bracket: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -2,
  },
  circleText: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
    marginTop: spacing.xs,
  },
  visibilityText: {
    ...typography.caption,
    textAlign: 'center',
  },
  sessionInfo: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.md,
    width: '100%',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sessionTimer: {
    ...typography.body,
    fontWeight: '500',
  },
  sessionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  separator: {
    ...typography.caption,
  },
  link: {
    ...typography.caption,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  linkPrimary: {
    ...typography.caption,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  interestsSection: {
    width: '100%',
  },
  interestsTitle: {
    ...typography.bodyBold,
    marginBottom: spacing.md,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  interestEmoji: {
    fontSize: 15,
  },
  interestText: {
    ...typography.caption,
    fontWeight: '500',
  },
});
