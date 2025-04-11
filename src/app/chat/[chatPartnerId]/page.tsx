"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  doc,
  serverTimestamp,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { canChatWithUser } from "@/lib/canChatWithUser";

interface Message {
  senderId: string;
  text: string;
  timestamp: Timestamp;
}

export default function ChatPage() {
  const { chatPartnerId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [canChat, setCanChat] = useState(false);

  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  const chatId = [currentUser?.uid, chatPartnerId].sort().join("_");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const checkChatEligibility = async () => {
      const ok = await canChatWithUser(
        currentUser.uid,
        chatPartnerId as string
      );
      setCanChat(ok);
    };

    checkChatEligibility();
  }, [chatPartnerId, currentUser]);

  useEffect(() => {
    if (!canChat || !currentUser) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data() as Message));
    });

    return () => unsubscribe();
  }, [chatId, canChat, currentUser]);

  const sendMessage = async () => {
    if (!input.trim() || !currentUser) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUser.uid,
      text: input,
      timestamp: serverTimestamp(),
    });

    const [uid1, uid2] = [currentUser.uid, chatPartnerId as string].sort();

    await setDoc(doc(db, "chats", `${uid1}_${uid2}`), {
      doctorId: uid1, // optional refinement based on user roles
      patientId: uid2,
      lastMessage: input,
      updatedAt: serverTimestamp(),
    });

    setInput("");
  };

  if (!canChat) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Chat Access Denied</h2>
        <p>You must have a confirmed appointment to chat.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Chat</h1>
      <div className="border rounded p-4 h-96 overflow-y-auto bg-secondary shadow-sm mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 ${
              msg.senderId === currentUser?.uid ? "text-right" : "text-left"
            }`}
          >
            <span className="bg-secondary-foreground text-background px-3 py-1 rounded inline-block max-w-xs break-words">
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-grow px-3 py-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
