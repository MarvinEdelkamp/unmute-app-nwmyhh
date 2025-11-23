
// Safe AsyncStorage wrapper with error handling

import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorHandler } from './errorHandler';

export const storage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_GET', { key });
      console.error(`Failed to get item ${key} from storage:`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_SET', { key });
      console.error(`Failed to set item ${key} in storage:`, error);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_REMOVE', { key });
      console.error(`Failed to remove item ${key} from storage:`, error);
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_CLEAR');
      console.error('Failed to clear storage:', error);
      return false;
    }
  },

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_GET_KEYS');
      console.error('Failed to get all keys from storage:', error);
      return [];
    }
  },
};
