import React, { useEffect, useState } from "react";
import { getChats } from "../../api/chat";
import { Link } from "react-router-dom";

export default function ChatList({ theme }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const r = await getChats();
      setChats(r.data.chats || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const color =
    theme === "admin" ? "pink" :
    theme === "startup" ? "blue" : "green";

  if (loading)
    return <p className={`text-${color}-300`}>Loading chats…</p>;

  return (
    <div>
      <h1 className={`text-xl font-bold text-${color}-300 mb-4`}>
        Messages
      </h1>

      <div className="space-y-3">
        {chats.map((c) => (
          <Link
            key={c._id}
            to={`/chat/${c._id}`}
            className={`block p-3 rounded-lg bg-black/50 border border-${color}-400/30
              hover:border-${color}-400 hover:shadow-[0_0_15px] transition`}
          >
            <div className={`text-${color}-200 font-medium`}>
              {c.otherUser?.name || "Unknown"}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {c.lastMessage?.text || "No messages yet"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
