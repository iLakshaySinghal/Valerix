import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link, useLocation } from "react-router-dom";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadChats();

    // Auto-refresh every 3 sec
    const interval = setInterval(loadChats, 3000);
    return () => clearInterval(interval);
  }, []);

  async function loadChats() {
    try {
      setLoading(true);
      const res = await api.get("/chat");
      setChats(res.data.chats || []);
    } catch (err) {
      console.error("Failed to load chats:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full overflow-y-auto border-r border-zinc-700 bg-[#0d0d12] custom-scroll">

      {/* HEADER */}
      <div className="px-4 py-4 border-b border-zinc-700">
        <h2 className="text-lg font-semibold text-orange-300">Chats</h2>
      </div>

      {loading ? (
        <div className="p-4 text-sm text-zinc-400">Loading chats…</div>
      ) : chats.length === 0 ? (
        <div className="p-4 text-sm text-zinc-500">No chats found</div>
      ) : (
        <div className="flex flex-col">
          {chats.map((chat) => {
            const last = chat.lastMessage;
            const active = location.pathname.includes(chat._id);

            return (
              <Link
                key={chat._id}
                to={`/chat/${chat._id}`}
                className={`px-4 py-3 border-b border-zinc-800 transition
                 ${active ? "bg-orange-500/20" : "hover:bg-zinc-800/40"}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-orange-200 font-medium">
                      {chat.partnerName || "Chat"}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 line-clamp-1">
                      {last?.message || "No messages"}
                    </div>
                  </div>

                  {/* Unread Bubble */}
                  {chat.unreadCount > 0 && (
                    <span className="ml-2 bg-orange-500 text-black text-xs px-2 py-1 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
