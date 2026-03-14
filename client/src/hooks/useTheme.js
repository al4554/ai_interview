import { useEffect, useMemo, useState } from "react";
import { themeStorage } from "../utils/storage";

export const useTheme = () => {
  const initialTheme = useMemo(() => {
    const saved = themeStorage.get();
    if (saved === "light" || saved === "dark") {
      return saved;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, []);

  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    themeStorage.set(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return {
    theme,
    toggleTheme
  };
};
