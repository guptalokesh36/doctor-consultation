"use client";

import { Doctor } from "@/types"; 
import BookingForm from "./BookingForm";

export default function DoctorProfileClient({ doctor }: { doctor: Doctor }) {
  return <BookingForm doctor={doctor} />;
}
