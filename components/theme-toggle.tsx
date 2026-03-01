"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button className="theme-toggle" onClick={() => setTheme(isDark ? "light" : "dark")} type="button">
      {isDark ? "라이트" : "다크"}
    </button>
  );
}
