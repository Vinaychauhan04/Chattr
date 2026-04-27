import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null); // 1. Changed to useState!
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user?.token) return;

    // 2. Added a fallback to localhost:5000 to guarantee it connects offline
    const socketUrl = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

    const newSocket = io(socketUrl, {
      auth: { token: user.token },
      reconnectionAttempts: 5,
    });

    setSocket(newSocket); // 3. This triggers the app to wake up and use the socket

    newSocket.on("onlineUsers", setOnlineUsers);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);