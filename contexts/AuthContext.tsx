
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { storage } from '@/utils/storage';
import { errorHandler } from '@/utils/errorHandler';
import { validation, sanitize } from '@/utils/validation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasCompletedOnboarding: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      
      const [userData, onboardedData] = await Promise.all([
        storage.getItem<User>('user'),
        storage.getItem<boolean>('onboarded'),
      ]);
      
      if (userData) {
        setUser(userData);
      }
      
      if (onboardedData) {
        setHasCompletedOnboarding(onboardedData);
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'AUTH_LOAD_USER');
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const sanitizedEmail = sanitize.email(email);
      const sanitizedName = sanitize.text(name);

      const emailValidation = validation.email(sanitizedEmail);
      if (!emailValidation.valid) {
        throw new Error(emailValidation.error);
      }

      const nameValidation = validation.name(sanitizedName);
      if (!nameValidation.valid) {
        throw new Error(nameValidation.error);
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: sanitizedEmail,
        name: sanitizedName,
        interests: [],
        createdAt: new Date().toISOString(),
      };
      
      const success = await storage.setItem('user', newUser);
      if (!success) {
        throw new Error('Failed to save user data');
      }

      setUser(newUser);
      console.log('User signed up successfully:', newUser.id);
    } catch (error) {
      errorHandler.logError(error as Error, 'AUTH_SIGNUP');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const sanitizedEmail = sanitize.email(email);

      const emailValidation = validation.email(sanitizedEmail);
      if (!emailValidation.valid) {
        throw new Error(emailValidation.error);
      }

      const userData = await storage.getItem<User>('user');
      if (!userData) {
        throw new Error('User not found. Please sign up first.');
      }

      if (userData.email !== sanitizedEmail) {
        throw new Error('Invalid email or password');
      }

      setUser(userData);
      console.log('User signed in successfully:', userData.id);
    } catch (error) {
      errorHandler.logError(error as Error, 'AUTH_SIGNIN');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const success = await Promise.all([
        storage.removeItem('user'),
        storage.removeItem('onboarded'),
        storage.removeItem('session'),
        storage.removeItem('matches'),
      ]);

      if (success.every(s => s)) {
        setUser(null);
        setHasCompletedOnboarding(false);
        console.log('User signed out successfully');
      } else {
        throw new Error('Failed to clear all user data');
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'AUTH_SIGNOUT');
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      if (updates.name) {
        const sanitizedName = sanitize.text(updates.name);
        const nameValidation = validation.name(sanitizedName);
        if (!nameValidation.valid) {
          throw new Error(nameValidation.error);
        }
        updates.name = sanitizedName;
      }

      if (updates.email) {
        const sanitizedEmail = sanitize.email(updates.email);
        const emailValidation = validation.email(sanitizedEmail);
        if (!emailValidation.valid) {
          throw new Error(emailValidation.error);
        }
        updates.email = sanitizedEmail;
      }

      if (updates.interests) {
        const interestsValidation = validation.interests(updates.interests);
        if (!interestsValidation.valid) {
          throw new Error(interestsValidation.error);
        }
      }
      
      const updatedUser = { ...user, ...updates };
      const success = await storage.setItem('user', updatedUser);
      
      if (!success) {
        throw new Error('Failed to update user data');
      }

      setUser(updatedUser);
      console.log('User updated successfully:', updatedUser.id);
    } catch (error) {
      errorHandler.logError(error as Error, 'AUTH_UPDATE_USER');
      throw error;
    }
  };

  const completeOnboarding = async () => {
    try {
      const success = await storage.setItem('onboarded', true);
      if (!success) {
        throw new Error('Failed to save onboarding status');
      }
      setHasCompletedOnboarding(true);
      console.log('Onboarding completed successfully');
    } catch (error) {
      errorHandler.logError(error as Error, 'AUTH_COMPLETE_ONBOARDING');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        hasCompletedOnboarding,
        signUp,
        signIn,
        signOut,
        updateUser,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
