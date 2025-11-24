
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, buttonStyles, spacing, typography, borderRadius, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function ConfirmMatchScreen() {
  const { matches, respondToMatch } = useSession();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [visible, setVisible] = React.useState(true);
  const [isConfirming, setIsConfirming] = React.useState(false);
  const mountedRef = React.useRef(false);
  const hasConfirmedRef = React.useRef(false);

  const readyMatch = matches.find(
    m => m.status === 'user_a_accepted' || m.status === 'user_b_accepted'
  );

  useEffect(() => {
    console.log('[ConfirmMatch] Screen mounted');
    mountedRef.current = true;
    hasConfirmedRef.current = false;
    
    return () => {
      console.log('[ConfirmMatch] Screen unmounted');
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current || hasConfirmedRef.current) {
      return;
    }

    if (!readyMatch) {
      console.log('[ConfirmMatch] No match waiting for confirmation, going back');
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

    const bothReady = matches.find(m => m.id === readyMatch.id && m.status === 'both_accepted');
    if (bothReady) {
      console.log('[ConfirmMatch] Both users ready, navigating to ready screen');
      hasConfirmedRef.current = true;
      setTimeout(() => {
        if (mountedRef.current) {
          router.replace('/match/ready');
        }
      }, 500);
    }
  }, [readyMatch?.id, matches]);

  const handleConfirm = async () => {
    if (!readyMatch || isConfirming || hasConfirmedRef.current) return;
    
    console.log('[ConfirmMatch] User confirmed match:', readyMatch.id);
    setIsConfirming(true);
    hasConfirmedRef.current = true;
    
    try {
      // If current user hasn't accepted yet, accept now
      const isUserA = readyMatch.user_a_id === user?.id;
      const hasAccepted = 
        (isUserA && readyMatch.status === 'user_a_accepted') ||
        (!isUserA && readyMatch.status === 'user_b_accepted');

      if (!hasAccepted) {
        await respondToMatch(readyMatch.id, true);
      }
      
      console.log('[ConfirmMatch] Match confirmed, navigating to ready screen');
      
      setTimeout(() => {
        if (mountedRef.current) {
          router.replace('/match/ready');
        }
        setTimeout(() => {
          setIsConfirming(false);
        }, 500);
      }, 400);
    } catch (error) {
      console.error('[ConfirmMatch] Error confirming match:', error);
      setIsConfirming(false);
      hasConfirmedRef.current = false;
    }
  };

  const handleNotInterested = () => {
    if (isConfirming) return;
    
    console.log('[ConfirmMatch] User not interested in confirming');
    setVisible(false);
    setTimeout(() => {
      if (mountedRef.current) {
        router.back();
      }
    }, 200);
  };

  const handleClose = () => {
    if (isConfirming) return;
    
    console.log('[ConfirmMatch] User closed screen');
    setVisible(false);
    setTimeout(() => {
      if (mountedRef.current) {
        router.back();
      }
    }, 200);
  };

  if (!readyMatch) {
    return null;
  }

  const infoItems = [
    'Your first name',
    'Your profile photo (if set)',
    'Your shared interests',
    'Approximate location'
  ];

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
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={40} 
              color={theme.primary} 
            />
          </View>

          <Text style={[styles.title, { color: theme.primaryDark }]}>
            Are you ready to meet?
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Once you both confirm, you can coordinate and meet
          </Text>

          <View style={[styles.infoBox, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.text }]}>They'll see</Text>
            
            {infoItems.map((item, index) => (
              <View key={`info-item-${index}-${item}`} style={styles.infoItem}>
                <View style={[styles.checkCircle, { backgroundColor: theme.highlight }]}>
                  <IconSymbol 
                    ios_icon_name="checkmark" 
                    android_material_icon_name="check" 
                    size={14} 
                    color={theme.primary} 
                  />
                </View>
                <Text style={[styles.infoText, { color: theme.text }]}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.privacyBox, { backgroundColor: theme.highlight, borderColor: theme.border }]}>
            <IconSymbol 
              ios_icon_name="lock.fill" 
              android_material_icon_name="lock" 
              size={18} 
              color={theme.primary} 
            />
            <Text style={[styles.privacyText, { color: theme.text }]}>
              Your privacy: We never share your exact location. Only both of you can see this match.
            </Text>
          </View>
        </View>

        <View style={[styles.buttonContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TouchableOpacity 
            style={[buttonStyles.primary, styles.button, { backgroundColor: theme.primary }, shadows.md, isConfirming && { opacity: 0.6 }]}
            onPress={handleConfirm}
            disabled={isConfirming}
          >
            <Text style={[buttonStyles.text, { color: theme.surface }]}>
              Yes, I&apos;m ready
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[buttonStyles.secondary, styles.button, { backgroundColor: theme.surface, borderColor: theme.border }, isConfirming && { opacity: 0.6 }]}
            onPress={handleNotInterested}
            disabled={isConfirming}
          >
            <Text style={[buttonStyles.textSecondary, { color: theme.text }]}>Not interested</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={handleClose} 
          style={[styles.closeButton, { backgroundColor: theme.surface }, shadows.sm]}
          disabled={isConfirming}
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
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoBox: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
  },
  infoLabel: {
    ...typography.bodyBold,
    marginBottom: spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  infoText: {
    ...typography.body,
    flex: 1,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    gap: spacing.md,
    borderWidth: 1,
  },
  privacyText: {
    flex: 1,
    ...typography.caption,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: spacing.xxl,
    gap: spacing.md,
    borderTopWidth: 1,
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
