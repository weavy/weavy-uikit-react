import { useState, useEffect } from 'react';

const prefix = "wy-";

function getSessionStorageOrDefault<T>(key: string, defaultValue: T | (() => T)) {
  const stored = sessionStorage.getItem(prefix + key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored) as T;
}

export function useSessionState<S>(key: string, defaultValue: S | (() => S)):[S, React.Dispatch<React.SetStateAction<S>>] {
  const [value, setValue] = useState<S>(
    getSessionStorageOrDefault<S>(key, defaultValue) as S | (() => S)
  );

  useEffect(() => {
    sessionStorage.setItem(prefix + key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}