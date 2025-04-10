"use client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
export default function ErrorHandle({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  const reload = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };
  return (
    <div>
      <p>{error.message}</p>
      <button className="border-5" onClick={reload}>
        Reload
      </button>
    </div>
  );
}
