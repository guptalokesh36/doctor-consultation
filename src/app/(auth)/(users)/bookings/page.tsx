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
  date: string; // YYYY-MM-DD
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

  const today = new Date().toISOString().split("T")[0];

  const upcoming = bookings.filter((b) => b.date >= today);
  const past = bookings.filter((b) => b.date < today);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Booked Appointments</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-muted-foreground">You have no confirmed bookings yet.</p>
      ) : (
        <>
          {/* Upcoming Appointments */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-blue-700">Upcoming</h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
            ) : (
              <ul className="space-y-4">
                {upcoming.map((booking, idx) => (
                  <li
                    key={`upcoming-${idx}`}
                    className="p-4 rounded-lg border border-border bg-background shadow-sm hover:shadow transition-all"
                  >
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium text-muted-foreground">Doctor:</span>{" "}
                        {booking.doctorName}
                      </p>
                      <p>
                        <span className="font-medium text-muted-foreground">Date:</span>{" "}
                        {booking.date}
                      </p>
                      <p>
                        <span className="font-medium text-muted-foreground">Time:</span>{" "}
                        {booking.time}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        (window.location.href = `/chat/${booking.doctorId}`)
                      }
                      className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
                    >
                      Message Doctor
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Past Appointments */}
          <section className="mt-10">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Past</h2>
            {past.length === 0 ? (
              <p className="text-sm text-muted-foreground">No past appointments.</p>
            ) : (
              <ul className="space-y-4">
                {past.map((booking, idx) => (
                  <li
                    key={`past-${idx}`}
                    className="p-4 rounded-lg border bg-muted/30 border-border text-muted-foreground"
                  >
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Doctor:</span>{" "}
                        {booking.doctorName}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span> {booking.date}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span> {booking.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
