"use client";

import { stripePromise } from "@/lib/stripe";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PayNowButton({
  amount,
  email,
}: {
  amount: number;
  email: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, email }),
      });

      const data = await res.json();
      const stripe = await stripePromise;

      if (stripe && data.id) {
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        console.error("Stripe not loaded or invalid session ID.");
      }
    } catch (err) {
      console.error("Error during checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        "Pay Now"
      )}
    </Button>
  );
}
