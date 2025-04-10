//app/api/get-role/route.ts - get user role using Firebase Admin
import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/firebase/firebase-admin";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  if (!token) return NextResponse.json({ role: "guest" });

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;
    const userDoc = await adminDB.collection("user").doc(uid).get();
    const role = userDoc.exists ? userDoc.data()?.role : "user";
    return NextResponse.json({ role });
  } catch {
    return NextResponse.json({ role: "guest" });
  }
}