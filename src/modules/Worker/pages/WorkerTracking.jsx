import React, { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import MapMock from '../../components/MapMock'
import { useSocket } from '../../context/SocketContext'

export default function WorkerTracking() {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for live updates (works for both Socket.IO and Web PubSub Adapter)
    socket.on('locationUpdate', (data) => {
      console.log("Live location update:", data);
      // Implementation for mapping update would go here
    });

    return () => {
      socket.off('locationUpdate');
    }
  }, [socket]);

  return (
    <div className="md:flex gap-6">
      <Sidebar role="worker" />
      <div className="flex-1">
        <div className="glass p-6 rounded-xl">
          <h3 className="font-semibold">Live location</h3>
          <MapMock />
          <div className="mt-3 text-slate-300">
            {socket ? "🟢 Live Updates Active" : "🔴 Connecting..."}
          </div>
        </div>
      </div>
    </div>
  )
}
