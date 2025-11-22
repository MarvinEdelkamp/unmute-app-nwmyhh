
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Session, Match, User } from '@/types';
import { useAuth } from './AuthContext';

interface SessionContextType {
  session: Session | null;
  matches: Match[];
  isOpen: boolean;
  remainingTime: number;
  openSession: () => Promise<void>;
  closeSession: () => Promise<void>;
  extendSession: () => Promise<void>;
  respondToMatch: (matchId: string, interested: boolean) => Promise<void>;
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

  const isOpen = session?.status === 'open';

  useEffect(() => {
    loadSession();
    loadMatches();
  }, []);

  useEffect(() => {
    if (isOpen && session) {
      startLocationTracking();
      startMatchChecking();
      startTimer();
    } else {
      stopLocationTracking();
      stopMatchChecking();
    }

    return () => {
      stopLocationTracking();
      stopMatchChecking();
    };
  }, [isOpen, session]);

  const loadSession = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('session');
      if (sessionData) {
        const parsedSession = JSON.parse(sessionData);
        const now = new Date();
        const expiresAt = new Date(parsedSession.expiresAt);
        
        if (now < expiresAt && parsedSession.status === 'open') {
          setSession(parsedSession);
        } else {
          await AsyncStorage.removeItem('session');
        }
      }
    } catch (error) {
      console.log('Error loading session:', error);
    }
  };

  const loadMatches = async () => {
    try {
      const matchesData = await AsyncStorage.getItem('matches');
      if (matchesData) {
        setMatches(JSON.parse(matchesData));
      }
    } catch (error) {
      console.log('Error loading matches:', error);
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      if (session) {
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
        
        setRemainingTime(remaining);
        
        if (remaining === 0) {
          closeSession();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
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
    } catch (error) {
      console.log('Error starting location tracking:', error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  const updateLocation = async (latitude: number, longitude: number) => {
    if (session) {
      const updatedSession = { ...session, latitude, longitude };
      setSession(updatedSession);
      await AsyncStorage.setItem('session', JSON.stringify(updatedSession));
    }
  };

  const startMatchChecking = () => {
    matchCheckInterval.current = setInterval(() => {
      checkForMatches();
    }, 45000);
  };

  const stopMatchChecking = () => {
    if (matchCheckInterval.current) {
      clearInterval(matchCheckInterval.current);
      matchCheckInterval.current = null;
    }
  };

  const checkForMatches = async () => {
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
      await AsyncStorage.setItem('matches', JSON.stringify(updatedMatches));
    }
  };

  const openSession = async () => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const settingsData = await AsyncStorage.getItem('settings');
      const settings = settingsData ? JSON.parse(settingsData) : { defaultOpenTime: 45 };
      
      const now = new Date();
      const expiresAt = new Date(now.getTime() + settings.defaultOpenTime * 60000);

      const newSession: Session = {
        id: Date.now().toString(),
        userId: user.id,
        startedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: 'open',
      };

      await AsyncStorage.setItem('session', JSON.stringify(newSession));
      setSession(newSession);
    } catch (error) {
      console.log('Error opening session:', error);
      throw error;
    }
  };

  const closeSession = async () => {
    try {
      if (session) {
        const closedSession = { ...session, status: 'closed' as const };
        await AsyncStorage.setItem('session', JSON.stringify(closedSession));
        await AsyncStorage.removeItem('session');
        setSession(null);
        setRemainingTime(0);
      }
    } catch (error) {
      console.log('Error closing session:', error);
      throw error;
    }
  };

  const extendSession = async () => {
    try {
      if (session) {
        const currentExpiresAt = new Date(session.expiresAt);
        const newExpiresAt = new Date(currentExpiresAt.getTime() + 30 * 60000);
        
        const extendedSession = { ...session, expiresAt: newExpiresAt.toISOString() };
        await AsyncStorage.setItem('session', JSON.stringify(extendedSession));
        setSession(extendedSession);
      }
    } catch (error) {
      console.log('Error extending session:', error);
      throw error;
    }
  };

  const respondToMatch = async (matchId: string, interested: boolean) => {
    try {
      const matchIndex = matches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) {
        return;
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
      await AsyncStorage.setItem('matches', JSON.stringify(updatedMatches));
    } catch (error) {
      console.log('Error responding to match:', error);
      throw error;
    }
  };

  const closeMatch = async (matchId: string) => {
    try {
      const updatedMatches = matches.filter(m => m.id !== matchId);
      setMatches(updatedMatches);
      await AsyncStorage.setItem('matches', JSON.stringify(updatedMatches));
    } catch (error) {
      console.log('Error closing match:', error);
      throw error;
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
