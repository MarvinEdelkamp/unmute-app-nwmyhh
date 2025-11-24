
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { spacing, typography, borderRadius, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';

const PRESET_MESSAGES = [
  "I'm near the bar in a blue hoodie",
  "I'm at the table by the window",
  "Let's meet at the entrance in 2 min",
  "I'm standing near the coffee machine",
];

export default function ReadyMatchScreen() {
  const { matches, closeMatch } = useSession();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [customMessage, setCustomMessage] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const mountedRef = React.useRef(false);

  const readyMatch = matches.find(m => m.status === 'both_ready');

  useEffect(() => {
    console.log('[ReadyMatch] Screen mounted');
    mountedRef.current = true;
    
    return () => {
      console.log('[ReadyMatch] Screen unmounted');
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      return;
    }

    if (!readyMatch) {
      console.log('[ReadyMatch] No ready match found, closing screen');
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          if (mountedRef.current) {
            router.back();
          }
        }, 200);
      }, 500);
    }
  }, [readyMatch]);

  if (!readyMatch) {
    return null;
  }

  const otherUser = readyMatch.userA.id === user?.id ? readyMatch.userB : readyMatch.userA;

  const handleSayHi = () => {
    console.log('[ReadyMatch] User confirmed they will say hi');
    closeMatch(readyMatch.id);
    setVisible(false);
    setTimeout(() => {
      if (mountedRef.current) {
        router.back();
      }
    }, 200);
  };

  const handleChangedMind = () => {
    console.log('[ReadyMatch] User changed their mind');
    closeMatch(readyMatch.id);
    setVisible(false);
    setTimeout(() => {
      if (mountedRef.current) {
        router.back();
      }
    }, 200);
  };

  const handleBlockReport = () => {
    console.log('[ReadyMatch] Block or report pressed');
  };

  const handleClose = () => {
    console.log('[ReadyMatch] User closed screen');
    setVisible(false);
    setTimeout(() => {
      if (mountedRef.current) {
        router.back();
      }
    }, 200);
  };

  const handlePresetPress = (message: string) => {
    setSelectedPreset(message);
    console.log('[ReadyMatch] Preset message selected:', message);
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.primaryDark }]}>Match</Text>
          <TouchableOpacity onPress={handleClose} style={[styles.closeButton, { backgroundColor: theme.surface }, shadows.sm]}>
            <IconSymbol 
              ios_icon_name="xmark" 
              android_material_icon_name="close" 
              size={18} 
              color={theme.primaryDark} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.profileSection, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={[styles.avatarText, { color: theme.surface }]}>{getInitials(otherUser.name)}</Text>
              </View>
            </View>

            <Text style={[styles.name, { color: theme.primaryDark }]}>{otherUser.name}</Text>

            <View style={styles.locationRow}>
              <IconSymbol 
                ios_icon_name="location.fill" 
                android_material_icon_name="location_on" 
                size={14} 
                color={theme.textSecondary} 
              />
              <Text style={[styles.location, { color: theme.textSecondary }]}>English Garden</Text>
            </View>

            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>You both love</Text>
            <View style={styles.interestsRow}>
              {readyMatch.sharedInterests.map((interest, index) => (
                <View key={`shared-interest-${readyMatch.id}-${index}-${interest}`} style={[styles.interestChip, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
                  <Text style={[styles.interestText, { color: theme.primary }]}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.encouragementBox, { backgroundColor: theme.primary }, shadows.md]}>
            <IconSymbol 
              ios_icon_name="hand.wave.fill" 
              android_material_icon_name="waving_hand" 
              size={20} 
              color={theme.surface} 
            />
            <View style={styles.encouragementContent}>
              <Text style={[styles.encouragementTitle, { color: theme.surface }]}>Say hi for real</Text>
              <Text style={[styles.encouragementText, { color: theme.surface }]}>
                If you feel comfortable, go and say hi in person. A simple opener works.
              </Text>
              <View style={styles.exampleBox}>
                <Text style={[styles.exampleText, { color: theme.surface }]}>
                  &quot;Hi! Are you on Unmute? Looks like we both love Hiking.&quot;
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.coordinationSection}>
            <Text style={[styles.coordinationLabel, { color: theme.text }]}>Help them find you (optional)</Text>
            
            {PRESET_MESSAGES.map((message, index) => (
              <TouchableOpacity
                key={`preset-${index}-${message}`}
                style={[
                  styles.presetButton,
                  { backgroundColor: theme.surface, borderColor: theme.border },
                  selectedPreset === message && { backgroundColor: theme.highlight, borderColor: theme.primary }
                ]}
                onPress={() => handlePresetPress(message)}
              >
                <Text style={[
                  styles.presetText,
                  { color: theme.text },
                  selectedPreset === message && { color: theme.primary, fontWeight: '500' }
                ]}>
                  {message}
                </Text>
              </TouchableOpacity>
            ))}

            <TextInput
              style={[styles.customInput, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
              placeholder="Or type your own..."
              placeholderTextColor={theme.textSecondary}
              value={customMessage}
              onChangeText={setCustomMessage}
              multiline={false}
            />
          </View>

          <View style={[styles.infoBox, { backgroundColor: theme.highlight, borderColor: theme.border }]}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={18} 
              color={theme.primary} 
            />
            <Text style={[styles.infoText, { color: theme.text }]}>
              No in-app chat. Unmute creates the opportunity—the real conversation happens face to face.
            </Text>
          </View>

          <View style={[styles.expiryBox, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
            <IconSymbol 
              ios_icon_name="clock.fill" 
              android_material_icon_name="schedule" 
              size={18} 
              color={theme.textSecondary} 
            />
            <Text style={[styles.expiryText, { color: theme.textSecondary }]}>
              This match expires in a few minutes. If no one says hi, it disappears—no pressure, no awkwardness.
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.primary }, shadows.md]}
            onPress={handleSayHi}
          >
            <Text style={[styles.buttonText, { color: theme.surface }]}>
              I&apos;ll say hi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.buttonSecondary, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={handleChangedMind}
          >
            <Text style={[styles.buttonTextSecondary, { color: theme.text }]}>I changed my mind</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.reportButton}
            onPress={handleBlockReport}
          >
            <IconSymbol 
              ios_icon_name="exclamationmark.bubble.fill" 
              android_material_icon_name="report" 
              size={16} 
              color={theme.textSecondary} 
            />
            <Text style={[styles.reportText, { color: theme.textSecondary }]}>Block or report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: 240,
  },
  profileSection: {
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: spacing.xxl,
    borderWidth: 1,
  },
  avatarContainer: {
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
  },
  name: {
    ...typography.h1,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  location: {
    ...typography.caption,
  },
  sectionLabel: {
    ...typography.caption,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  interestChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
  },
  interestText: {
    ...typography.caption,
    fontWeight: '600',
  },
  encouragementBox: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xxl,
    flexDirection: 'row',
    gap: spacing.md,
  },
  encouragementContent: {
    flex: 1,
  },
  encouragementTitle: {
    ...typography.h2,
    fontSize: 17,
    marginBottom: spacing.sm,
  },
  encouragementText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  exampleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  exampleText: {
    ...typography.caption,
    fontStyle: 'italic',
    lineHeight: 19,
  },
  coordinationSection: {
    marginBottom: spacing.xxl,
  },
  coordinationLabel: {
    ...typography.bodyBold,
    marginBottom: spacing.md,
  },
  presetButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
  },
  presetText: {
    ...typography.body,
  },
  customInput: {
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    ...typography.body,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    ...typography.caption,
    lineHeight: 20,
  },
  expiryBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.md,
    borderWidth: 1,
  },
  expiryText: {
    flex: 1,
    ...typography.caption,
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xxl,
    gap: spacing.md,
    borderTopWidth: 1,
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
  buttonSecondary: {
    width: '100%',
    minHeight: 52,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  buttonTextSecondary: {
    ...typography.bodyBold,
    fontSize: 17,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  reportText: {
    ...typography.caption,
  },
});
