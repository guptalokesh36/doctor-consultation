import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";

export async function POST(req: NextRequest) {
  const { amount, email, doctorId, patientId, date, time } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: "Consultation Appointment",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      doctorId,
      patientId,
      date,
      time,
    },
    success_url: `${req.nextUrl.origin}/success`,
    cancel_url: `${req.nextUrl.origin}/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
