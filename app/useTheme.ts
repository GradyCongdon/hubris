'use client';

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { setThemeCookie } from "./(player)/theme-cookie";
import { THEMES } from "./consts";

export const useTheme = (defaultTheme: string): [string, Dispatch<SetStateAction<string>>] => {
  const [theme, setTheme] = useState(defaultTheme);
  useEffect(() => {
    const themesClasses = THEMES.map((theme) => "theme-" + theme);
    document.body.classList.remove(...themesClasses);
    document.body.classList.add("theme-" + theme);
    window.analytics.track("Theme Change", { theme: theme });
    setThemeCookie(theme);
    console.debug("theme change", theme);
  }, [theme]);
  return [theme, setTheme];
}