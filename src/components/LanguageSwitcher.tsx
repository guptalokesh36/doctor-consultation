"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const [local, setLocal] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const cookieLocal = document.cookie
      .split("; ")
      .find((row) => row.startsWith("MYNEXTDOCTOR_LOCALE="))
      ?.split("=")[1];

    if (cookieLocal) {
      setLocal(cookieLocal);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      setLocal(browserLang);
      document.cookie = `MYNEXTDOCTOR_LOCALE=${browserLang}; path=/`;
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLocal(lang);
    document.cookie = `MYNEXTDOCTOR_LOCALE=${lang}; path=/`;
    router.refresh();
  };
  return (
    <div className="flex">
      <button
        onClick={() => handleLanguageChange("en")}
        className={
          "px-4 py-6 gap-1 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground" +
          (local === "en" ? " bg-secondary text-secondary-foreground" : "")
        }
      >
        English
      </button>
      <button
        onClick={() => handleLanguageChange("fr")}
        className={
          "px-4 py-6 gap-1 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground" +
          (local === "fr" ? " bg-secondary text-secondary-foreground" : "")
        }
      >
        français
      </button>
      <button
        onClick={() => handleLanguageChange("hn")}
        className={
          "px-4 py-6 gap-1 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground" +
          (local === "hn" ? " bg-secondary text-secondary-foreground" : "")
        }
      >
        हिन्दी
      </button>
    </div>
  );
}
