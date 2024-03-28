import { ReactNode } from "react";
import { Moon } from "./icons/Moon";
import { Sun } from "./icons/Sun";
import { DEFAULT_THEME, THEMES } from "../consts";
import { Tree } from "./icons/Tree";

type Props = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

export const SIZE = 24;
const OFFSET = 8;

const icons: Record<string, ReactNode> = {
  light: <Sun />,
  dark: <Moon />,
  utah: <Tree />,
};

export const ThemeSwitcher = ({ theme, setTheme }: Props) => {
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
