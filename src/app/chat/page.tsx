"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

interface ChatPreview {
  id: string;
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  updatedAt: string;
}

export default function ChatInboxPage() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("User not logged in");
        return;
      }

      const chatsRef = collection(db, "chats");

      const qDoctor = query(
        chatsRef,
        where("doctorId", "==", user.uid),
        orderBy("updatedAt", "desc")
      );
      const qPatient = query(
        chatsRef,
        where("patientId", "==", user.uid),
        orderBy("updatedAt", "desc")
      );

      const [snap1, snap2] = await Promise.all([getDocs(qDoctor), getDocs(qPatient)]);
      const allDocs = [...snap1.docs, ...snap2.docs];

      const results: ChatPreview[] = await Promise.all(
        allDocs.map(async (docSnap) => {
          const data = docSnap.data();
          const otherUserId =
            data.doctorId === user.uid ? data.patientId : data.doctorId;

          const userDoc = await getDoc(doc(db, "user", otherUserId));
          const userInfo = userDoc.exists() ? userDoc.data() : {};

          return {
            id: docSnap.id,
            otherUserId,
            otherUserName: userInfo.displayName || "Unknown",
            lastMessage: data.lastMessage || "",
            updatedAt: data.updatedAt?.toDate().toLocaleString() || "",
          };
        })
      );

    //  console.log("Fetched chats:", results);
      setChats(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Recent Chats</h1>
      {loading ? (
        <p>Loading...</p>
      ) : chats.length === 0 ? (
        <p className="text-muted-foreground">No recent chats yet.</p>
      ) : (
        <ul className="space-y-4">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="p-4 border rounded shadow bg-secondary flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{chat.otherUserName}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {chat.lastMessage}
                </p>
                <p className="text-xs text-gray-500">{chat.updatedAt}</p>
              </div>
              <Link
                href={`/chat/${chat.otherUserId}`}
                className="text-blue-600 hover:underline"
              >
                Open
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
