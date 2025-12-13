import { io } from "socket.io-client";

/**
 * Socket.IO adapter for Azure App Service backend
 * Env var MUST be defined at build time
 */
export const getSocket = () => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  if (!socketUrl) {
    throw new Error("❌ VITE_SOCKET_URL is not defined");
  }

  console.log("🔌 Connecting to Socket.IO at:", socketUrl);

  const socket = io(socketUrl, {
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });

  return socket;
};
