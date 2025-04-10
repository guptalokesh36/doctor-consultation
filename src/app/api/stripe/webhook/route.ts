// ✅ app/api/stripe/webhook/route.ts

import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { headers } from "next/headers";
import { db } from "@/firebase/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  // ✅ Handle event type
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const doctorId = session.metadata?.doctorId;
      const patientId = session.metadata?.patientId;
      const date = session.metadata?.date;
      const time = session.metadata?.time;

      if (doctorId && patientId && date && time) {
        try {
            await addDoc(collection(db, "bookings"), {
                doctorId,
                patientId,
                date,
                time,
                status: "confirmed",
                createdAt: Timestamp.now(),
              });
          console.log("✅ Booking recorded successfully.");
        } catch (error) {
          console.error("🔥 Failed to store booking:", error);
        }
      } else {
        console.warn("⚠️ Missing booking metadata in Stripe session.");
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response("Webhook received", { status: 200 });
}
