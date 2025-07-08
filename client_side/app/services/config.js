import SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'gemini_api_key';
const DEFAULT_API_KEY = 'AIzaSyCPIGEr-6tkr8vK2OZVyZt6BAiQY_ToFZw';

export const ConfigService = {
    async getApiKey() {
        try {
            const storedKey = await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
            return storedKey || DEFAULT_API_KEY;
        } catch (error) {
            console.error('Error retrieving API key:', error);
            return DEFAULT_API_KEY;
        }
    },

    async setApiKey(apiKey) {
        try {
            await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, apiKey);
            return true;
        } catch (error) {
            console.error('Error saving API key:', error);
            return false;
        }
    },

    async removeApiKey() {
        try {
            await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error removing API key:', error);
            return false;
        }
    }
}; 