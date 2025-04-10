"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import {
  getDocs,
  query,
  where,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Booking {
  doctorId: string;
  date: string;
  time: string;
}

interface BookingWithDoctorName extends Booking {
  doctorName: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDoctorName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "bookings"),
        where("patientId", "==", user.uid),
        where("status", "==", "confirmed")
      );

      const snap = await getDocs(q);

      const bookingData = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const data = docSnap.data() as Booking;

          // Fetch the doctor name from /user/{doctorId}
          const doctorRef = doc(db, "user", data.doctorId);
          const doctorSnap = await getDoc(doctorRef);
          const doctorName = doctorSnap.exists()
            ? doctorSnap.data().displayName
            : "Unknown Doctor";

          return {
            ...data,
            doctorName,
          };
        })
      );

      setBookings(bookingData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Booked Appointments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>You have no confirmed bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking, idx) => (
            <li key={idx} className="p-4 border rounded shadow-sm bg-secondary text-primary">
              <p>
                <strong>Doctor:</strong> {booking.doctorName}
              </p>
              <p>
                <strong>Date:</strong> {booking.date}
              </p>
              <p>
                <strong>Time:</strong> {booking.time}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
