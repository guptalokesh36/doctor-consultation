"use client";

import { useState } from "react";
import { auth } from "@/firebase/firebase";
import { Doctor } from "@/types";
import { toast } from "sonner";

export default function BookingForm({ doctor }: { doctor: Doctor }) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!selectedDay || !selectedTime) return alert("Please pick a slot.");

    const patientId = auth.currentUser?.uid;
    const selectedDate = getNextDateFromWeekday(selectedDay);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: auth.currentUser?.email,
        amount: 2000,
        doctorId: doctor.uid,
        patientId,
        date: selectedDate,
        time: selectedTime,
      }),
    });

    const { url } = await res.json();

    if (url) {
      window.location.href = url;
    } else {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="mt-6 bg-background border border-border rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Book Appointment</h2>

      {doctor.availability?.map((day) => (
        <div key={day.day} className="mb-4">
          <p className="font-medium text-foreground mb-2">{day.day}</p>
          <div className="flex gap-2 flex-wrap">
            {day.slots.map((slot) => {
              const isSelected =
                selectedDay === day.day && selectedTime === slot;
              return (
                <button
                  key={slot}
                  onClick={() => {
                    setSelectedDay(day.day);
                    setSelectedTime(slot);
                  }}
                  className={`px-3 py-1 text-sm rounded border transition-all
                    ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-secondary text-primary hover:bg-accent"
                    }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={handleBooking}
        className="mt-4 w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        Confirm Booking
      </button>
    </div>
  );
}

// Helper to get next date string from weekday name
function getNextDateFromWeekday(weekday: string): string {
  const formatted = weekday.charAt(0).toUpperCase() + weekday.slice(1).toLowerCase();

  const daysMap: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const dayIndex = daysMap[formatted];
  if (dayIndex === undefined) {
    throw new Error(`Invalid weekday: ${weekday}`);
  }

  const today = new Date();
  const dayDiff = (7 + dayIndex - today.getDay()) % 7;
  const result = new Date(today);
  result.setDate(today.getDate() + dayDiff);
  return result.toISOString().split("T")[0];
}
