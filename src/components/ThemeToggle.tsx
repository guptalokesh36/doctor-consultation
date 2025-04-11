"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Theme"
      className="relative flex items-center w-14 h-8 m-1 bg-muted rounded-md border border-border p-1 transition-colors hover:ring-2 hover:ring-ring"
    >
      {/* Toggle ball */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-md bg-background shadow transition-transform duration-300 ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      ></div>

      {/* Sun icon */}
      <FiSun
        className={`z-10 text-sm ${
          isDark ? "text-muted-foreground" : "text-yellow-500"
        } transition-colors`}
      />

      {/* Moon icon */}
      <FiMoon
        className={`ml-auto z-10 text-sm ${
          isDark ? "text-blue-400" : "text-muted-foreground"
        } transition-colors`}
      />
    </button>
  );
}
