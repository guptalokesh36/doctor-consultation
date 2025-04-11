"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Booking {
  patientId: string;
  date: string;
  time: string;
}

interface GroupedPatient {
  patientName: string;
  patientEmail: string;
  id: string; // ✅ add this
  appointments: { date: string; time: string }[];
}


export default function PatientsPage() {
  const [patients, setPatients] = useState<GroupedPatient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setPatients([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "bookings"),
        where("doctorId", "==", user.uid),
        where("status", "==", "confirmed")
      );

      const snap = await getDocs(q);

      const grouped: Record<string, GroupedPatient> = {};

      for (const docSnap of snap.docs) {
        const data = docSnap.data() as Booking;

        const patientRef = doc(db, "user", data.patientId);
        const patientSnap = await getDoc(patientRef);

        const patientData = patientSnap.exists()
          ? patientSnap.data()
          : { displayName: "Unknown", email: "N/A" };

          if (!grouped[data.patientId]) {
            grouped[data.patientId] = {
              id: data.patientId, // ✅ include patientId here
              patientName: patientData.displayName,
              patientEmail: patientData.email,
              appointments: [],
            };
          }
          

        grouped[data.patientId].appointments.push({
          date: data.date,
          time: data.time,
        });
      }

      const finalList = Object.values(grouped);
      setPatients(finalList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Patients</h1>
      {loading ? (
        <p>Loading...</p>
      ) : patients.length === 0 ? (
        <p>No patients have booked appointments yet.</p>
      ) : (
        <ul className="space-y-6">
          {patients.map((booking, idx) => (
            <li
              key={idx}
              className="p-4 border rounded bg-secondary text-primary shadow"
            >
              <p>
                <strong>Patient:</strong> {booking.patientName}
              </p>
              <p>
                <strong>Email:</strong> {booking.patientEmail}
              </p>
              <p className="mt-2 font-semibold">Appointments:</p>
              <ul className="ml-4 list-disc">
                {booking.appointments.map((appt, i) => (
                  <li key={i}>
                    {appt.date} at {appt.time}
                  </li>
                ))}
              <button
                onClick={() => (window.location.href = `/chat/${booking.id}`)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
              >
                Message
              </button>
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
