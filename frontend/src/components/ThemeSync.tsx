import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

const ThemeSync = () => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
};

export default ThemeSync;
