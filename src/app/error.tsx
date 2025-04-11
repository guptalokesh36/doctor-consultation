"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("❌ Error captured by error.tsx:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground text-center px-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Sorry, an unexpected error occurred. Please try again or go back to the homepage.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button onClick={reset} className="bg-blue-600 text-white hover:bg-blue-700">
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>

      {process.env.NODE_ENV === "development" && (
        <pre className="text-xs text-red-400 mt-6 max-w-md break-words whitespace-pre-wrap">
          {error.message}
        </pre>
      )}
    </div>
  );
}
