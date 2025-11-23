
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

  const isOpen = session?.status === 'open';

  useEffect(() => {
    loadSession();
    loadMatches();

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isOpen && session) {
      startLocationTracking();
      startMatchChecking();
      startTimer();
    } else {
      stopLocationTracking();
      stopMatchChecking();
      stopTimer();
    }

    return () => {
      cleanup();
    };
  }, [isOpen, session]);

  const cleanup = () => {
    stopLocationTracking();
    stopMatchChecking();
    stopTimer();
  };

  const loadSession = async () => {
    try {
      const sessionData = await storage.getItem<Session>('session');
      if (sessionData) {
        const now = new Date();
        const expiresAt = new Date(sessionData.expiresAt);
        
        if (now < expiresAt && sessionData.status === 'open') {
          setSession(sessionData);
          console.log('Session loaded successfully:', sessionData.id);
        } else {
          await storage.removeItem('session');
          console.log('Expired session removed');
        }
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_LOAD');
      console.error('Error loading session:', error);
    }
  };

  const loadMatches = async () => {
    try {
      const matchesData = await storage.getItem<Match[]>('matches');
      if (matchesData && Array.isArray(matchesData)) {
        setMatches(matchesData);
        console.log('Matches loaded successfully:', matchesData.length);
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_LOAD_MATCHES');
      console.error('Error loading matches:', error);
    }
  };

  const startTimer = () => {
    stopTimer();
    
    timerInterval.current = setInterval(() => {
      if (session) {
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
        
        setRemainingTime(remaining);
        
        if (remaining === 0) {
          console.log('Session expired, closing automatically');
          closeSession();
        }
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
  };

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        errorHandler.showError(
          'Location access is required to find people nearby. Please enable it in settings.',
          'Location Required'
        );
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30000,
          distanceInterval: 10,
        },
        (location) => {
          updateLocation(location.coords.latitude, location.coords.longitude);
        }
      );

      console.log('Location tracking started');
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_LOCATION_START');
      console.error('Error starting location tracking:', error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
      console.log('Location tracking stopped');
    }
  };

  const updateLocation = async (latitude: number, longitude: number) => {
    try {
      if (session) {
        const updatedSession = { ...session, latitude, longitude };
        setSession(updatedSession);
        await storage.setItem('session', updatedSession);
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_UPDATE_LOCATION');
      console.error('Error updating location:', error);
    }
  };

  const startMatchChecking = () => {
    stopMatchChecking();
    
    matchCheckInterval.current = setInterval(() => {
      checkForMatches();
    }, 45000);

    console.log('Match checking started');
  };

  const stopMatchChecking = () => {
    if (matchCheckInterval.current) {
      clearInterval(matchCheckInterval.current);
      matchCheckInterval.current = null;
      console.log('Match checking stopped');
    }
  };

  const checkForMatches = async () => {
    try {
      if (Math.random() > 0.9 && user) {
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
        console.log('New match created:', mockMatch.id);
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_CHECK_MATCHES');
      console.error('Error checking for matches:', error);
    }
  };

  const openSession = async () => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

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
      console.log('Session opened successfully:', newSession.id);
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_OPEN');
      errorHandler.showError('Failed to open session. Please try again.');
      throw error;
    }
  };

  const closeSession = async () => {
    try {
      if (session) {
        await storage.removeItem('session');
        setSession(null);
        setRemainingTime(0);
        console.log('Session closed successfully');
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_CLOSE');
      console.error('Error closing session:', error);
    }
  };

  const extendSession = async () => {
    try {
      if (session) {
        const currentExpiresAt = new Date(session.expiresAt);
        const newExpiresAt = new Date(currentExpiresAt.getTime() + 30 * 60000);
        
        const extendedSession = { ...session, expiresAt: newExpiresAt.toISOString() };
        const success = await storage.setItem('session', extendedSession);
        
        if (!success) {
          throw new Error('Failed to extend session');
        }

        setSession(extendedSession);
        console.log('Session extended successfully');
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_EXTEND');
      errorHandler.showError('Failed to extend session. Please try again.');
      throw error;
    }
  };

  const respondToMatch = async (matchId: string, interested: boolean) => {
    try {
      const matchIndex = matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) {
        throw new Error('Match not found');
      }

      const match = matches[matchIndex];
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

      const updatedMatch = { ...match, status: newStatus };
      const updatedMatches = [...matches];
      updatedMatches[matchIndex] = updatedMatch;

      setMatches(updatedMatches);
      const success = await storage.setItem('matches', updatedMatches);
      
      if (!success) {
        throw new Error('Failed to save match response');
      }

      console.log('Match response saved:', matchId, newStatus);
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_RESPOND_MATCH');
      errorHandler.showError('Failed to respond to match. Please try again.');
      throw error;
    }
  };

  const confirmMatch = async (matchId: string) => {
    try {
      const matchIndex = matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) {
        throw new Error('Match not found');
      }

      const match = matches[matchIndex];
      const updatedMatch = { ...match, status: 'both_ready' as const };
      const updatedMatches = [...matches];
      updatedMatches[matchIndex] = updatedMatch;

      setMatches(updatedMatches);
      const success = await storage.setItem('matches', updatedMatches);
      
      if (!success) {
        throw new Error('Failed to confirm match');
      }

      console.log('Match confirmed:', matchId);
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_CONFIRM_MATCH');
      errorHandler.showError('Failed to confirm match. Please try again.');
      throw error;
    }
  };

  const closeMatch = async (matchId: string) => {
    try {
      const updatedMatches = matches.filter(m => m.id !== matchId);
      setMatches(updatedMatches);
      const success = await storage.setItem('matches', updatedMatches);
      
      if (!success) {
        throw new Error('Failed to close match');
      }

      console.log('Match closed:', matchId);
    } catch (error) {
      errorHandler.logError(error as Error, 'SESSION_CLOSE_MATCH');
      console.error('Error closing match:', error);
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
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
