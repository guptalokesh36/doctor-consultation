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
  id: string;
  patientName: string;
  patientEmail: string;
  appointments: { date: string; time: string }[];
}

export default function PatientsPage() {
  const [upcomingPatients, setUpcomingPatients] = useState<GroupedPatient[]>([]);
  const [pastPatients, setPastPatients] = useState<GroupedPatient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUpcomingPatients([]);
        setPastPatients([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "bookings"),
        where("doctorId", "==", user.uid),
        where("status", "==", "confirmed")
      );

      const snap = await getDocs(q);
      const groupedUpcoming: Record<string, GroupedPatient> = {};
      const groupedPast: Record<string, GroupedPatient> = {};

      const today = new Date().toISOString().split("T")[0];

      for (const docSnap of snap.docs) {
        const data = docSnap.data() as Booking;
        const isUpcoming = data.date >= today;

        const patientRef = doc(db, "user", data.patientId);
        const patientSnap = await getDoc(patientRef);

        const patientData = patientSnap.exists()
          ? patientSnap.data()
          : { displayName: "Unknown", email: "N/A" };

        const targetGroup = isUpcoming ? groupedUpcoming : groupedPast;

        if (!targetGroup[data.patientId]) {
          targetGroup[data.patientId] = {
            id: data.patientId,
            patientName: patientData.displayName,
            patientEmail: patientData.email,
            appointments: [],
          };
        }

        targetGroup[data.patientId].appointments.push({
          date: data.date,
          time: data.time,
        });
      }

      setUpcomingPatients(Object.values(groupedUpcoming));
      setPastPatients(Object.values(groupedPast));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderPatients = (title: string, patients: GroupedPatient[]) => (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {patients.length === 0 ? (
        <p className="text-muted-foreground">No {title.toLowerCase()} patients.</p>
      ) : (
        <ul className="space-y-6">
          {patients.map((patient, idx) => (
            <li
              key={idx}
              className="p-6 border rounded-lg bg-secondary text-primary shadow-md"
            >
              <div className="mb-2">
                <p className="text-lg font-semibold">👤 {patient.patientName}</p>
                <p className="text-sm text-muted-foreground">{patient.patientEmail}</p>
              </div>

              <div className="mt-4">
                <p className="font-medium mb-1">Appointments:</p>
                <ul className="ml-4 list-disc text-sm space-y-1">
                  {patient.appointments.map((appt, i) => (
                    <li key={i}>
                      {appt.date} at {appt.time}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 text-right">
                <button
                  onClick={() => (window.location.href = `/chat/${patient.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Message
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Patients</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {renderPatients("Upcoming Appointments", upcomingPatients)}
          {renderPatients("Past Appointments", pastPatients)}
        </>
      )}
    </div>
  );
}
