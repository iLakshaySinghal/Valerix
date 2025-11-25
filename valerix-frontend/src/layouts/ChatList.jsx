// src/layouts/ChatList.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatList() {
  const { user } = useAuthStore();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  async function loadChats() {
    try {
      setLoading(true);

      const res = await api.get("/chats");
      setChats(res.data.chats || []);
    } catch (err) {
      console.error("Failed to load chats", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full md:w-72 border-r border-white/10 bg-black/30 backdrop-blur-lg p-4">
      <h2 className="text-lg font-semibold text-white mb-3">Chats</h2>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : chats.length === 0 ? (
        <p className="text-gray-500 text-sm">No chats yet.</p>
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => {
            const other =
              chat.participants?.find((p) => p._id !== user._id) || {};

            const name = other.name || other.email || "Unknown";

            return (
              <Link
                key={chat._id}
                to={`/chat/${chat._id}`}
                className="block p-3 bg-white/5 hover:bg-white/10 
                           rounded-lg transition text-sm text-white"
              >
                {name}
                <div className="opacity-60 text-xs mt-1">
                  {chat.lastMessage?.content || "No messages yet"}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
