import React from "react";
import ChatBox from "../components/ChatBox.jsx";
import { useAuthStore } from "../stores/useAuthStore.js";

export default function ChatPage() {
  const user = useAuthStore((s) => s.user);
  const room = user ? `user_${user.id}_startup` : "guest_room";
  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold">Real-time Chat</h2>
      <div className="mt-4">
        <ChatBox room={room} />
      </div>
    </main>
  );
}
