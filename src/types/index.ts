// /types/index.ts

import { Timestamp } from "firebase/firestore";

export interface AvailabilityEntry {
    day: string;
    slots: string[];
  }
  
  export interface Doctor {
    uid: string;
    displayName: string;
    email: string;
    role: "doctor" | "admin" | "user";
    bio?: string;
    specialization?: string;
    availability?: AvailabilityEntry[];
  }

  export interface Booking {
    doctorId: string;
    patientId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    status: "confirmed" | "pending" | "cancelled";
    createdAt: Timestamp; // or Timestamp if imported
  }