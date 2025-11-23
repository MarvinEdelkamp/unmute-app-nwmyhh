
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
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
  const scrollViewRef = useRef<ScrollView>(null);

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
      'Swimming': '🏊',
      'Gym': '🏋️',
      'Basketball': '🏀',
      'Soccer': '⚽',
      'Tennis': '🎾',
      'Rock Climbing': '🧗',
      'Live Music': '🎸',
      'Jazz': '🎷',
      'Rock': '🎸',
      'Electronic': '🎧',
      'Hip Hop': '🎤',
      'Classical': '🎻',
      'Indie': '🎸',
      'Playing Guitar': '🎸',
      'DJing': '🎧',
      'Singing': '🎤',
      'Craft Beer': '🍺',
      'Wine': '🍷',
      'Baking': '🧁',
      'Vegan Food': '🥗',
      'Street Food': '🌮',
      'Fine Dining': '🍽️',
      'Food Photography': '📸',
      'Mixology': '🍸',
      'Painting': '🎨',
      'Museums': '🏛️',
      'Theater': '🎭',
      'Film': '🎬',
      'Writing': '✍️',
      'Poetry': '📝',
      'Dance': '💃',
      'Sculpture': '🗿',
      'Street Art': '🎨',
      'Coding': '💻',
      'AI': '🤖',
      'Startups': '🚀',
      'VR/AR': '🥽',
      'Crypto': '₿',
      'Robotics': '🤖',
      'Open Source': '💻',
      'Web3': '🌐',
      'Mobile Apps': '📱',
      'Board Games': '🎲',
      'Chess': '♟️',
      'Video Games': '🎮',
      'Card Games': '🃏',
      'Poker': '🃏',
      'Trivia': '❓',
      'Escape Rooms': '🔐',
      'D&D': '🎲',
      'Strategy Games': '♟️',
      'Party Games': '🎉',
      'Book Clubs': '📚',
      'Science Fiction': '🚀',
      'Non-Fiction': '📖',
      'Philosophy': '🤔',
      'History': '📜',
      'Psychology': '🧠',
      'Languages': '🗣️',
      'Podcasts': '🎙️',
      'Documentaries': '🎥',
      'Networking': '🤝',
      'Volunteering': '❤️',
      'Community Events': '🎪',
      'Meetups': '👥',
      'Public Speaking': '🎤',
      'Activism': '✊',
      'Sustainability': '♻️',
      'Entrepreneurship': '💼',
      'Mentoring': '👨‍🏫',
      'Coworking': '💼',
    };
    return emojiMap[interest] || '✨';
  };

  const progress = selectedInterests.length / 5;

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.text }]}>What are you into?</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Choose 3–5 interests to find your people
        </Text>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
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
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedScrollContent}
            >
              {selectedInterests.map((interest, index) => (
                <View key={`selected-${index}`} style={[styles.selectedChip, { backgroundColor: theme.primary }, shadows.sm]}>
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
            </ScrollView>
          </View>
        )}

        {interestCategories.map((category, categoryIndex) => (
          <View key={`category-${categoryIndex}`} style={styles.category}>
            <View style={[styles.categoryHeader, { backgroundColor: theme.primary }, shadows.sm]}>
              <Text style={[styles.categoryTitle, { color: theme.card }]}>{category.name}</Text>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.interestsScrollContent}
            >
              {category.interests.map((interest, interestIndex) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <TouchableOpacity
                    key={`interest-${categoryIndex}-${interestIndex}`}
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
            </ScrollView>
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
              placeholder="e.g. 'sourdough bread', 'looking for a..."
              placeholderTextColor={theme.textSecondary}
              value={customInterest}
              onChangeText={setCustomInterest}
              onSubmitEditing={addCustomInterest}
              returnKeyType="done"
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
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
            We&apos;ll match you with people who share similar interests, even if worded differently
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
                ? `Select at least ${3 - selectedInterests.length} more` 
                : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? spacing.massive : 60,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: 140,
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
  selectedScrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.xxl,
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
  interestsScrollContent: {
    gap: spacing.md,
    paddingRight: spacing.xxl,
  },
  interestCard: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minWidth: 110,
    borderWidth: 1.5,
  },
  interestEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  interestText: {
    ...typography.caption,
    fontWeight: '500',
    textAlign: 'center',
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
    paddingVertical: spacing.lg + spacing.xs,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonText: {
    ...typography.bodyBold,
    fontSize: 17,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
