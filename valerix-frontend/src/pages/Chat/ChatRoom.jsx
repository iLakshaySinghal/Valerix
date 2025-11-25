import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChatMessages, sendMessage } from "../../api/chat";
import useSocket from "../../hooks/useSocket";
import { useAuthStore } from "../../store/useAuthStore";

export default function ChatRoom({ theme }) {
  const { chatId } = useParams();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  const socket = useSocket((data) => {
    if (data.chatId === chatId) {
      setMessages((prev) => [...prev, data]);
    }
  });

  useEffect(() => {
    load();
  }, [chatId]);

  async function load() {
    const r = await getChatMessages(chatId);
    setMessages(r.data.messages || []);
  }

  async function handleSend() {
    if (!msg.trim()) return;

    await sendMessage(chatId, msg);
    socket.current.emit("chat:send", { chatId, text: msg });

    setMessages((prev) => [...prev, {
      sender: user._id,
      text: msg,
      createdAt: new Date()
    }]);

    setMsg("");
  }

  const color =
    theme === "admin" ? "pink" :
    theme === "startup" ? "blue" : "green";

  return (
    <div className="flex flex-col h-[75vh]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-xs text-sm ${
              m.sender === user._id
                ? `ml-auto bg-${color}-500 text-black`
                : "bg-gray-800 text-gray-200"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Send box */}
      <div className="flex gap-2 mt-3">
        <input
          className={`flex-1 p-2 rounded-lg bg-black/70 border border-${color}-400/40 
            text-white text-sm outline-none`}
          placeholder="Type a message…"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          onClick={handleSend}
          className={`px-4 py-2 rounded-lg bg-${color}-500 text-black font-semibold`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
