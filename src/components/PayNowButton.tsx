"use client";
import { stripePromise } from "@/lib/stripe";
import { useState } from "react";

export default function PayNowButton({ amount, email }: { amount: number; email: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, email }),
    });

    const data = await res.json();
    const stripe = await stripePromise;
    stripe?.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-blue-600 text-white px-4 py-2 rounded"
      disabled={loading}
    >
      {loading ? "Redirecting..." : "Pay Now"}
    </button>
  );
}
