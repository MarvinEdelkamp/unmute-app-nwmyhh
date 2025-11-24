
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

const supabaseUrl = 'https://unhzruguxdvxlepfeleb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaHpydWd1eGR2eGxlcGZlbGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODYwMTcsImV4cCI6MjA3OTU2MjAxN30.VUXIB9J3ZN4xLcW_2rye7rY72dFmTxI4JIxArdwT23E';

// Get the redirect URL for the current environment
export const getRedirectUrl = () => {
  // For Expo Go, we need to use the app's deep link URL
  const url = Linking.createURL('auth/callback');
  console.log('[Supabase] Redirect URL:', url);
  return url;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Enable for web and deep link support
  },
});
