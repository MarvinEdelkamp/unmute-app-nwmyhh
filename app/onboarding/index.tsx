
import React from 'react';
import { Redirect } from 'expo-router';

export default function OnboardingIndex() {
  // Redirect to the first onboarding screen
  return <Redirect href="/onboarding/how-it-works" />;
}
