import { io } from "socket.io-client";

// Native Socket.IO implementation for Azure App Service
export const getSocket = async () => {
    // API URL from env or fallback to Azure App Service
    const socketUrl = import.meta.env.VITE_API_BASE_URL || "https://zovo-backend.azurewebsites.net";

    console.log("🔌 Connecting to Socket.IO at:", socketUrl);

    const socket = io(socketUrl, {
        transports: ["websocket"], // Enforce websocket only for best performance
        withCredentials: true,
        reconnection: true,
    });

    socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.warn("⚠️ Socket connection error:", err.message);
    });

    return socket;
};
