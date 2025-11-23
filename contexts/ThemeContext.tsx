
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '@/styles/commonStyles';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: typeof lightColors;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      console.log('[ThemeContext] Loading theme preference...');
      
      // Add timeout to prevent hanging
      const loadPromise = AsyncStorage.getItem('themeMode');
      const timeoutPromise = new Promise<null>((resolve) => 
        setTimeout(() => {
          console.warn('[ThemeContext] Theme load timeout, using default');
          resolve(null);
        }, 1000)
      );

      const savedTheme = await Promise.race([loadPromise, timeoutPromise]);
      
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto')) {
        setThemeModeState(savedTheme as ThemeMode);
        console.log('[ThemeContext] Theme loaded:', savedTheme);
      } else {
        console.log('[ThemeContext] No saved theme, using auto');
      }
    } catch (error) {
      console.log('[ThemeContext] Error loading theme preference:', error);
      // Use default 'auto' mode on error
    } finally {
      console.log('[ThemeContext] Theme loading complete');
      setLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      setThemeModeState(mode);
      console.log('[ThemeContext] Theme mode set to:', mode);
    } catch (error) {
      console.log('[ThemeContext] Error saving theme preference:', error);
      // Still update state even if save fails
      setThemeModeState(mode);
    }
  };

  const isDark = themeMode === 'auto' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  const theme = isDark ? darkColors : lightColors;

  // Don't wait for loading - provide theme immediately
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      themeMode, 
      isDark, 
      setThemeMode,
      loading 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return safe default instead of throwing
    console.warn('[ThemeContext] useTheme must be used within a ThemeProvider, using default theme');
    return {
      theme: lightColors,
      themeMode: 'auto' as ThemeMode,
      isDark: false,
      setThemeMode: () => {},
      loading: false,
    };
  }
  return context;
}
