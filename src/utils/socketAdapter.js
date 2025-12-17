import { io } from "socket.io-client";

/**
 * Socket.IO adapter for Azure App Service backend
 * Env var MUST be defined at build time
 */
export const getSocket = () => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  if (!socketUrl) {
    throw new Error("[ERROR] VITE_SOCKET_URL is not defined");
  }

  console.log("[INFO] Connecting to Socket.IO at:", socketUrl);

  const socket = io(socketUrl, {
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("[SUCCESS] Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("[ERROR] Socket connection error:", err.message);
  });

  return socket;
};
