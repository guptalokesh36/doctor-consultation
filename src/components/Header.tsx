"use client";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { ReactNode, ComponentProps, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { auth, getCurrentUserRole, logout } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

export function Header({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>("");
  const route = useRouter();
  useEffect(() => {
    if (!auth) return; // safeguard
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        const currentUserRole = await getCurrentUserRole();
        setRole(currentUserRole);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  function handleLogout() {
    logout();
    setRole("");
    setUser(null);
    console.log("logout");
    route.replace("/");
  }
  return (
    <header className=" border  bg--background text--foreground">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="flex items-center space-x-2">
            <Image src="/newlogo.svg" alt="logo" width={50} height={50} />
            <h1 className="text-2xl font-semibold">{APP_NAME}</h1>
          </div>
        </Link>
        <div className="flex items-center justify-center ">
          {children}
          {role === "admin" && <NavLink href="/dashboard">Dashboard</NavLink>}
          {role === "user" && 
          <>
          <NavLink href="/doctors">Doctors</NavLink>
          <NavLink href="/bookings">Bookings</NavLink> 
          </>
          }
          {role === "doctor" && <NavLink href="/patients">Patients</NavLink>}

          <LanguageSwitcher />
          <ThemeToggle />
          {user ? (
            <>
              <p>
                {" "}
                {user.displayName} {role}
              </p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
              >
                {" "}
                logout
              </button>
            </>
          ) : (
            <NavLink href="/login">login</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={
        "px-4 py-6 gap-2 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground" +
        (pathname === props.href
          ? " bg-secondary text-secondary-foreground"
          : "")
      }
    />
  );
}
