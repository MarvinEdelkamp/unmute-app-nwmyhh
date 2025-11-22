
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from '@/contexts/SessionContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const { user } = useAuth();
  const { isOpen, remainingTime, openSession, closeSession, matches } = useSession();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = async () => {
    if (isOpen) {
      await closeSession();
    } else {
      await openSession();
    }
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

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user?.name}! 👋</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/settings')}>
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
          <Animated.View style={[styles.circle, isOpen && styles.circleOpen, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={handleToggle}
              activeOpacity={0.8}
            >
              <IconSymbol 
                ios_icon_name={isOpen ? 'power' : 'power'} 
                android_material_icon_name="power_settings_new" 
                size={64} 
                color={isOpen ? colors.card : colors.textSecondary} 
              />
            </TouchableOpacity>
          </Animated.View>

          <Text style={[styles.statusText, isOpen && styles.statusTextOpen]}>
            {isOpen ? 'Open' : 'Closed'}
          </Text>

          <Text style={styles.statusDescription}>
            {isOpen 
              ? "We're looking for people nearby with shared interests" 
              : "You are not visible"}
          </Text>

          {isOpen && (
            <View style={styles.timerContainer}>
              <IconSymbol 
                ios_icon_name="clock.fill" 
                android_material_icon_name="schedule" 
                size={16} 
                color={colors.textSecondary} 
              />
              <Text style={styles.timerText}>
                Session closes in {formatTime(remainingTime)}
              </Text>
            </View>
          )}
        </View>

        {isOpen && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeSession}
          >
            <Text style={styles.closeButtonText}>Close now</Text>
          </TouchableOpacity>
        )}

        {!isOpen && user && user.interests.length > 0 && (
          <View style={styles.interestsPreview}>
            <Text style={styles.interestsTitle}>Your interests</Text>
            <View style={styles.interestsGrid}>
              {user.interests.slice(0, 6).map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
              {user.interests.length > 6 && (
                <View style={styles.interestChip}>
                  <Text style={styles.interestText}>+{user.interests.length - 6}</Text>
                </View>
              )}
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
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
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
  statusText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  statusTextOpen: {
    color: colors.primary,
  },
  statusDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  timerText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  interestsPreview: {
    width: '100%',
    marginTop: 32,
  },
  interestsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  interestText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
});
