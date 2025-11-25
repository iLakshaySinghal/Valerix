import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";

export default function ChatWindow() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  // load messages when chatId changes
  useEffect(() => {
    if (!chatId) return;
    loadMessages();

    // simple live-updates every 2 seconds
    const interval = setInterval(() => loadMessages(false), 2000);
    return () => clearInterval(interval);
  }, [chatId]);

  async function loadMessages(showLoader = true) {
    try {
      if (showLoader) setLoading(true);

      const res = await api.get(`/chat/${chatId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoader) setLoading(false);
      scrollToBottom();
    }
  }

  // auto scroll
  function scrollToBottom() {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);
  }

  async function sendMessage() {
    if (!msg.trim()) return;

    try {
      await api.post(`/chat/${chatId}/message`, { message: msg });
      setMsg("");
      loadMessages(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  }

  if (!chatId) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
        Select a chat to start messaging.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh]">

      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-700 text-orange-300 font-semibold">
        Chat Room: {chatId}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scroll"
      >
        {loading ? (
          <div className="text-zinc-400 text-sm">Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className="text-zinc-500 text-sm">No messages yet.</div>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                m.isSelf
                  ? "ml-auto bg-orange-500/20 border border-orange-500/40 text-orange-200"
                  : "bg-zinc-800 border border-zinc-700 text-zinc-200"
              }`}
            >
              <div className="text-xs opacity-75">{m.senderName}</div>
              <div>{m.message}</div>
              <div className="text-[10px] opacity-50 mt-1">
                {new Date(m.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-zinc-700 flex gap-2">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 bg-black/40 border border-zinc-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
