import React, { useState } from "react";
import api from "../../utils/api";

export default function StartupChat() {
  const [roomId, setRoomId] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  const startChat = async () => {
    const res = await api.get(`/chat/support/startup`);
    const id = res.data.roomId;
    setRoomId(id);

    const msgsRes = await api.get(`/chat/${id}`);
    setMsgs(msgsRes.data.messages || []);
  };

  const send = async () => {
    if (!text) return;
    const res = await api.post(`/chat/${roomId}`, { text });
    setMsgs([...msgs, res.data.message]);
    setText("");
  };

  return (
    <div className="h-[75vh] flex flex-col">
      <button
        onClick={startChat}
        className="mb-4 p-2 bg-cyan-500 text-black rounded-xl"
      >
        Start Chat with Admin
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 bg-black/30 p-3 rounded-xl border border-cyan-500/30">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`max-w-xs px-3 py-2 rounded-xl ${
              m.from === "startup"
                ? "ml-auto bg-cyan-500 text-black"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 bg-black/70 border border-slate-700 rounded-xl"
          placeholder="Type message..."
        />
        <button
          onClick={send}
          className="px-4 bg-cyan-500 rounded-xl text-black"
        >
          Send
        </button>
      </div>
    </div>
  );
}
