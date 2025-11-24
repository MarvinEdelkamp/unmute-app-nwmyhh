
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, getRedirectUrl } from '@/lib/supabase';
import { errorHandler } from '@/utils/errorHandler';
import { Alert } from 'react-native';
import * as Linking from 'expo-linking';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [interests, setInterestsState] = useState<UserInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log('[AuthContext] Initializing Supabase auth...');
    
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
      } else {
        setProfile(null);
        setInterestsState([]);
        setLoading(false);
      }
    });

    // Handle deep link for auth callback
    const handleDeepLink = async (event: { url: string }) => {
      console.log('[AuthContext] Deep link received:', event.url);
      
      // Parse the URL to extract auth tokens
      const url = event.url;
      
      // Check if this is an auth callback
      if (url.includes('auth/callback') || url.includes('#access_token=')) {
        console.log('[AuthContext] Processing auth callback from deep link');
        
        // Extract the hash fragment if present
        const hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
          const hash = url.substring(hashIndex + 1);
          const params = new URLSearchParams(hash);
          
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken && refreshToken) {
            console.log('[AuthContext] Setting session from deep link tokens');
            
            try {
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
            } catch (error) {
              console.error('[AuthContext] Exception setting session:', error);
            }
          }
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

  const signUp = async (email: string) => {
    try {
      console.log('[AuthContext] Signing up with email:', email);
      
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
        'We sent you a magic link to sign in. Please check your email and click the link to continue.',
        [{ text: 'OK' }]
      );

      console.log('[AuthContext] Magic link sent successfully');
    } catch (error) {
      console.error('[AuthContext] Sign up error:', error);
      
      // Check for rate limit error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('security purposes') || errorMessage.includes('25 seconds')) {
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
        'We sent you a magic link to sign in. Please check your email and click the link to continue.',
        [{ text: 'OK' }]
      );

      console.log('[AuthContext] Magic link sent successfully');
    } catch (error) {
      console.error('[AuthContext] Sign in error:', error);
      
      // Check for rate limit error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('security purposes') || errorMessage.includes('25 seconds')) {
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
