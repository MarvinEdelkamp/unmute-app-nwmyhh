
import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorHandler } from './errorHandler';

class SafeStorage {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_GET', { key });
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_SET', { key });
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_REMOVE', { key });
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_CLEAR');
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_GET_KEYS');
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};
      
      pairs.forEach(([key, value]) => {
        if (value !== null) {
          try {
            result[key] = JSON.parse(value);
          } catch (parseError) {
            console.error(`Error parsing value for key ${key}:`, parseError);
            result[key] = null;
          }
        }
      });
      
      return result;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_MULTI_GET', { keys });
      console.error('Error in multiGet:', error);
      return {};
    }
  }

  async multiSet(keyValuePairs: [string, any][]): Promise<boolean> {
    try {
      const jsonPairs: [string, string][] = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(jsonPairs);
      return true;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_MULTI_SET');
      console.error('Error in multiSet:', error);
      return false;
    }
  }

  async multiRemove(keys: string[]): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      errorHandler.logError(error as Error, 'STORAGE_MULTI_REMOVE', { keys });
      console.error('Error in multiRemove:', error);
      return false;
    }
  }
}

export const storage = new SafeStorage();

// Convenience hook for using storage in components
export function useStorage() {
  return storage;
}
