import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  (await cookieStore).set("__session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // Immediately expire
  });

  return NextResponse.json({ message: "Logged out" });
}
