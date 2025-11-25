import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// DEFAULT EXPORT ✔
export default function useSocket(onMessage) {
  const { token, user } = useAuthStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !user) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socket;

    console.log("🔌 Connecting to socket...");

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected");
    });

    // Attach message handler only if provided
    if (onMessage) {
      socket.on("message", onMessage);
    }

    return () => {
      console.log("🔌 Closing socket...");
      if (onMessage) socket.off("message", onMessage);
      socket.disconnect();
    };
  }, [token, user, onMessage]);

  return socketRef;
}
