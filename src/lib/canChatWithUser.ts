import { db } from "@/firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

export async function canChatWithUser(currentUid: string, targetUid: string): Promise<boolean> {
    const bookingsRef = collection(db, "bookings");
  
    const q = query(
      bookingsRef,
      where("status", "==", "confirmed"),
      where("doctorId", "in", [currentUid, targetUid]),
      where("patientId", "in", [currentUid, targetUid])
    );
  
    const snap = await getDocs(q);
  
    return snap.docs.some((doc) => {
      const data = doc.data();
      return (
        (data.doctorId === currentUid && data.patientId === targetUid) ||
        (data.doctorId === targetUid && data.patientId === currentUid)
      );
    });
  }
  
