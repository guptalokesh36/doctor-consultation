"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-background text-foreground px-4">
      <div className="flex flex-col items-center space-y-6">
        <FaExclamationTriangle className="text-destructive text-6xl" />
        <h2 className="text-3xl font-bold">Oops! Page Not Found</h2>
        <p className="text-muted-foreground text-lg max-w-md">
          We couldn&apos;t find the page you&apos;re looking for. It might have been removed, renamed, or did not exist in the first place.
        </p>
        <Link href="/">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
