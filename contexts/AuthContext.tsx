
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, getRedirectUrl } from '@/lib/supabase';
import { errorHandler } from '@/utils/errorHandler';
import { Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import Constants from 'expo-constants';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  photo_url: string | null;
  city: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface UserInterest {
  id: string;
  profile_id: string;
  interest_id: string | null;
  interest_label?: string;
  free_text_label: string | null;
  created_at: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  interests: UserInterest[];
  loading: boolean;
  hasCompletedOnboarding: boolean;
  signUp: (email: string) => Promise<void>;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  createProfile: (displayName: string, photoUrl?: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  setInterests: (interestLabels: string[]) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Test emails that will bypass magic link in Expo Go
const TEST_EMAILS = [
  'AABB@test.com',
  'test@test.com',
  'demo@test.com',
];

// Check if we're running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [interests, setInterestsState] = useState<UserInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log('[AuthContext] Initializing Supabase auth...');
    console.log('[AuthContext] Running in Expo Go:', isExpoGo);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthContext] Initial session:', session ? 'exists' : 'none');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[AuthContext] Auth state changed:', _event, session ? 'session exists' : 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadProfile(session.user.id);
        
        // Navigate to the appropriate screen after successful auth
        if (_event === 'SIGNED_IN') {
          console.log('[AuthContext] User signed in, checking onboarding status...');
          // The navigation will be handled by the root layout based on hasCompletedOnboarding
        }
      } else {
        setProfile(null);
        setInterestsState([]);
        setLoading(false);
      }
    });

    // Handle deep link for auth callback
    const handleDeepLink = async (event: { url: string }) => {
      console.log('[AuthContext] Deep link received:', event.url);
      
      const url = event.url;
      
      // Check if this is an auth callback with tokens
      if (url.includes('auth/callback') || url.includes('#access_token=') || url.includes('?access_token=')) {
        console.log('[AuthContext] Processing auth callback from deep link');
        
        try {
          // Try to extract tokens from hash fragment
          let accessToken: string | null = null;
          let refreshToken: string | null = null;
          
          // Check hash fragment (format: #access_token=xxx&refresh_token=yyy)
          const hashIndex = url.indexOf('#');
          if (hashIndex !== -1) {
            const hash = url.substring(hashIndex + 1);
            const params = new URLSearchParams(hash);
            accessToken = params.get('access_token');
            refreshToken = params.get('refresh_token');
          }
          
          // If not in hash, check query params (format: ?access_token=xxx&refresh_token=yyy)
          if (!accessToken) {
            const queryIndex = url.indexOf('?');
            if (queryIndex !== -1) {
              const query = url.substring(queryIndex + 1);
              const params = new URLSearchParams(query);
              accessToken = params.get('access_token');
              refreshToken = params.get('refresh_token');
            }
          }
          
          if (accessToken && refreshToken) {
            console.log('[AuthContext] Found auth tokens in deep link, setting session...');
            
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (error) {
              console.error('[AuthContext] Error setting session:', error);
              Alert.alert('Authentication Error', 'Failed to complete sign in. Please try again.');
            } else {
              console.log('[AuthContext] Session set successfully from deep link');
              Alert.alert('Success', 'You have been signed in successfully!');
            }
          } else {
            console.log('[AuthContext] No auth tokens found in deep link URL');
          }
        } catch (error) {
          console.error('[AuthContext] Exception processing deep link:', error);
          Alert.alert('Error', 'Failed to process authentication. Please try again.');
        }
      }
    };

    // Listen for deep links
    const subscription2 = Linking.addEventListener('url', handleDeepLink);

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('[AuthContext] App opened with URL:', url);
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.unsubscribe();
      subscription2.remove();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      console.log('[AuthContext] Loading profile for user:', userId);
      
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        console.log('[AuthContext] Profile loaded:', profileData.id);
        setProfile(profileData);

        // Load interests
        const { data: interestsData, error: interestsError } = await supabase
          .from('user_interests')
          .select(`
            *,
            interests (
              label
            )
          `)
          .eq('profile_id', profileData.id);

        if (interestsError) {
          throw interestsError;
        }

        const formattedInterests = (interestsData || []).map((ui: any) => ({
          ...ui,
          interest_label: ui.interests?.label || ui.free_text_label,
        }));

        console.log('[AuthContext] Interests loaded:', formattedInterests.length);
        setInterestsState(formattedInterests);
      } else {
        console.log('[AuthContext] No profile found for user');
        setProfile(null);
        setInterestsState([]);
      }
    } catch (error) {
      console.error('[AuthContext] Error loading profile:', error);
      errorHandler.logError(error as Error, 'AUTH_LOAD_PROFILE');
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  // Dummy login function for testing in Expo Go
  const dummyLogin = async (email: string) => {
    console.log('[AuthContext] Using dummy login for testing in Expo Go');
    
    try {
      // Create a mock session
      const mockUser: SupabaseUser = {
        id: `test-user-${email.replace(/[^a-zA-Z0-9]/g, '-')}`,
        email: email,
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      // Set the mock user
      setUser(mockUser);
      
      // Check if profile exists for this test user
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', mockUser.id)
        .is('deleted_at', null)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('[AuthContext] Error checking for existing profile:', profileError);
      }

      if (existingProfile) {
        console.log('[AuthContext] Found existing test profile');
        setProfile(existingProfile);
        
        // Load interests
        const { data: interestsData } = await supabase
          .from('user_interests')
          .select(`
            *,
            interests (
              label
            )
          `)
          .eq('profile_id', existingProfile.id);

        const formattedInterests = (interestsData || []).map((ui: any) => ({
          ...ui,
          interest_label: ui.interests?.label || ui.free_text_label,
        }));

        setInterestsState(formattedInterests);
      } else {
        console.log('[AuthContext] No existing test profile, user will need to complete onboarding');
        setProfile(null);
        setInterestsState([]);
      }

      setLoading(false);

      Alert.alert(
        'Test Login Successful',
        `You are now logged in with test account: ${email}\n\nThis is a dummy login for testing in Expo Go only.`,
        [{ text: 'OK' }]
      );

      console.log('[AuthContext] Dummy login successful');
    } catch (error) {
      console.error('[AuthContext] Dummy login error:', error);
      Alert.alert('Error', 'Failed to perform test login. Please try again.');
      throw error;
    }
  };

  const signUp = async (email: string) => {
    try {
      console.log('[AuthContext] Signing up with email:', email);
      
      // Check if this is a test email in Expo Go
      if (isExpoGo && TEST_EMAILS.includes(email)) {
        console.log('[AuthContext] Test email detected in Expo Go, using dummy login');
        await dummyLogin(email);
        return;
      }
      
      const redirectUrl = getRedirectUrl();
      console.log('[AuthContext] Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      Alert.alert(
        'Check your email',
        `We sent you a magic link to sign in. Please check your email (${email}) and click the link to continue.\n\nIMPORTANT: After clicking the link in your email, you may need to manually return to this app.`,
        [{ text: 'OK' }]
      );

      console.log('[AuthContext] Magic link sent successfully');
    } catch (error) {
      console.error('[AuthContext] Sign up error:', error);
      
      // Check for rate limit error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('security purposes') || errorMessage.includes('25 seconds') || errorMessage.includes('60 seconds')) {
        Alert.alert(
          'Please wait',
          'For security purposes, you can only request a magic link once every 60 seconds. Please wait a moment and try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', errorMessage);
      }
      
      errorHandler.logError(error as Error, 'AUTH_SIGNUP');
      throw error;
    }
  };

  const signIn = async (email: string) => {
    try {
      console.log('[AuthContext] Signing in with email:', email);
      
      // Check if this is a test email in Expo Go
      if (isExpoGo && TEST_EMAILS.includes(email)) {
        console.log('[AuthContext] Test email detected in Expo Go, using dummy login');
        await dummyLogin(email);
        return;
      }
      
      const redirectUrl = getRedirectUrl();
      console.log('[AuthContext] Using redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      Alert.alert(
        'Check your email',
        `We sent you a magic link to sign in. Please check your email (${email}) and click the link to continue.\n\nIMPORTANT: After clicking the link in your email, you may need to manually return to this app.`,
        [{ text: 'OK' }]
      );

      console.log('[AuthContext] Magic link sent successfully');
    } catch (error) {
      console.error('[AuthContext] Sign in error:', error);
      
      // Check for rate limit error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('security purposes') || errorMessage.includes('25 seconds') || errorMessage.includes('60 seconds')) {
        Alert.alert(
          'Please wait',
          'For security purposes, you can only request a magic link once every 60 seconds. Please wait a moment and try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', errorMessage);
      }
      
      errorHandler.logError(error as Error, 'AUTH_SIGNIN');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('[AuthContext] Signing out...');
      
      // For dummy login, just clear the state
      if (isExpoGo && user && user.id.startsWith('test-user-')) {
        console.log('[AuthContext] Clearing dummy login session');
        setUser(null);
        setProfile(null);
        setInterestsState([]);
        console.log('[AuthContext] Signed out successfully (dummy)');
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setInterestsState([]);
      console.log('[AuthContext] Signed out successfully');
    } catch (error) {
      console.error('[AuthContext] Sign out error:', error);
      errorHandler.logError(error as Error, 'AUTH_SIGNOUT');
      throw error;
    }
  };

  const createProfile = async (displayName: string, photoUrl?: string) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      console.log('[AuthContext] Creating profile for user:', user.id);

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          display_name: displayName,
          photo_url: photoUrl || null,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('[AuthContext] Profile created:', data.id);
      setProfile(data);
    } catch (error) {
      console.error('[AuthContext] Create profile error:', error);
      errorHandler.logError(error as Error, 'AUTH_CREATE_PROFILE');
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user || !profile) {
        throw new Error('No user or profile');
      }

      console.log('[AuthContext] Updating profile:', profile.id);

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) throw error;

      console.log('[AuthContext] Profile updated');
      setProfile(data);
    } catch (error) {
      console.error('[AuthContext] Update profile error:', error);
      errorHandler.logError(error as Error, 'AUTH_UPDATE_PROFILE');
      throw error;
    }
  };

  const setInterests = async (interestLabels: string[]) => {
    try {
      if (!profile) {
        throw new Error('No profile');
      }

      console.log('[AuthContext] Setting interests:', interestLabels);

      // Delete existing interests
      const { error: deleteError } = await supabase
        .from('user_interests')
        .delete()
        .eq('profile_id', profile.id);

      if (deleteError) throw deleteError;

      // Get all interests from database
      const { data: allInterests, error: interestsError } = await supabase
        .from('interests')
        .select('*');

      if (interestsError) throw interestsError;

      // Prepare new interests
      const newInterests = interestLabels.map(label => {
        const interest = allInterests?.find(i => i.label === label);
        return {
          profile_id: profile.id,
          interest_id: interest?.id || null,
          free_text_label: interest ? null : label,
        };
      });

      // Insert new interests
      const { data, error: insertError } = await supabase
        .from('user_interests')
        .insert(newInterests)
        .select(`
          *,
          interests (
            label
          )
        `);

      if (insertError) throw insertError;

      const formattedInterests = (data || []).map((ui: any) => ({
        ...ui,
        interest_label: ui.interests?.label || ui.free_text_label,
      }));

      console.log('[AuthContext] Interests set successfully');
      setInterestsState(formattedInterests);
    } catch (error) {
      console.error('[AuthContext] Set interests error:', error);
      errorHandler.logError(error as Error, 'AUTH_SET_INTERESTS');
      throw error;
    }
  };

  const hasCompletedOnboarding = !!(user && profile && interests.length >= 3);

  console.log('[AuthContext] State - user:', user ? 'exists' : 'null', 'profile:', profile ? 'exists' : 'null', 'interests:', interests.length, 'onboarded:', hasCompletedOnboarding);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        interests,
        loading,
        hasCompletedOnboarding,
        signUp,
        signIn,
        signOut,
        createProfile,
        updateProfile,
        setInterests,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.warn('[AuthContext] useAuth must be used within an AuthProvider, using defaults');
    return {
      user: null,
      profile: null,
      interests: [],
      loading: false,
      hasCompletedOnboarding: false,
      signUp: async () => {},
      signIn: async () => {},
      signOut: async () => {},
      createProfile: async () => {},
      updateProfile: async () => {},
      setInterests: async () => {},
      refreshProfile: async () => {},
    };
  }
  return context;
}
