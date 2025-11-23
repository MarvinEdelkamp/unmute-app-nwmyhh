
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
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
  const [customMessage, setCustomMessage] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const mountedRef = React.useRef(false);

  const readyMatch = matches.find(m => m.status === 'both_ready');

  // Mark as mounted after initial render
  useEffect(() => {
    console.log('Ready match screen mounted');
    mountedRef.current = true;
    
    return () => {
      console.log('Ready match screen unmounted');
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // Don't do anything until we're fully mounted
    if (!mountedRef.current) {
      return;
    }

    if (!readyMatch) {
      console.log('No ready match found, closing screen');
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
    console.log('User confirmed they will say hi');
    closeMatch(readyMatch.id);
    setVisible(false);
    setTimeout(() => {
      if (mountedRef.current) {
        router.back();
      }
    }, 200);
  };

  const handleChangedMind = () => {
    console.log('User changed their mind');
    closeMatch(readyMatch.id);
    setVisible(false);
    setTimeout(() => {
      if (mountedRef.current) {
        router.back();
      }
    }, 200);
  };

  const handleBlockReport = () => {
    console.log('Block or report pressed');
  };

  const handleClose = () => {
    console.log('User closed ready match screen');
    setVisible(false);
    setTimeout(() => {
      if (mountedRef.current) {
        router.back();
      }
    }, 200);
  };

  const handlePresetPress = (message: string) => {
    setSelectedPreset(message);
    console.log('Preset message selected:', message);
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
      <View style={[commonStyles.container, styles.container]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Match</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <IconSymbol 
              ios_icon_name="xmark" 
              android_material_icon_name="close" 
              size={20} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {otherUser.avatar ? (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(otherUser.name)}</Text>
                </View>
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(otherUser.name)}</Text>
                </View>
              )}
            </View>

            <Text style={styles.name}>{otherUser.name}</Text>

            <View style={styles.locationRow}>
              <IconSymbol 
                ios_icon_name="location.fill" 
                android_material_icon_name="location_on" 
                size={16} 
                color={colors.textSecondary} 
              />
              <Text style={styles.location}>English Garden</Text>
            </View>

            <Text style={styles.sectionLabel}>You both love:</Text>
            <View style={styles.interestsRow}>
              {readyMatch.sharedInterests.map((interest, index) => (
                <View key={`shared-interest-${index}-${interest}`} style={styles.interestChip}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.encouragementBox}>
            <IconSymbol 
              ios_icon_name="hand.wave.fill" 
              android_material_icon_name="waving_hand" 
              size={20} 
              color={colors.primary} 
            />
            <View style={styles.encouragementContent}>
              <Text style={styles.encouragementTitle}>Say hi for real</Text>
              <Text style={styles.encouragementText}>
                If you feel comfortable, go and say hi in person. A simple opener works.
              </Text>
              <View style={styles.exampleBox}>
                <Text style={styles.exampleText}>
                  &quot;Hi! Are you on Unmute? Looks like we both love Hiking.&quot;
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.coordinationSection}>
            <Text style={styles.coordinationLabel}>Help them find you (optional)</Text>
            
            {PRESET_MESSAGES.map((message, index) => (
              <TouchableOpacity
                key={`preset-${index}-${message}`}
                style={[
                  styles.presetButton,
                  selectedPreset === message && styles.presetButtonSelected
                ]}
                onPress={() => handlePresetPress(message)}
              >
                <Text style={[
                  styles.presetText,
                  selectedPreset === message && styles.presetTextSelected
                ]}>
                  {message}
                </Text>
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.customInput}
              placeholder="Or type your own..."
              placeholderTextColor={colors.textSecondary}
              value={customMessage}
              onChangeText={setCustomMessage}
              multiline={false}
            />
          </View>

          <View style={styles.infoBox}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={18} 
              color={colors.primary} 
            />
            <Text style={styles.infoText}>
              No in-app chat. Unmute creates the opportunity—the real conversation happens face to face.
            </Text>
          </View>

          <View style={styles.expiryBox}>
            <IconSymbol 
              ios_icon_name="clock.fill" 
              android_material_icon_name="schedule" 
              size={18} 
              color={colors.textSecondary} 
            />
            <Text style={styles.expiryText}>
              This match expires in a few minutes. If no one says hi, it disappears—no pressure, no awkwardness.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[buttonStyles.primary, styles.button]}
            onPress={handleSayHi}
          >
            <Text style={[buttonStyles.text]}>
              I&apos;ll say hi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[buttonStyles.secondary, styles.button]}
            onPress={handleChangedMind}
          >
            <Text style={buttonStyles.textSecondary}>I changed my mind</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.reportButton}
            onPress={handleBlockReport}
          >
            <IconSymbol 
              ios_icon_name="exclamationmark.bubble.fill" 
              android_material_icon_name="report" 
              size={16} 
              color={colors.textSecondary} 
            />
            <Text style={styles.reportText}>Block or report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 240,
  },
  profileSection: {
    backgroundColor: colors.secondary,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.card,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  location: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  interestChip: {
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  interestText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  encouragementBox: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    flexDirection: 'row',
    gap: 12,
  },
  encouragementContent: {
    flex: 1,
  },
  encouragementTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 15,
    color: colors.card,
    lineHeight: 22,
    marginBottom: 12,
  },
  exampleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
  },
  exampleText: {
    fontSize: 14,
    color: colors.card,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  coordinationSection: {
    marginBottom: 24,
  },
  coordinationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  presetButton: {
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetButtonSelected: {
    backgroundColor: colors.highlight,
    borderColor: colors.primary,
  },
  presetText: {
    fontSize: 15,
    color: colors.text,
  },
  presetTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
  customInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 15,
    color: colors.text,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  expiryBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  expiryText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.background,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    width: '100%',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  reportText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
