"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { db, auth } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
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

interface UserInfo {
  name: string;
}

export default function ChatPage() {
  const { chatPartnerId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [canChat, setCanChat] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<UserInfo | null>(null);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const fetchChatPartnerInfo = async () => {
      if (!chatPartnerId) return;

      const partnerRef = doc(db, "user", chatPartnerId as string);
      const snap = await getDoc(partnerRef);

      if (snap.exists()) {
        const data = snap.data();
        setPartnerInfo({
          name: data.displayName ?? "Unknown",
        });
      }
    };

    fetchChatPartnerInfo();
  }, [chatPartnerId]);

  useEffect(() => {
    const container = chatBoxRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !currentUser) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      senderId: currentUser.uid,
      text: input,
      timestamp: serverTimestamp(),
    });

    const [uid1, uid2] = [currentUser.uid, chatPartnerId as string].sort();

    await setDoc(doc(db, "chats", `${uid1}_${uid2}`), {
      doctorId: uid1,
      patientId: uid2,
      lastMessage: input,
      updatedAt: serverTimestamp(),
    });

    setInput("");
  };

  if (!canChat) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Chat Access Denied</h2>
        <p className="text-muted-foreground mt-2">
          You must have a confirmed appointment to chat.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-[90vh]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Chat</h1>
        {partnerInfo && (
          <p className="text-sm text-muted-foreground">
            Chatting with <strong>{partnerInfo.name}</strong>
          </p>
        )}
      </div>

      {/* Messages */}
      <div
        ref={chatBoxRef}
        className="flex-1 border rounded p-4 overflow-y-auto bg-secondary shadow-sm"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 flex ${
              msg.senderId === currentUser?.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs">
              <div className="bg-secondary-foreground text-background px-3 py-2 rounded-lg shadow-sm">
                {msg.text}
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {msg.timestamp?.toDate().toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message"
          className="flex-grow px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
