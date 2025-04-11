"use client";

import { auth, signup } from "@/firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
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

  async function handleSignup(formData: FormData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await signup(name as string, email as string, password as string);
      toast.success("Account created!");
      router.replace("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Signup failed.");
        console.error("Signup error:", error.message);
      } else {
        toast.error("An unknown error occurred.");
        console.error("Unknown signup error:", error);
      }
    }
  }

  return (
    <form
      action={handleSignup}
      className="max-w-md mx-auto mt-12 bg-background text-foreground p-6 rounded-xl shadow-md space-y-6"
    >
      <h1 className="text-2xl font-bold text-center">Create Account</h1>

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="joe"
          className="w-full p-3 border border-border rounded-md bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

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

      {/* Password Field with Toggle */}
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
        Sign Up
      </button>

      {/* Already have an account */}
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Log In
        </Link>
      </div>
    </form>
  );
}
