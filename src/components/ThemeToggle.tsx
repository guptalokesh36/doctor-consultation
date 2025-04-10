"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // prevent mismatch

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-1 border rounded-full m-2 hover:cursor-pointer"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Image
        src={isDark ? "/sun.svg" : "/moon.svg"}
        alt={`Switch to ${isDark ? "light" : "dark"} mode`}
        width={24}
        height={24}
      />
    </button>
  );
}
