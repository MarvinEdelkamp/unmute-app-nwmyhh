
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import Constants from 'expo-constants';

const supabaseUrl = 'https://unhzruguxdvxlepfeleb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaHpydWd1eGR2eGxlcGZlbGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODYwMTcsImV4cCI6MjA3OTU2MjAxN30.VUXIB9J3ZN4xLcW_2rye7rY72dFmTxI4JIxArdwT23E';

// Get the redirect URL for the current environment
export const getRedirectUrl = () => {
  // For Expo Go, we need to use the app's deep link URL
  // The format is: exp://[IP_ADDRESS]:[PORT]/--/auth/callback
  const url = Linking.createURL('auth/callback');
  console.log('[Supabase] Generated redirect URL:', url);
  
  // For Expo Go, the URL will be something like:
  // exp://192.168.1.100:8081/--/auth/callback
  // This is what Supabase will redirect to after email confirmation
  
  return url;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable automatic URL detection, we'll handle it manually
  },
});
