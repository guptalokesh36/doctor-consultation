"use client";
import { useState } from "react";
//import { bookAppointment } from "@/firebase/firebase";
import { auth } from "@/firebase/firebase";
import { Doctor } from "@/types";



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
      alert("Something went wrong.");
    }
  };
  

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Book Appointment</h2>
      <div className="space-y-4">
        {doctor.availability?.map((day) => (
          <div key={day.day}>
            <strong>{day.day}</strong>:
            <div className="flex gap-2 mt-1 flex-wrap">
              {day.slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {
                    setSelectedDay(day.day);
                    setSelectedTime(slot);
                  }}
                  className={`px-3 py-1 border rounded ${
                    selectedDay === day.day && selectedTime === slot
                      ? "bg-blue-600 text-forground"
                      : "bg-secondary text-primary"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleBooking}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Confirm Booking
      </button>
    </div>
  );
}

// Helper to get next date string from weekday name (like "Monday")
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
  
  