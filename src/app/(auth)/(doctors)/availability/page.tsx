"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { onAuthStateChanged } from "firebase/auth";

const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const TIMES = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
];

type AvailabilityMap = Record<string, string[]>;

interface AvailabilityEntry {
  day: string;
  slots: string[];
}

export default function WeeklyAvailability() {
  const [availability, setAvailability] = useState<AvailabilityMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return setLoading(false);

      const ref = doc(db, "user", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        const days: AvailabilityMap = {};
        (data.availability as AvailabilityEntry[] ?? []).forEach((entry) => {
          days[entry.day] = entry.slots;
        });
        setAvailability(days);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleSlot = (day: string, time: string) => {
    setAvailability((prev) => {
      const current = prev[day] || [];
      return {
        ...prev,
        [day]: current.includes(time)
          ? current.filter((t) => t !== time)
          : [...current, time],
      };
    });
  };

  const saveAvailability = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const formatted = Object.entries(availability).map(([day, slots]) => ({
      day,
      slots,
    }));

    await setDoc(doc(db, "user", user.uid), {
      availability: formatted,
    }, { merge: true });

    toast.success("Availability saved!");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Weekly Availability</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border">Time</th>
              {WEEKDAYS.map((day) => (
                <th key={day} className="p-2 border text-sm">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map((time) => (
              <tr key={time}>
                <td className="border p-2 font-medium text-center">{time}</td>
                {WEEKDAYS.map((day) => {
                  const isSelected = availability[day]?.includes(time);
                  return (
                    <td
                      key={day}
                      className={`border p-2 text-center cursor-pointer ${
                        isSelected ? "bg-blue-600 text-primary-foreground" : "bg-secondary text-primary hover:bg-blue-500"
                      }`}
                      onClick={() => toggleSlot(day, time)}
                    >
                      {isSelected ? "✓" : "X"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={saveAvailability}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        Save Availability
      </button>
    </div>
  );
}
