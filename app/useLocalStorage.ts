"use client"
import { useState, useEffect, Dispatch, SetStateAction } from "react";

export const useLocalStorage = (key: string, initialValue: string = ""): [string, Dispatch<SetStateAction<string>>] => {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    const item = window.localStorage.getItem(key);
    return item ? item : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}