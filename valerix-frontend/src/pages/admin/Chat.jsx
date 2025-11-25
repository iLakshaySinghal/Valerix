// src/pages/Admin/Chat.jsx
import { useState } from "react";
import api from "../../utils/api";

export default function AdminChat() {
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const openChat = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      // adjust these endpoints to match your chat controller
      const roomRes = await api.get(`/chat/room/${userId}`);
      const id = roomRes.data.roomId || roomRes.data._id;
      setRoomId(id);

      const msgsRes = await api.get(`/chat/${id}`);
      setMessages(msgsRes.data.messages || msgsRes.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to open chat");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!roomId || !text) return;
    try {
      const res = await api.post(`/chat/${roomId}`, { text });
      const msg = res.data.message || res.data;
      setMessages((prev) => [...prev, msg]);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3 h-[calc(100vh-9rem)]">
      {/* Left panel */}
      <div className="rounded-2xl bg-black/60 border border-cyan-500/30 p-4 flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-cyan-200">
          Chat Console
        </h2>
        <p className="text-[11px] text-slate-400">
          Enter a user ID/email to start a support conversation.
        </p>
        <input
          className="px-3 py-2 rounded-xl bg-black/80 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          placeholder="User ID or email"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button
          onClick={openChat}
          className="px-3 py-2 rounded-xl bg-cyan-500 text-black text-xs font-semibold hover:bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.8)]"
        >
          {loading ? "Opening…" : "Open Chat"}
        </button>
        <div className="mt-auto text-[10px] text-slate-500">
          Coming soon: real-time socket integration.
        </div>
      </div>

      {/* Right panel */}
      <div className="rounded-2xl bg-black/60 border border-cyan-500/30 p-4 md:col-span-2 flex flex-col">
        {!roomId ? (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
            Select a user to start chatting.
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
              {messages.map((m) => (
                <div
                  key={m._id || Math.random()}
                  className={`max-w-xs px-3 py-2 rounded-2xl text-[11px] ${
                    m.from === "admin"
                      ? "ml-auto bg-cyan-500 text-black shadow-[0_0_18px_rgba(34,211,238,0.8)]"
                      : "bg-slate-900 text-slate-100 border border-slate-700"
                  }`}
                >
                  <div>{m.text}</div>
                  <div className="mt-1 text-[9px] opacity-60">
                    {m.createdAt &&
                      new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-1">
              <input
                className="flex-1 px-3 py-2 rounded-xl bg-black/80 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                placeholder="Type a message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-semibold hover:bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.8)]"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
