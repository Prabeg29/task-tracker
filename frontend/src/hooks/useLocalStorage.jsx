import { useState } from "react";

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const value = window.localStorage.getItem(keyName);

    if (value) {
      return JSON.parse(value);
    }

    window.localStorage.setItem(keyName, JSON.stringify(defaultValue));

    return defaultValue;
  });

  const setValue = (newValue) => {
    window.localStorage.setItem(keyName, JSON.stringify(newValue));
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};
