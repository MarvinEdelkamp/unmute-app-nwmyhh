
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';
import { ProgressRing } from '@/components/ProgressRing';
import { spacing, typography, borderRadius, shadows } from '@/styles/commonStyles';
import { hapticFeedback } from '@/utils/haptics';
import { storage } from '@/utils/storage';
import { Match } from '@/types';

export default function HomeScreen() {
  const { user } = useAuth();
  const { isOpen, remainingTime, openSession, closeSession, extendSession, matches, refreshMatches } = useSession();
  const { theme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;
  const [isCreatingDemo, setIsCreatingDemo] = React.useState(false);
  const navigationLockRef = React.useRef(false);
  const lastMatchCountRef = React.useRef(0);

  useEffect(() => {
    if (isOpen) {
      // Subtle breathing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.015,
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

      // Subtle glow animation
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

  const handleDemoMatch = async () => {
    if (!user || isCreatingDemo || navigationLockRef.current) return;
    
    console.log('Demo button pressed - creating mock match');
    setIsCreatingDemo(true);
    navigationLockRef.current = true;
    hapticFeedback.medium();
    
    // Create a realistic demo match
    const mockMatch: Match = {
      id: `demo-${Date.now()}`,
      sessionAId: 'demo-session-a',
      sessionBId: 'demo-session-b',
      userA: user,
      userB: {
        id: 'demo-user',
        email: 'sophie@example.com',
        name: 'Sophie',
        interests: user.interests.slice(0, 2).length > 0 ? user.interests.slice(0, 2) : ['Hiking', 'Photography'],
        createdAt: new Date().toISOString(),
      },
      sharedInterests: user.interests.slice(0, 2).length > 0 ? user.interests.slice(0, 2) : ['Hiking', 'Photography'],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const existingMatches = await storage.getItem<Match[]>('matches') || [];
      const updatedMatches = [...existingMatches, mockMatch];
      await storage.setItem('matches', updatedMatches);
      
      console.log('Demo match created successfully:', mockMatch.id);
      
      // Refresh matches in context
      await refreshMatches();
      
      hapticFeedback.success();
      
      // Navigate to pending match screen after a short delay
      setTimeout(() => {
        console.log('Navigating to pending match screen');
        router.push('/match/pending');
        
        // Release the lock after navigation completes
        setTimeout(() => {
          setIsCreatingDemo(false);
          navigationLockRef.current = false;
        }, 1000);
      }, 300);
    } catch (error) {
      console.error('Error creating demo match:', error);
      hapticFeedback.error();
      setIsCreatingDemo(false);
      navigationLockRef.current = false;
    }
  };

  const pendingMatches = matches.filter(m => m.status === 'pending' || m.status === 'user_a_interested' || m.status === 'user_b_interested');
  const readyMatches = matches.filter(m => m.status === 'both_ready');

  // Auto-navigate to match screens when matches are available
  // But only if we're not in the middle of creating a demo or already navigating
  useEffect(() => {
    // Skip if navigation is locked or if match count hasn't changed
    if (navigationLockRef.current || matches.length === lastMatchCountRef.current) {
      return;
    }

    lastMatchCountRef.current = matches.length;

    // Only auto-navigate if there are new matches
    if (pendingMatches.length > 0) {
      console.log('Auto-navigating to pending match');
      navigationLockRef.current = true;
      hapticFeedback.success();
      
      setTimeout(() => {
        router.push('/match/pending');
        setTimeout(() => {
          navigationLockRef.current = false;
        }, 1000);
      }, 100);
    } else if (readyMatches.length > 0) {
      console.log('Auto-navigating to ready match');
      navigationLockRef.current = true;
      hapticFeedback.success();
      
      setTimeout(() => {
        router.push('/match/ready');
        setTimeout(() => {
          navigationLockRef.current = false;
        }, 1000);
      }, 100);
    }
  }, [matches.length, pendingMatches.length, readyMatches.length]);

  const getInterestEmoji = (interest: string) => {
    const emojiMap: { [key: string]: string } = {
      'Hiking': '🥾',
      'Running': '🏃',
      'Yoga': '🧘',
      'Cycling': '🚴',
      'Bouldering': '🧗',
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

  // Calculate progress for timer ring (0 to 1)
  const maxTime = 45 * 60; // 45 minutes in seconds
  const progress = isOpen && remainingTime > 0 ? remainingTime / maxTime : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.appTitle, { color: theme.text }]}>Unmute</Text>
          <View style={styles.locationRow}>
            <IconSymbol 
              ios_icon_name="location.fill" 
              android_material_icon_name="location_on" 
              size={14} 
              color={theme.textSecondary} 
            />
            <Text style={[styles.location, { color: theme.textSecondary }]}>Munich</Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            onPress={handleDemoMatch}
            disabled={isCreatingDemo || navigationLockRef.current}
            style={[
              styles.demoButton, 
              { backgroundColor: theme.card, borderColor: theme.primary }, 
              shadows.sm,
              (isCreatingDemo || navigationLockRef.current) && { opacity: 0.6 }
            ]}
          >
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto_awesome" 
              size={20} 
              color={theme.primary} 
            />
            <Text style={[styles.demoButtonText, { color: theme.primary }]}>Demo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              hapticFeedback.light();
              router.push('/(tabs)/settings');
            }}
            style={[styles.settingsButton, { backgroundColor: theme.card }, shadows.sm]}
          >
            <IconSymbol 
              ios_icon_name="gearshape.fill" 
              android_material_icon_name="settings" 
              size={24} 
              color={theme.text} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusTitle, { color: isOpen ? theme.primary : theme.text }]}>
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
                      outputRange: [0.1, 0.2],
                    }),
                    transform: [{
                      scale: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.08],
                      }),
                    }],
                  },
                ]}
              />
            )}
            
            {/* Progress ring around the circle */}
            {isOpen && remainingTime > 0 && (
              <View style={styles.progressRingContainer}>
                <ProgressRing
                  size={240}
                  strokeWidth={6}
                  progress={progress}
                  color={theme.primary}
                  backgroundColor={theme.border}
                />
              </View>
            )}

            <Animated.View 
              style={[
                styles.circle, 
                { 
                  backgroundColor: isOpen ? theme.primary : theme.disabled,
                  ...shadows.xl,
                },
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <TouchableOpacity
                style={styles.circleButton}
                onPress={handleToggle}
                activeOpacity={0.8}
              >
                <Text style={[styles.circleText, { color: isOpen ? theme.card : theme.textSecondary }]}>
                  {isOpen ? 'Open' : 'Closed'}
                </Text>
                {isOpen && remainingTime > 0 && (
                  <Text style={[styles.timerText, { color: theme.card }]}>
                    {formatTime(remainingTime)}
                  </Text>
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
              <Text style={[styles.sessionTimer, { color: theme.textSecondary }]}>
                Session ends at {formatEndTime(remainingTime)}
              </Text>
              <View style={styles.sessionActions}>
                <TouchableOpacity onPress={() => {
                  hapticFeedback.light();
                  closeSession();
                }}>
                  <Text style={[styles.link, { color: theme.text }]}>Close now</Text>
                </TouchableOpacity>
                <Text style={[styles.separator, { color: theme.textSecondary }]}>•</Text>
                <TouchableOpacity onPress={handleExtend}>
                  <Text style={[styles.linkPrimary, { color: theme.primary }]}>Extend +30 min</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {user && user.interests && user.interests.length > 0 && (
          <View style={styles.interestsSection}>
            <Text style={[styles.interestsTitle, { color: theme.text }]}>Your interests:</Text>
            <View style={styles.interestsGrid}>
              {user.interests.map((interest, index) => (
                <React.Fragment key={`interest-${interest}-${index}`}>
                  <View style={[styles.interestChip, { backgroundColor: theme.card, borderColor: theme.border }, shadows.sm]}>
                    <Text style={styles.interestEmoji}>{getInterestEmoji(interest)}</Text>
                    <Text style={[styles.interestText, { color: theme.text }]}>{interest}</Text>
                  </View>
                </React.Fragment>
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
    ...typography.title,
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
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },
  demoButtonText: {
    ...typography.caption,
    fontWeight: '600',
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
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  statusDescription: {
    ...typography.body,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.huge,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  timerText: {
    ...typography.heading,
    fontWeight: '500',
  },
  visibilityText: {
    ...typography.caption,
    textAlign: 'center',
  },
  sessionInfo: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  sessionTimer: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  sessionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    fontWeight: '500',
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
    fontSize: 16,
  },
  interestText: {
    ...typography.caption,
    fontWeight: '500',
  },
});
