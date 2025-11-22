
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const { user } = useAuth();
  const { isOpen, remainingTime, openSession, closeSession, extendSession, matches } = useSession();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
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
    return `${mins} min`;
  };

  const formatTimeDetailed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    
    if (hours > 0) {
      return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${remainingMins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = async () => {
    if (isOpen) {
      await closeSession();
    } else {
      await openSession();
    }
  };

  const handleExtend = async () => {
    await extendSession();
  };

  const pendingMatches = matches.filter(m => m.status === 'pending' || m.status === 'user_a_interested' || m.status === 'user_b_interested');
  const readyMatches = matches.filter(m => m.status === 'both_ready');

  useEffect(() => {
    if (pendingMatches.length > 0) {
      router.push('/match/pending');
    } else if (readyMatches.length > 0) {
      router.push('/match/ready');
    }
  }, [matches]);

  const getInterestEmoji = (interest: string) => {
    const emojiMap: { [key: string]: string } = {
      'Hiking': '🥾',
      'Running': '🏃',
      'Yoga': '🧘',
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

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>Unmute</Text>
          <Text style={styles.location}>Munich</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/settings')}
          style={styles.settingsButton}
        >
          <IconSymbol 
            ios_icon_name="gearshape.fill" 
            android_material_icon_name="settings" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>
            {isOpen ? "You're open to connect" : "Ready to connect?"}
          </Text>
          <Text style={styles.statusDescription}>
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
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.6],
                    }),
                    transform: [{
                      scale: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.15],
                      }),
                    }],
                  },
                ]}
              />
            )}
            <Animated.View 
              style={[
                styles.circle, 
                isOpen && styles.circleOpen,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <TouchableOpacity
                style={styles.circleButton}
                onPress={handleToggle}
                activeOpacity={0.8}
              >
                <Text style={[styles.circleText, isOpen && styles.circleTextOpen]}>
                  {isOpen ? 'Open' : 'Closed'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <Text style={styles.visibilityText}>
            {isOpen 
              ? "" 
              : "You are not visible to others"}
          </Text>

          {isOpen && (
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTimer}>
                Session auto-closes in {formatTime(remainingTime)} (ends at {new Date(Date.now() + remainingTime * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})
              </Text>
              <View style={styles.sessionActions}>
                <TouchableOpacity onPress={closeSession}>
                  <Text style={buttonStyles.link}>Close now</Text>
                </TouchableOpacity>
                <Text style={styles.separator}>•</Text>
                <TouchableOpacity onPress={handleExtend}>
                  <Text style={buttonStyles.linkPrimary}>Extend +30 min</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {user && user.interests.length > 0 && (
          <View style={styles.interestsSection}>
            <Text style={styles.interestsTitle}>Your interests:</Text>
            <View style={styles.interestsGrid}>
              {user.interests.slice(0, 6).map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestEmoji}>{getInterestEmoji(interest)}</Text>
                  <Text style={styles.interestText}>{interest}</Text>
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
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  statusDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
    lineHeight: 22,
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  glowOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary,
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 8px 24px ${colors.shadow}`,
    elevation: 8,
  },
  circleOpen: {
    backgroundColor: colors.primary,
  },
  circleButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  circleTextOpen: {
    color: colors.card,
  },
  visibilityText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sessionInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  sessionTimer: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  sessionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  separator: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  interestsSection: {
    width: '100%',
  },
  interestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  interestEmoji: {
    fontSize: 16,
  },
  interestText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});
