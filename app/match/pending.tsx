
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, buttonStyles, spacing, typography, borderRadius, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function PendingMatchScreen() {
  const { matches, respondToMatch } = useSession();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isResponding, setIsResponding] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const mountedRef = React.useRef(false);
  const hasRespondedRef = React.useRef(false);

  const pendingMatch = matches.find(
    m => m.status === 'pending' || m.status === 'user_a_interested' || m.status === 'user_b_interested'
  );

  useEffect(() => {
    console.log('[PendingMatch] Screen mounted');
    mountedRef.current = true;
    hasRespondedRef.current = false;
    
    return () => {
      console.log('[PendingMatch] Screen unmounted');
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current || hasRespondedRef.current) {
      return;
    }

    if (!pendingMatch) {
      console.log('[PendingMatch] No pending match found, closing screen');
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          if (mountedRef.current) {
            router.back();
          }
        }, 200);
      }, 500);
      return;
    }

    if (pendingMatch.status === 'user_a_interested' || pendingMatch.status === 'user_b_interested') {
      const isCurrentUserInterested = 
        (pendingMatch.status === 'user_a_interested' && pendingMatch.userA.id === user?.id) ||
        (pendingMatch.status === 'user_b_interested' && pendingMatch.userB.id === user?.id);
      
      if (isCurrentUserInterested && !isResponding) {
        console.log('[PendingMatch] Current user already responded, navigating to confirm');
        hasRespondedRef.current = true;
        setTimeout(() => {
          if (mountedRef.current) {
            router.replace('/match/confirm');
          }
        }, 500);
      }
    }
  }, [pendingMatch?.status, pendingMatch?.id]);

  const handleInterested = async () => {
    if (isResponding || !pendingMatch || hasRespondedRef.current) return;
    
    console.log('[PendingMatch] User interested in match:', pendingMatch.id);
    setIsResponding(true);
    hasRespondedRef.current = true;
    
    try {
      await respondToMatch(pendingMatch.id, true);
      console.log('[PendingMatch] Response saved, navigating to confirm');
      
      setTimeout(() => {
        if (mountedRef.current) {
          router.replace('/match/confirm');
        }
        setTimeout(() => {
          setIsResponding(false);
        }, 500);
      }, 400);
    } catch (error) {
      console.error('[PendingMatch] Error responding to match:', error);
      setIsResponding(false);
      hasRespondedRef.current = false;
    }
  };

  const handleNotNow = async () => {
    if (isResponding || !pendingMatch || hasRespondedRef.current) return;
    
    console.log('[PendingMatch] User declined match:', pendingMatch.id);
    setIsResponding(true);
    hasRespondedRef.current = true;
    
    try {
      await respondToMatch(pendingMatch.id, false);
      console.log('[PendingMatch] Match declined, closing screen');
      
      setVisible(false);
      setTimeout(() => {
        if (mountedRef.current) {
          router.back();
        }
        setTimeout(() => {
          setIsResponding(false);
        }, 300);
      }, 200);
    } catch (error) {
      console.error('[PendingMatch] Error declining match:', error);
      setIsResponding(false);
      hasRespondedRef.current = false;
    }
  };

  const handleClose = () => {
    if (!isResponding) {
      console.log('[PendingMatch] User closed screen');
      setVisible(false);
      setTimeout(() => {
        if (mountedRef.current) {
          router.back();
        }
      }, 200);
    }
  };

  if (!pendingMatch) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[commonStyles.container, styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <View style={[styles.dragHandle, { backgroundColor: theme.border }]} />
        </View>

        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: theme.highlight }, shadows.md]}>
            <IconSymbol 
              ios_icon_name="person.2.fill" 
              android_material_icon_name="people" 
              size={40} 
              color={theme.primary} 
            />
          </View>

          <Text style={[styles.title, { color: theme.primaryDark }]}>
            Someone here shares your interests
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>You both love</Text>
            <View style={styles.interestsRow}>
              {pendingMatch.sharedInterests.map((interest, index) => (
                <View key={`shared-interest-${pendingMatch.id}-${index}-${interest}`} style={[styles.interestChip, { backgroundColor: theme.highlight, borderColor: theme.primary }]}>
                  <Text style={[styles.interestText, { color: theme.primary }]}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.locationSection}>
            <Text style={[styles.locationLabel, { color: theme.textSecondary }]}>Approximate area</Text>
            <View style={styles.locationRow}>
              <IconSymbol 
                ios_icon_name="location.fill" 
                android_material_icon_name="location_on" 
                size={16} 
                color={theme.primary} 
              />
              <Text style={[styles.locationText, { color: theme.text }]}>English Garden</Text>
            </View>
          </View>

          <View style={[styles.infoBox, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={20} 
              color={theme.primary} 
            />
            <Text style={[styles.infoText, { color: theme.text }]}>
              If you both agree, you&apos;ll see each other&apos;s profile and can say hi in person
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[buttonStyles.primary, styles.button, { backgroundColor: theme.primary }, shadows.md, isResponding && { opacity: 0.6 }]}
              onPress={handleInterested}
              disabled={isResponding}
            >
              <Text style={[buttonStyles.text, { color: theme.surface }]}>
                I&apos;m interested
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[buttonStyles.secondary, styles.button, { backgroundColor: theme.surface, borderColor: theme.border }, isResponding && { opacity: 0.6 }]}
              onPress={handleNotNow}
              disabled={isResponding}
            >
              <Text style={[buttonStyles.textSecondary, { color: theme.text }]}>Not now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleClose} 
          style={[styles.closeButton, { backgroundColor: theme.surface }, shadows.sm]}
          disabled={isResponding}
        >
          <IconSymbol 
            ios_icon_name="xmark" 
            android_material_icon_name="close" 
            size={18} 
            color={theme.primaryDark} 
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    fontSize: 26,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
  },
  interestText: {
    ...typography.body,
    fontWeight: '600',
  },
  locationSection: {
    marginBottom: spacing.xxl,
  },
  locationLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  locationText: {
    ...typography.body,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xxxl,
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    ...typography.body,
    fontSize: 15,
    lineHeight: 21,
  },
  buttonContainer: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  button: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: spacing.xxl,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
