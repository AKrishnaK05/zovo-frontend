import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSocket } from '../utils/socketAdapter';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        let socketInstance = null;

        const initSocket = async () => {
            if (!user) return; // Only connect if authenticated (or logic depends on use case)

            try {
                socketInstance = await getSocket();
                setSocket(socketInstance);

                // Optional: Join user-specific room
                if (socketInstance) {
                    // For Socket.IO, we might emit 'join', but for Web PubSub, relying on negotiated tokens 
                    // usually puts user in groups based on userId used during negotiation.
                    // If local, we might need to verify auth again or handshake.

                    // Example generic join
                    // socketInstance.emit('joinRoom', `worker-${user.id}`);
                }

            } catch (error) {
                console.error("Socket initialization failed", error);
            }
        };

        if (user) {
            initSocket().then(() => {
                // Join rooms after socket is connected
                if (socketInstance && socketInstance.connected) {
                    socketInstance.emit('join', user._id || user.id);
                    if (user.role === 'worker') {
                        socketInstance.emit('joinRoom', `worker-${user._id || user.id}`);
                    }
                    if (user.role === 'customer') {
                        socketInstance.emit('joinRoom', `customer-${user._id || user.id}`);
                    }
                } else if (socketInstance) {
                    // Wait for connect
                    socketInstance.on('connect', () => {
                        socketInstance.emit('join', user._id || user.id);
                        if (user.role === 'worker') {
                            socketInstance.emit('joinRoom', `worker-${user._id || user.id}`);
                        }
                    });
                }
            });
        }

        return () => {
            if (socketInstance) {
                // Check if it has close/disconnect method
                if (socketInstance.disconnect) socketInstance.disconnect();
                else if (socketInstance.client && socketInstance.client.stop) socketInstance.client.stop(); // WebPubSubClient
            }
            setSocket(null);
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
