"use client";

import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { ComponentProps, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { auth, getCurrentUserRole, logout } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { useTranslations } from "next-intl";

export function Header() {
  const t = useTranslations("Header");
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const currentUserRole = await getCurrentUserRole();
        setRole(currentUserRole);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setRole("");
    router.replace("/");
  };

  return (
    <header className="border-b bg-background text-foreground">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between py-4 px-4">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center space-x-2 mb-2 md:mb-0">
          <Image src="/newlogo.svg" alt="logo" width={50} height={50} />
          <h1 className="text-xl font-semibold">{APP_NAME}</h1>
        </Link>

        {/* Navigation */}
        <div className="flex items-center flex-wrap gap-2 justify-center">
          <NavLink href="/about">{t("about")}</NavLink>
          <NavLink href="/services">{t("services")}</NavLink>

          {role === "admin" && <NavLink href="/dashboard">{t("dashboard")}</NavLink>}

          {role === "user" && (
            <>
              <NavLink href="/doctors">{t("doctors")}</NavLink>
              <NavLink href="/bookings">{t("bookings")}</NavLink>
              <NavLink href="/chat">{t("chats")}</NavLink>
            </>
          )}

          {role === "doctor" && (
            <>
              <NavLink href="/patients">{t("patients")}</NavLink>
              <NavLink href="/availability">{t("availability")}</NavLink>
              <NavLink href="/chat">{t("chats")}</NavLink>
            </>
          )}

          <LanguageSwitcher />
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {user.displayName} ({role})
              </p>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm hover:opacity-90"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <NavLink href="/login">{t("login")}</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  const isActive = pathname === props.href;

  return (
    <Link
      {...props}
      className={`px-4 py-2 rounded transition font-medium text-sm ${
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "hover:bg-muted hover:text-foreground"
      }`}
    />
  );
}
