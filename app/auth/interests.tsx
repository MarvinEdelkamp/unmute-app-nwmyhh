
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { interestCategories } from '@/data/interests';

export default function InterestsScreen() {
  const { updateUser, completeOnboarding } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 7) {
        Alert.alert('Maximum reached', 'You can select up to 7 interests');
        return;
      }
      setSelectedInterests([...selectedInterests, interest]);
    }
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

    if (selectedInterests.length >= 7) {
      Alert.alert('Maximum reached', 'You can select up to 7 interests');
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

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[commonStyles.title, styles.title]}>Choose your interests</Text>
        <Text style={[commonStyles.textSecondary, styles.subtitle]}>
          Select 3-7 things you&apos;re passionate about
        </Text>

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {selectedInterests.length} / 7 selected
          </Text>
        </View>

        {interestCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <View style={styles.interestsGrid}>
              {category.interests.map((interest, interestIndex) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interestIndex}
                    style={[
                      styles.interestChip,
                      isSelected && styles.interestChipSelected,
                    ]}
                    onPress={() => toggleInterest(interest)}
                  >
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
          <Text style={styles.categoryTitle}>Add your own</Text>
          <View style={styles.customInputContainer}>
            <TextInput
              style={[commonStyles.input, styles.customInput]}
              placeholder="Type a custom interest..."
              placeholderTextColor={colors.textSecondary}
              value={customInterest}
              onChangeText={setCustomInterest}
              onSubmitEditing={addCustomInterest}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[buttonStyles.primary, styles.addButton]}
              onPress={addCustomInterest}
            >
              <Text style={[buttonStyles.text, { color: colors.card }]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            buttonStyles.primary,
            styles.button,
            (selectedInterests.length < 3 || loading) && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedInterests.length < 3 || loading}
        >
          <Text style={[buttonStyles.text, { color: colors.card }]}>
            {loading ? 'Saving...' : 'Continue'}
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
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  counter: {
    backgroundColor: colors.highlight,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  category: {
    marginBottom: 24,
  },
  categoryTitle: {
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  interestChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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
    marginBottom: 24,
  },
  customInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  customInput: {
    flex: 1,
  },
  addButton: {
    paddingHorizontal: 20,
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
    opacity: 0.6,
  },
});
