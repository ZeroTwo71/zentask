// Type-safe wrapper for localStorage
export const storage = {
  // Get an item from localStorage
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.error(`Error getting item '${key}' from localStorage:`, error);
      return defaultValue;
    }
  },

  // Set an item in localStorage
  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item '${key}' in localStorage:`, error);
    }
  },

  // Remove an item from localStorage
  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item '${key}' from localStorage:`, error);
    }
  },
};
