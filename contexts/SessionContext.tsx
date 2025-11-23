
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Session, Match } from '@/types';
import { useAuth } from './AuthContext';
import { storage } from '@/utils/storage';
import { errorHandler } from '@/utils/errorHandler';

interface SessionContextType {
  session: Session | null;
  matches: Match[];
  isOpen: boolean;
  remainingTime: number;
  openSession: () => Promise<void>;
  closeSession: () => Promise<void>;
  extendSession: () => Promise<void>;
  respondToMatch: (matchId: string, interested: boolean) => Promise<void>;
  confirmMatch: (matchId: string) => Promise<void>;
  closeMatch: (matchId: string) => Promise<void>;
  refreshMatches: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [remainingTime, setRemainingTime] = useState(0);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const matchCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  const isCleaningUp = useRef(false);

  const isOpen = session?.status === 'open';

  useEffect(() => {
    console.log('[SessionContext] Initializing...');
    loadSession();
    loadMatches();

    return () => {
      console.log('[SessionContext] Cleaning up...');
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isOpen && session && !isCleaningUp.current) {
      console.log('[SessionContext] Session is open, starting tracking');
      startLocationTracking();
      startMatchChecking();
      startTimer();
    } else {
      console.log('[SessionContext] Session is closed, stopping tracking');
      stopLocationTracking();
      stopMatchChecking();
      stopTimer();
    }

    return () => {
      if (!isCleaningUp.current) {
        cleanup();
      }
    };
  }, [isOpen, session]);

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
      console.log('[SessionContext] Loading session from storage...');
      const sessionData = await storage.getItem<Session>('session');
      if (sessionData) {
        const now = new Date();
        const expiresAt = new Date(sessionData.expiresAt);
        
        if (now < expiresAt && sessionData.status === 'open') {
          setSession(sessionData);
          console.log('[SessionContext] Session loaded successfully:', sessionData.id);
        } else {
          await storage.removeItem('session');
          console.log('[SessionContext] Expired session removed');
        }
      } else {
        console.log('[SessionContext] No session found in storage');
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_LOAD');
      console.error('[SessionContext] Error loading session:', error);
    }
  };

  const loadMatches = async () => {
    try {
      console.log('[SessionContext] Loading matches from storage...');
      const matchesData = await storage.getItem<Match[]>('matches');
      if (matchesData && Array.isArray(matchesData)) {
        setMatches(matchesData);
        console.log('[SessionContext] Matches loaded successfully:', matchesData.length);
      } else {
        console.log('[SessionContext] No matches found in storage');
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_LOAD_MATCHES');
      console.error('[SessionContext] Error loading matches:', error);
    }
  };

  const refreshMatches = async () => {
    console.log('[SessionContext] Refreshing matches from storage');
    await loadMatches();
  };

  const startTimer = () => {
    if (timerInterval.current) {
      console.log('[SessionContext] Timer already running');
      return;
    }
    
    console.log('[SessionContext] Starting timer');
    timerInterval.current = setInterval(() => {
      if (session && !isCleaningUp.current) {
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
        
        setRemainingTime(remaining);
        
        if (remaining === 0) {
          console.log('[SessionContext] Session expired, closing automatically');
          closeSession();
        }
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      console.log('[SessionContext] Stopping timer');
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const startLocationTracking = async () => {
    try {
      if (locationSubscription.current) {
        console.log('[SessionContext] Location tracking already active');
        return;
      }

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
          if (!isCleaningUp.current) {
            console.log('[SessionContext] Location updated:', location.coords.latitude, location.coords.longitude);
            updateLocation(location.coords.latitude, location.coords.longitude);
          }
        }
      );

      console.log('[SessionContext] Location tracking started successfully');
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_LOCATION_START');
      console.error('[SessionContext] Error starting location tracking:', error);
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
      if (session && !isCleaningUp.current) {
        const updatedSession = { ...session, latitude, longitude };
        setSession(updatedSession);
        await storage.setItem('session', updatedSession);
        console.log('[SessionContext] Location updated in session');
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_UPDATE_LOCATION');
      console.error('[SessionContext] Error updating location:', error);
    }
  };

  const startMatchChecking = () => {
    if (matchCheckInterval.current) {
      console.log('[SessionContext] Match checking already active');
      return;
    }
    
    console.log('[SessionContext] Starting match checking');
    matchCheckInterval.current = setInterval(() => {
      if (!isCleaningUp.current) {
        checkForMatches();
      }
    }, 45000);
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
      console.log('[SessionContext] Checking for matches...');
      if (Math.random() > 0.9 && user && !isCleaningUp.current) {
        const mockMatch: Match = {
          id: Date.now().toString(),
          sessionAId: session?.id || '',
          sessionBId: 'mock-session-b',
          userA: user,
          userB: {
            id: 'mock-user',
            email: 'mock@example.com',
            name: 'Sophie',
            interests: user.interests.slice(0, 2),
            createdAt: new Date().toISOString(),
          },
          sharedInterests: user.interests.slice(0, 2),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        const updatedMatches = [...matches, mockMatch];
        setMatches(updatedMatches);
        await storage.setItem('matches', updatedMatches);
        console.log('[SessionContext] New match created:', mockMatch.id);
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_CHECK_MATCHES');
      console.error('[SessionContext] Error checking for matches:', error);
    }
  };

  const openSession = async () => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      console.log('[SessionContext] Opening session...');
      const settingsData = await storage.getItem<{ defaultOpenTime: number }>('settings');
      const defaultOpenTime = settingsData?.defaultOpenTime || 45;
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + defaultOpenTime * 60000);

      const newSession: Session = {
        id: Date.now().toString(),
        userId: user.id,
        startedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: 'open',
      };

      const success = await storage.setItem('session', newSession);
      if (!success) {
        throw new Error('Failed to save session');
      }

      setSession(newSession);
      console.log('[SessionContext] Session opened successfully:', newSession.id);
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_OPEN');
      errorHandler.showError('Failed to open session. Please try again.');
      throw error;
    }
  };

  const closeSession = async () => {
    try {
      if (session) {
        console.log('[SessionContext] Closing session...');
        isCleaningUp.current = true;
        await storage.removeItem('session');
        setSession(null);
        setRemainingTime(0);
        console.log('[SessionContext] Session closed successfully');
        setTimeout(() => {
          isCleaningUp.current = false;
        }, 100);
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_CLOSE');
      console.error('[SessionContext] Error closing session:', error);
      isCleaningUp.current = false;
    }
  };

  const extendSession = async () => {
    try {
      if (session) {
        console.log('[SessionContext] Extending session...');
        const currentExpiresAt = new Date(session.expiresAt);
        const newExpiresAt = new Date(currentExpiresAt.getTime() + 30 * 60000);
        
        const extendedSession = { ...session, expiresAt: newExpiresAt.toISOString() };
        const success = await storage.setItem('session', extendedSession);
        
        if (!success) {
          throw new Error('Failed to extend session');
        }

        setSession(extendedSession);
        console.log('[SessionContext] Session extended successfully');
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_EXTEND');
      errorHandler.showError('Failed to extend session. Please try again.');
      throw error;
    }
  };

  const respondToMatch = async (matchId: string, interested: boolean) => {
    try {
      console.log('[SessionContext] Responding to match:', matchId, 'interested:', interested);
      
      const currentMatches = await storage.getItem<Match[]>('matches') || [];
      const matchIndex = currentMatches.findIndex(m => m.id === matchId);
      
      if (matchIndex === -1) {
        throw new Error('Match not found');
      }

      const match = currentMatches[matchIndex];
      let newStatus = match.status;

      if (!interested) {
        newStatus = 'declined';
      } else {
        if (match.userA.id === user?.id) {
          newStatus = match.status === 'user_b_interested' ? 'both_ready' : 'user_a_interested';
        } else {
          newStatus = match.status === 'user_a_interested' ? 'both_ready' : 'user_b_interested';
        }
      }

      console.log('[SessionContext] Updating match status from', match.status, 'to', newStatus);

      const updatedMatch = { ...match, status: newStatus };
      const updatedMatches = [...currentMatches];
      updatedMatches[matchIndex] = updatedMatch;

      const success = await storage.setItem('matches', updatedMatches);
      
      if (!success) {
        throw new Error('Failed to save match response');
      }

      setMatches(updatedMatches);
      console.log('[SessionContext] Match response saved successfully');
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_RESPOND_MATCH');
      errorHandler.showError('Failed to respond to match. Please try again.');
      throw error;
    }
  };

  const confirmMatch = async (matchId: string) => {
    try {
      console.log('[SessionContext] Confirming match:', matchId);
      
      const currentMatches = await storage.getItem<Match[]>('matches') || [];
      const matchIndex = currentMatches.findIndex(m => m.id === matchId);
      
      if (matchIndex === -1) {
        throw new Error('Match not found');
      }

      const match = currentMatches[matchIndex];
      const updatedMatch = { ...match, status: 'both_ready' as const };
      const updatedMatches = [...currentMatches];
      updatedMatches[matchIndex] = updatedMatch;

      const success = await storage.setItem('matches', updatedMatches);
      
      if (!success) {
        throw new Error('Failed to confirm match');
      }

      setMatches(updatedMatches);
      console.log('[SessionContext] Match confirmed successfully');
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_CONFIRM_MATCH');
      errorHandler.showError('Failed to confirm match. Please try again.');
      throw error;
    }
  };

  const closeMatch = async (matchId: string) => {
    try {
      console.log('[SessionContext] Closing match:', matchId);
      
      const currentMatches = await storage.getItem<Match[]>('matches') || [];
      const updatedMatches = currentMatches.filter(m => m.id !== matchId);
      
      const success = await storage.setItem('matches', updatedMatches);
      
      if (!success) {
        throw new Error('Failed to close match');
      }

      setMatches(updatedMatches);
      console.log('[SessionContext] Match closed successfully');
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_CLOSE_MATCH');
      console.error('[SessionContext] Error closing match:', error);
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
        confirmMatch,
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
      confirmMatch: async () => {},
      closeMatch: async () => {},
      refreshMatches: async () => {},
    };
  }
  return context;
}
