"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // optional utility for conditional class names (if you use one)

export default function LanguageSwitcher() {
  const [locale, setLocale] = useState<string>("en");
  const router = useRouter();

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("MYNEXTDOCTOR_LOCALE="))
      ?.split("=")[1];

    if (cookieLocale) {
      setLocale(cookieLocale);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      setLocale(browserLang);
      document.cookie = `MYNEXTDOCTOR_LOCALE=${browserLang}; path=/`;
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLocale(lang);
    document.cookie = `MYNEXTDOCTOR_LOCALE=${lang}; path=/`;
    router.refresh(); // re-fetch data and translations
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "hn", label: "हिन्दी" },
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg shadow-sm">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={cn(
            "px-3 py-1 text-sm font-medium rounded transition",
            "hover:bg-primary hover:text-primary-foreground",
            locale === lang.code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
