
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { interestCategories } from '@/data/interests';
import { IconSymbol } from '@/components/IconSymbol';

export default function InterestsScreen() {
  const { updateUser, completeOnboarding } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 5) {
        Alert.alert('Maximum reached', 'You can select up to 5 interests');
        return;
      }
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (!trimmed) {
      return;
    }

    if (selectedInterests.includes(trimmed)) {
      Alert.alert('Already added', 'This interest is already in your list');
      return;
    }

    if (selectedInterests.length >= 5) {
      Alert.alert('Maximum reached', 'You can select up to 5 interests');
      return;
    }

    setSelectedInterests([...selectedInterests, trimmed]);
    setCustomInterest('');
  };

  const handleContinue = async () => {
    if (selectedInterests.length < 3) {
      Alert.alert('Select more interests', 'Please select at least 3 interests');
      return;
    }

    try {
      setLoading(true);
      await updateUser({ interests: selectedInterests });
      await completeOnboarding();
      router.replace('/(tabs)/(home)/');
    } catch (error) {
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

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[commonStyles.title, styles.title]}>What are you into?</Text>
        <Text style={[commonStyles.textSecondary, styles.subtitle]}>
          Choose 3–5 interests to find your people
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            {[0, 1, 2, 3, 4].map((index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index < selectedInterests.length && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>{selectedInterests.length}/5 selected</Text>
        </View>

        {selectedInterests.length > 0 && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>Your interests:</Text>
            <View style={styles.selectedGrid}>
              {selectedInterests.map((interest, index) => (
                <View key={index} style={styles.selectedChip}>
                  <Text style={styles.selectedEmoji}>{getInterestEmoji(interest)}</Text>
                  <Text style={styles.selectedText}>{interest}</Text>
                  <TouchableOpacity
                    onPress={() => removeInterest(interest)}
                    style={styles.removeButton}
                  >
                    <IconSymbol
                      ios_icon_name="xmark"
                      android_material_icon_name="close"
                      size={14}
                      color={colors.card}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {interestCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.category}>
            <TouchableOpacity
              style={styles.categoryButton}
              onPress={() => {
                const firstInterest = category.interests[0];
                if (firstInterest && !selectedInterests.includes(firstInterest)) {
                  toggleInterest(firstInterest);
                }
              }}
            >
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </TouchableOpacity>

            <View style={styles.interestsGrid}>
              {category.interests.map((interest, interestIndex) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interestIndex}
                    style={[
                      styles.interestCard,
                      isSelected && styles.interestCardSelected,
                    ]}
                    onPress={() => toggleInterest(interest)}
                  >
                    <Text style={styles.interestEmoji}>{getInterestEmoji(interest)}</Text>
                    <Text
                      style={[
                        styles.interestText,
                        isSelected && styles.interestTextSelected,
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
          <Text style={styles.customTitle}>Can&apos;t find what you&apos;re looking for?</Text>
          <View style={styles.customInputContainer}>
            <TextInput
              style={[commonStyles.input, styles.customInput]}
              placeholder="e.g. 'sourdough bread', 'looking for a..."
              placeholderTextColor={colors.textSecondary}
              value={customInterest}
              onChangeText={setCustomInterest}
              onSubmitEditing={addCustomInterest}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addIconButton}
              onPress={addCustomInterest}
            >
              <IconSymbol
                ios_icon_name="plus"
                android_material_icon_name="add"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.customHint}>
            We&apos;ll match you with people who share similar interests, even if worded differently
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            buttonStyles.primary,
            styles.button,
            selectedInterests.length < 3 && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedInterests.length < 3 || loading}
        >
          <Text style={[buttonStyles.text, { color: colors.card }]}>
            {selectedInterests.length < 3 
              ? 'Select at least 3 interests' 
              : loading 
              ? 'Saving...' 
              : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'left',
    marginBottom: 20,
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.disabled,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  selectedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 24,
  },
  selectedEmoji: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 14,
    color: colors.card,
    fontWeight: '500',
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  category: {
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestCard: {
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  interestCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  interestEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  interestTextSelected: {
    color: colors.card,
  },
  customSection: {
    marginTop: 12,
    marginBottom: 24,
  },
  customTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  customInput: {
    flex: 1,
  },
  addIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  customHint: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.background,
  },
  button: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
