
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { interestCategories } from '@/data/interests';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { spacing, typography, borderRadius, shadows } from '@/styles/commonStyles';
import { hapticFeedback } from '@/utils/haptics';

export default function InterestsScreen() {
  const { updateUser, completeOnboarding } = useAuth();
  const { theme } = useTheme();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      hapticFeedback.light();
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 5) {
        hapticFeedback.warning();
        Alert.alert('Maximum reached', 'You can select up to 5 interests');
        return;
      }
      hapticFeedback.selection();
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    hapticFeedback.light();
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) {
      return;
    }

    if (selectedInterests.includes(trimmed)) {
      hapticFeedback.warning();
      Alert.alert('Already added', 'This interest is already in your list');
      return;
    }

    if (selectedInterests.length >= 5) {
      hapticFeedback.warning();
      Alert.alert('Maximum reached', 'You can select up to 5 interests');
      return;
    }

    hapticFeedback.success();
    setSelectedInterests([...selectedInterests, trimmed]);
    setCustomInterest('');
  };

  const handleContinue = async () => {
    if (selectedInterests.length < 3) {
      hapticFeedback.warning();
      Alert.alert('Select more interests', 'Please select at least 3 interests');
      return;
    }

    try {
      setLoading(true);
      hapticFeedback.medium();
      await updateUser({ interests: selectedInterests });
      await completeOnboarding();
      hapticFeedback.success();
      router.replace('/(tabs)/(home)/');
    } catch (error) {
      hapticFeedback.error();
      Alert.alert('Error', 'Failed to save interests. Please try again.');
      console.log('Save interests error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const progress = selectedInterests.length / 5;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.text }]}>What are you into?</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Choose 3–5 interests to find your people
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: theme.primary,
                  width: `${progress * 100}%`,
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {selectedInterests.length}/5 selected
          </Text>
        </View>

        {selectedInterests.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Your interests:</Text>
            <View style={styles.selectedGrid}>
              {selectedInterests.map((interest, index) => (
                <View key={index} style={[styles.selectedChip, { backgroundColor: theme.primary }, shadows.sm]}>
                  <Text style={styles.selectedEmoji}>{getInterestEmoji(interest)}</Text>
                  <Text style={[styles.selectedText, { color: theme.card }]}>{interest}</Text>
                  <TouchableOpacity
                    onPress={() => removeInterest(interest)}
                    style={styles.removeButton}
                  >
                    <IconSymbol
                      ios_icon_name="xmark"
                      android_material_icon_name="close"
                      size={14}
                      color={theme.card}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {interestCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.category}>
            <View style={[styles.categoryHeader, { backgroundColor: theme.primary }, shadows.sm]}>
              <Text style={[styles.categoryTitle, { color: theme.card }]}>{category.name}</Text>
            </View>

            <View style={styles.interestsGrid}>
              {category.interests.map((interest, interestIndex) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interestIndex}
                    style={[
                      styles.interestCard,
                      { 
                        backgroundColor: isSelected ? theme.primary : theme.card,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                      shadows.sm,
                    ]}
                    onPress={() => toggleInterest(interest)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.interestEmoji}>{getInterestEmoji(interest)}</Text>
                    <Text
                      style={[
                        styles.interestText,
                        { color: isSelected ? theme.card : theme.text },
                      ]}
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.customSection}>
          <Text style={[styles.customTitle, { color: theme.text }]}>
            Can&apos;t find what you&apos;re looking for?
          </Text>
          <View style={styles.customInputContainer}>
            <TextInput
              style={[
                styles.customInput,
                { 
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                }
              ]}
              placeholder="e.g. 'sourdough bread'"
              placeholderTextColor={theme.textSecondary}
              value={customInterest}
              onChangeText={setCustomInterest}
              onSubmitEditing={addCustomInterest}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[
                styles.addIconButton,
                { backgroundColor: theme.card, borderColor: theme.border },
                shadows.sm,
              ]}
              onPress={addCustomInterest}
            >
              <IconSymbol
                ios_icon_name="plus"
                android_material_icon_name="add"
                size={24}
                color={theme.primary}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.customHint, { color: theme.textSecondary }]}>
            We&apos;ll match you with people who share similar interests
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={[
            styles.button,
            { backgroundColor: theme.primary },
            selectedInterests.length < 3 && styles.buttonDisabled,
            shadows.md,
          ]}
          onPress={handleContinue}
          disabled={selectedInterests.length < 3 || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <Text style={[styles.buttonText, { color: theme.card }]}>
              {selectedInterests.length < 3 
                ? `Select ${3 - selectedInterests.length} more` 
                : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? spacing.massive : 60,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: 120,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
  progressContainer: {
    marginBottom: spacing.xxl,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.round,
  },
  progressText: {
    ...typography.caption,
  },
  selectedSection: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.bodyBold,
    marginBottom: spacing.md,
  },
  selectedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    borderRadius: borderRadius.xxl,
  },
  selectedEmoji: {
    fontSize: 16,
  },
  selectedText: {
    ...typography.caption,
    fontWeight: '500',
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  category: {
    marginBottom: spacing.xl,
  },
  categoryHeader: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xxl,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  categoryTitle: {
    ...typography.bodyBold,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  interestCard: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1.5,
  },
  interestEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  interestText: {
    ...typography.caption,
    fontWeight: '500',
  },
  customSection: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  customTitle: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  customInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...typography.body,
  },
  addIconButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  customHint: {
    ...typography.small,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xxl,
    borderTopWidth: 1,
  },
  button: {
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.bodyBold,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
