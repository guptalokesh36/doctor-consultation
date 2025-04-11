"use client";

import { login } from "@/firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleLogin(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login(email as string, password as string);
      toast.success("Logged in successfully!");
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Login failed.");
        console.error("Login error:", error.message);
      } else {
        toast.error("An unknown error occurred.");
        console.error("Unknown login error:", error);
      }
    }
  }

  return (
    <form
      action={handleLogin}
      className="max-w-md mx-auto mt-12 bg-background text-foreground p-6 rounded-xl shadow-md space-y-6"
    >
      <h1 className="text-2xl font-bold text-center">Welcome Back</h1>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="joe@schmoe.com"
          className="w-full p-3 border border-border rounded-md bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="********"
            className="w-full p-3 border border-border rounded-md bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        Login
      </button>

      {/* Signup Link */}
      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
}
