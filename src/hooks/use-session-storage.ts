'use client';

import React, { useEffect, useState } from 'react';

function getDefaultValue<T>(key: string, initialValue: T | null): T | null {
  const storedValue: string | null = sessionStorage.getItem(key);
  if (storedValue) {
    return JSON.parse(storedValue);
  }
  if (initialValue instanceof Function) {
    return initialValue();
  }
  return initialValue;
}

export function useSessionStorage<T>(
  key: string,
  initialValue?: T | null,
): [T | null, React.Dispatch<React.SetStateAction<T | null>>] {
  const [value, setValue] = useState<T | null>(getDefaultValue(key, initialValue));

  useEffect(() => {
    if (value) {
      sessionStorage.setItem(key, JSON.stringify(value));
    }

    if (value === null) {
      sessionStorage.removeItem(key);
    }
  }, [key, value]);

  return [value, setValue];
}
