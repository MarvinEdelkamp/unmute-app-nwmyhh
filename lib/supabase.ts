
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://unhzruguxdvxlepfeleb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuaHpydWd1eGR2eGxlcGZlbGViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODYwMTcsImV4cCI6MjA3OTU2MjAxN30.VUXIB9J3ZN4xLcW_2rye7rY72dFmTxI4JIxArdwT23E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
