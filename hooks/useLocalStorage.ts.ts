export default function useLocalStorage<T = any>() {
  const setItem = (key: string, value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("useLocalStorage setItem error:", error);
    }
  };

  const getItem = (key: string): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      return JSON.parse(stored) as T;
    } catch (error) {
      console.error("useLocalStorage getItem error:", error);
      return null;
    }
  };

  return {
    setItem,
    getItem
  };
}