
import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      console.log(`[Storage] Getting item: ${key}`);
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const parsed = JSON.parse(value);
        console.log(`[Storage] Item retrieved: ${key}`);
        return parsed as T;
      }
      console.log(`[Storage] No item found for key: ${key}`);
      return null;
    } catch (error) {
      console.error(`[Storage] Error getting item ${key}:`, error);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      console.log(`[Storage] Setting item: ${key}`);
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`[Storage] Item set successfully: ${key}`);
      return true;
    } catch (error) {
      console.error(`[Storage] Error setting item ${key}:`, error);
      return false;
    }
  }

  async removeItem(key: string): Promise<boolean> {
    try {
      console.log(`[Storage] Removing item: ${key}`);
      await AsyncStorage.removeItem(key);
      console.log(`[Storage] Item removed successfully: ${key}`);
      return true;
    } catch (error) {
      console.error(`[Storage] Error removing item ${key}:`, error);
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      console.log('[Storage] Clearing all items');
      await AsyncStorage.clear();
      console.log('[Storage] All items cleared successfully');
      return true;
    } catch (error) {
      console.error('[Storage] Error clearing storage:', error);
      return false;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      console.log('[Storage] Getting all keys');
      const keys = await AsyncStorage.getAllKeys();
      console.log(`[Storage] Found ${keys.length} keys`);
      return keys;
    } catch (error) {
      console.error('[Storage] Error getting all keys:', error);
      return [];
    }
  }
}

export const storage = new Storage();
