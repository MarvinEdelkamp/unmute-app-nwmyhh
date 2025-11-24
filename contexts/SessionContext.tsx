
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { supabase } from '@/lib/supabase';
import { useAuth, Profile } from './AuthContext';
import { errorHandler } from '@/utils/errorHandler';
import { Database } from '@/types/database';

type SessionRow = Database['public']['Tables']['sessions']['Row'];
type MatchRow = Database['public']['Tables']['matches']['Row'];

export interface MatchWithProfiles extends MatchRow {
  user_a_profile: Profile;
  user_b_profile: Profile;
  user_a_interests: string[];
  user_b_interests: string[];
}

interface SessionContextType {
  session: SessionRow | null;
  matches: MatchWithProfiles[];
  isOpen: boolean;
  remainingTime: number;
  openSession: () => Promise<void>;
  closeSession: () => Promise<void>;
  extendSession: () => Promise<void>;
  respondToMatch: (matchId: string, interested: boolean) => Promise<void>;
  updateMatchMessage: (matchId: string, message: string) => Promise<void>;
  closeMatch: (matchId: string) => Promise<void>;
  refreshMatches: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const [session, setSession] = useState<SessionRow | null>(null);
  const [matches, setMatches] = useState<MatchWithProfiles[]>([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const matchCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const isCleaningUp = useRef(false);
  const mountedRef = useRef(true);

  const isOpen = session?.is_open || false;

  useEffect(() => {
    console.log('[SessionContext] Initializing...');
    mountedRef.current = true;
    
    if (user && profile) {
      loadSession();
      loadMatches();
      subscribeToMatches();
    }

    return () => {
      console.log('[SessionContext] Cleaning up...');
      mountedRef.current = false;
      cleanup();
    };
  }, [user?.id, profile?.id]);

  useEffect(() => {
    if (isOpen && session && !isCleaningUp.current) {
      console.log('[SessionContext] Session is open, starting tracking');
      startLocationTracking();
      startMatchChecking();
      startTimer();
    } else {
      stopLocationTracking();
      stopMatchChecking();
      stopTimer();
    }

    return () => {
      if (!isCleaningUp.current) {
        cleanup();
      }
    };
  }, [isOpen, session?.id]);

  const cleanup = () => {
    isCleaningUp.current = true;
    stopLocationTracking();
    stopMatchChecking();
    stopTimer();
    setTimeout(() => {
      isCleaningUp.current = false;
    }, 100);
  };

  const loadSession = async () => {
    try {
      if (!user || !profile) return;

      console.log('[SessionContext] Loading session...');
      
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_open', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const now = new Date();
        const closesAt = new Date(data.closes_at);
        
        if (now < closesAt) {
          setSession(data);
          const remaining = Math.max(0, Math.floor((closesAt.getTime() - now.getTime()) / 1000));
          setRemainingTime(remaining);
          console.log('[SessionContext] Session loaded:', data.id, 'remaining:', remaining);
        } else {
          // Close expired session
          await supabase
            .from('sessions')
            .update({ is_open: false })
            .eq('id', data.id);
          console.log('[SessionContext] Expired session closed');
        }
      }
    } catch (error) {
      console.error('[SessionContext] Error loading session:', error);
      errorHandler.logError(error as Error, 'SESSION_LOAD');
    }
  };

  const loadMatches = async () => {
    try {
      if (!user) return;

      console.log('[SessionContext] Loading matches...');
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          user_a_profile:profiles!matches_user_a_id_fkey(*),
          user_b_profile:profiles!matches_user_b_id_fkey(*)
        `)
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
        .in('status', ['pending', 'user_a_accepted', 'user_b_accepted', 'both_accepted'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load interests for each match
      const matchesWithInterests = await Promise.all(
        (data || []).map(async (match: any) => {
          const [userAInterests, userBInterests] = await Promise.all([
            loadUserInterests(match.user_a_profile.id),
            loadUserInterests(match.user_b_profile.id),
          ]);

          return {
            ...match,
            user_a_interests: userAInterests,
            user_b_interests: userBInterests,
          };
        })
      );

      setMatches(matchesWithInterests);
      console.log('[SessionContext] Matches loaded:', matchesWithInterests.length);
    } catch (error) {
      console.error('[SessionContext] Error loading matches:', error);
      errorHandler.logError(error as Error, 'SESSION_LOAD_MATCHES');
    }
  };

  const loadUserInterests = async (profileId: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('user_interests')
        .select(`
          *,
          interests (
            label
          )
        `)
        .eq('profile_id', profileId);

      if (error) throw error;

      return (data || []).map((ui: any) => ui.interests?.label || ui.free_text_label);
    } catch (error) {
      console.error('[SessionContext] Error loading user interests:', error);
      return [];
    }
  };

  const subscribeToMatches = () => {
    if (!user) return;

    console.log('[SessionContext] Subscribing to match updates...');

    const subscription = supabase
      .channel('matches')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `user_a_id=eq.${user.id}`,
        },
        () => {
          console.log('[SessionContext] Match update received (user A)');
          loadMatches();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `user_b_id=eq.${user.id}`,
        },
        () => {
          console.log('[SessionContext] Match update received (user B)');
          loadMatches();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const refreshMatches = async () => {
    console.log('[SessionContext] Refreshing matches');
    await loadMatches();
  };

  const startTimer = () => {
    if (timerInterval.current || !session) return;
    
    console.log('[SessionContext] Starting timer');
    
    const updateTimer = () => {
      if (session && !isCleaningUp.current && mountedRef.current) {
        const now = new Date();
        const closesAt = new Date(session.closes_at);
        const remaining = Math.max(0, Math.floor((closesAt.getTime() - now.getTime()) / 1000));
        
        setRemainingTime(remaining);
        
        if (remaining === 0) {
          console.log('[SessionContext] Session expired, closing automatically');
          closeSession();
        }
      }
    };

    updateTimer();
    timerInterval.current = setInterval(updateTimer, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      console.log('[SessionContext] Stopping timer');
      clearInterval(timerInterval.current);
      timerInterval.current = null;
      setRemainingTime(0);
    }
  };

  const startLocationTracking = async () => {
    try {
      if (locationSubscription.current || !session) return;

      console.log('[SessionContext] Requesting location permissions...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.warn('[SessionContext] Location permission denied');
        errorHandler.showError(
          'Location access is required to find people nearby. Please enable it in settings.',
          'Location Required'
        );
        return;
      }

      console.log('[SessionContext] Starting location tracking...');
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30000,
          distanceInterval: 10,
        },
        (location) => {
          if (!isCleaningUp.current && mountedRef.current) {
            updateLocation(location.coords.latitude, location.coords.longitude);
          }
        }
      );

      // Get initial location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      await updateLocation(location.coords.latitude, location.coords.longitude);

      console.log('[SessionContext] Location tracking started');
    } catch (error) {
      console.error('[SessionContext] Error starting location tracking:', error);
      errorHandler.logError(error as Error, 'SESSION_LOCATION_START');
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      console.log('[SessionContext] Stopping location tracking');
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  const updateLocation = async (latitude: number, longitude: number) => {
    try {
      if (!session || isCleaningUp.current) return;

      const { error } = await supabase
        .from('sessions')
        .update({
          location: `POINT(${longitude} ${latitude})`,
        })
        .eq('id', session.id);

      if (error) throw error;

      console.log('[SessionContext] Location updated');
    } catch (error) {
      console.error('[SessionContext] Error updating location:', error);
      errorHandler.logError(error as Error, 'SESSION_UPDATE_LOCATION');
    }
  };

  const startMatchChecking = () => {
    if (matchCheckInterval.current) return;
    
    console.log('[SessionContext] Starting match checking');
    
    // Check immediately
    checkForMatches();
    
    // Then check every 12 seconds
    matchCheckInterval.current = setInterval(() => {
      if (!isCleaningUp.current && mountedRef.current) {
        checkForMatches();
      }
    }, 12000);
  };

  const stopMatchChecking = () => {
    if (matchCheckInterval.current) {
      console.log('[SessionContext] Stopping match checking');
      clearInterval(matchCheckInterval.current);
      matchCheckInterval.current = null;
    }
  };

  const checkForMatches = async () => {
    try {
      if (!session || !user || !profile) return;

      console.log('[SessionContext] Checking for matches...');

      // Call Edge Function to find matches
      const { data, error } = await supabase.functions.invoke('find-matches', {
        body: { session_id: session.id },
      });

      if (error) throw error;

      if (data?.match_created) {
        console.log('[SessionContext] New match created!');
        await loadMatches();
      }
    } catch (error) {
      console.error('[SessionContext] Error checking for matches:', error);
      errorHandler.logError(error as Error, 'SESSION_CHECK_MATCHES');
    }
  };

  const openSession = async () => {
    try {
      if (!user || !profile) {
        throw new Error('No user or profile');
      }

      console.log('[SessionContext] Opening session...');

      const now = new Date();
      const closesAt = new Date(now.getTime() + 45 * 60000);

      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          profile_id: profile.id,
          is_open: true,
          opened_at: now.toISOString(),
          closes_at: closesAt.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setSession(data);
      const remaining = Math.floor((closesAt.getTime() - now.getTime()) / 1000);
      setRemainingTime(remaining);
      
      console.log('[SessionContext] Session opened:', data.id);
    } catch (error) {
      console.error('[SessionContext] Error opening session:', error);
      errorHandler.logError(error as Error, 'SESSION_OPEN');
      errorHandler.showError('Failed to open session. Please try again.');
      throw error;
    }
  };

  const closeSession = async () => {
    try {
      if (!session) return;

      console.log('[SessionContext] Closing session...');
      isCleaningUp.current = true;

      const { error } = await supabase
        .from('sessions')
        .update({ is_open: false, closes_at: new Date().toISOString() })
        .eq('id', session.id);

      if (error) throw error;

      setSession(null);
      setRemainingTime(0);
      console.log('[SessionContext] Session closed');
      
      setTimeout(() => {
        isCleaningUp.current = false;
      }, 100);
    } catch (error) {
      console.error('[SessionContext] Error closing session:', error);
      errorHandler.logError(error as Error, 'SESSION_CLOSE');
      isCleaningUp.current = false;
    }
  };

  const extendSession = async () => {
    try {
      if (!session) return;

      console.log('[SessionContext] Extending session...');
      
      const currentClosesAt = new Date(session.closes_at);
      const newClosesAt = new Date(currentClosesAt.getTime() + 30 * 60000);

      const { data, error } = await supabase
        .from('sessions')
        .update({ closes_at: newClosesAt.toISOString() })
        .eq('id', session.id)
        .select()
        .single();

      if (error) throw error;

      setSession(data);
      const now = new Date();
      const remaining = Math.floor((newClosesAt.getTime() - now.getTime()) / 1000);
      setRemainingTime(remaining);
      
      console.log('[SessionContext] Session extended');
    } catch (error) {
      console.error('[SessionContext] Error extending session:', error);
      errorHandler.logError(error as Error, 'SESSION_EXTEND');
      errorHandler.showError('Failed to extend session. Please try again.');
      throw error;
    }
  };

  const respondToMatch = async (matchId: string, interested: boolean) => {
    try {
      if (!user) return;

      console.log('[SessionContext] Responding to match:', matchId, 'interested:', interested);

      const match = matches.find(m => m.id === matchId);
      if (!match) throw new Error('Match not found');

      let newStatus = match.status;

      if (!interested) {
        newStatus = 'declined';
      } else {
        const isUserA = match.user_a_id === user.id;
        const otherAccepted = isUserA 
          ? match.status === 'user_b_accepted'
          : match.status === 'user_a_accepted';

        if (otherAccepted) {
          newStatus = 'both_accepted';
        } else {
          newStatus = isUserA ? 'user_a_accepted' : 'user_b_accepted';
        }
      }

      const { error } = await supabase
        .from('matches')
        .update({ status: newStatus })
        .eq('id', matchId);

      if (error) throw error;

      console.log('[SessionContext] Match response saved');
      await loadMatches();
    } catch (error) {
      console.error('[SessionContext] Error responding to match:', error);
      errorHandler.logError(error as Error, 'SESSION_RESPOND_MATCH');
      errorHandler.showError('Failed to respond to match. Please try again.');
      throw error;
    }
  };

  const updateMatchMessage = async (matchId: string, message: string) => {
    try {
      if (!user) return;

      console.log('[SessionContext] Updating match message:', matchId);

      const match = matches.find(m => m.id === matchId);
      if (!match) throw new Error('Match not found');

      const isUserA = match.user_a_id === user.id;
      const updateField = isUserA ? 'user_a_message' : 'user_b_message';

      const { error } = await supabase
        .from('matches')
        .update({ [updateField]: message })
        .eq('id', matchId);

      if (error) throw error;

      console.log('[SessionContext] Match message updated');
      await loadMatches();
    } catch (error) {
      console.error('[SessionContext] Error updating match message:', error);
      errorHandler.logError(error as Error, 'SESSION_UPDATE_MESSAGE');
      throw error;
    }
  };

  const closeMatch = async (matchId: string) => {
    try {
      console.log('[SessionContext] Closing match:', matchId);

      const { error } = await supabase
        .from('matches')
        .update({ status: 'expired' })
        .eq('id', matchId);

      if (error) throw error;

      console.log('[SessionContext] Match closed');
      await loadMatches();
    } catch (error) {
      console.error('[SessionContext] Error closing match:', error);
      errorHandler.logError(error as Error, 'SESSION_CLOSE_MATCH');
    }
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        matches,
        isOpen,
        remainingTime,
        openSession,
        closeSession,
        extendSession,
        respondToMatch,
        updateMatchMessage,
        closeMatch,
        refreshMatches,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    console.warn('[SessionContext] useSession must be used within a SessionProvider, using defaults');
    return {
      session: null,
      matches: [],
      isOpen: false,
      remainingTime: 0,
      openSession: async () => {},
      closeSession: async () => {},
      extendSession: async () => {},
      respondToMatch: async () => {},
      updateMatchMessage: async () => {},
      closeMatch: async () => {},
      refreshMatches: async () => {},
    };
  }
  return context;
}
