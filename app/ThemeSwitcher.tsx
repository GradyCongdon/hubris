"use client";

import { ReactNode } from "react";
import { Moon } from "./(player)/icons/Moon";
import { Sun } from "./(player)/icons/Sun";
import { DEFAULT_THEME, THEMES } from "./consts";
import { Tree } from "./(player)/icons/Tree";
import { useTheme } from "./useTheme";

type Props = {
  defaultTheme: string;
};

export const SIZE = 24;
const OFFSET = 8;

const icons: Record<string, ReactNode> = {
  light: <Sun />,
  dark: <Moon />,
  utah: <Tree />,
};

export const ThemeSwitcher = ({ defaultTheme }: Props) => {
  const [theme, setTheme] = useTheme(defaultTheme);
  const onClick = () => {
    if (!THEMES.includes(theme)) setTheme(DEFAULT_THEME);
    const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
    setTheme(nextTheme);
  };
  const icon = icons[theme];

  return (
    <button
      className="theme-switch"
      onClick={onClick}
      style={{
        position: "absolute",
        top: OFFSET,
        right: OFFSET,
        zIndex: 100,
        color: "var(--color)",
      }}
    >
      {icon}
    </button>
  );
};
