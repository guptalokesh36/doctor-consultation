"use client";

import { login } from "@/firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/"); // redirect if logged in
      }
    });

    return () => unsubscribe(); // cleanup
  }, [router]);
  async function handlelogin(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await login(email as string, password as string);
      router.push("/");
    } catch (error) {
      console.log(error, email, password);
    }
  }
  return (
    <form
      action={handlelogin}
      className="m-4 flex flex-col justify-center max-w-md mx-auto p-6 bg--background text--foreground rounded-lg  shadow-lg"
    >
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700"
        >
          Email:
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="joe@schmoe.com"
          required
          className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-700"
        >
          Password:
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="********"
          required
          className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Login
      </button>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
}
