
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { interestCategories } from '@/data/interests';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { spacing, typography, borderRadius, shadows } from '@/styles/commonStyles';
import { hapticFeedback } from '@/utils/haptics';
import { validation, sanitize } from '@/utils/validation';
import { errorHandler } from '@/utils/errorHandler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function InterestsScreen() {
  const { updateUser, completeOnboarding } = useAuth();
  const { theme } = useTheme();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(interestCategories[0].id);
  const [customInterest, setCustomInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      hapticFeedback.light();
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      hapticFeedback.selection();
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    hapticFeedback.light();
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const addCustomInterest = () => {
    const trimmed = sanitize.text(customInterest);
    
    const customValidation = validation.customInterest(trimmed);
    if (!customValidation.valid) {
      hapticFeedback.warning();
      errorHandler.showValidationError(customValidation.error || 'Invalid interest');
      return;
    }

    if (selectedInterests.includes(trimmed)) {
      hapticFeedback.warning();
      errorHandler.showError('This interest is already in your list', 'Already Added');
      return;
    }

    hapticFeedback.success();
    setSelectedInterests([...selectedInterests, trimmed]);
    setCustomInterest('');
  };

  const handleContinue = async () => {
    const interestsValidation = validation.interests(selectedInterests);
    if (!interestsValidation.valid) {
      hapticFeedback.warning();
      errorHandler.showValidationError(interestsValidation.error || 'Please select at least 3 interests');
      return;
    }

    try {
      setLoading(true);
      hapticFeedback.medium();
      
      await updateUser({ interests: selectedInterests });
      
      hapticFeedback.success();
      router.replace('/(tabs)/(home)/');
    } catch (error) {
      hapticFeedback.error();
      const errorMessage = error instanceof Error ? error.message : 'Failed to save interests';
      errorHandler.showError(errorMessage);
      console.error('Save interests error:', error);
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

  const currentCategory = interestCategories.find(cat => cat.id === selectedCategory) || interestCategories[0];
  const canContinue = selectedInterests.length >= 3;

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

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            {[0, 1, 2, 3, 4].map((index) => (
              <View
                key={`progress-dot-${index}`}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: index < selectedInterests.length ? theme.primary : theme.border,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {selectedInterests.length}/5 selected
          </Text>
        </View>

        {/* Selected interests */}
        {selectedInterests.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Your interests:</Text>
            <View style={styles.selectedChipsContainer}>
              {selectedInterests.map((interest, index) => (
                <View key={`selected-${interest}-${index}`} style={[styles.selectedChip, { backgroundColor: theme.primary }, shadows.sm]}>
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

        {/* Category selector */}
        <View style={styles.categorySection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {interestCategories.map((category) => {
              const isSelected = category.id === selectedCategory;
              return (
                <TouchableOpacity
                  key={`category-${category.id}`}
                  style={[
                    styles.categoryChip,
                    { 
                      backgroundColor: isSelected ? theme.primary : theme.card,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                    shadows.sm,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    hapticFeedback.light();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: isSelected ? theme.card : theme.text },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Interests grid */}
        <View style={styles.interestsGrid}>
          {currentCategory.interests.map((interest, index) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <TouchableOpacity
                key={`interest-${currentCategory.id}-${interest}-${index}`}
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
                  numberOfLines={2}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom interest input */}
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
              placeholder="e.g. 'sourdough bread', 'looking for a gym buddy'"
              placeholderTextColor={theme.textSecondary}
              value={customInterest}
              onChangeText={setCustomInterest}
              onSubmitEditing={addCustomInterest}
              returnKeyType="done"
              maxLength={50}
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

      {/* Fixed bottom button */}
      <View style={[styles.buttonContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={[
            styles.button,
            { 
              backgroundColor: canContinue ? theme.primary : theme.border,
            },
            shadows.md,
          ]}
          onPress={handleContinue}
          disabled={!canContinue || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <Text style={[styles.buttonText, { color: canContinue ? theme.card : theme.textSecondary }]}>
              {canContinue 
                ? 'Select at least 3 interests' 
                : `Select ${3 - selectedInterests.length} more`}
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
  progressDots: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  progressDot: {
    width: 40,
    height: 8,
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
  selectedChipsContainer: {
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
  categorySection: {
    marginBottom: spacing.xl,
  },
  categoryScrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.xxl,
  },
  categoryChip: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xxl,
    borderWidth: 1.5,
  },
  categoryChipText: {
    ...typography.caption,
    fontWeight: '600',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  interestCard: {
    width: (SCREEN_WIDTH - spacing.xxl * 2 - spacing.md * 2) / 3,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 100,
    justifyContent: 'center',
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
});
