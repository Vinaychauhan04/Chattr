import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import api from "../utils/api";

const useChat = (selectedUser, currentUserId) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const typingTimeout = useRef(null);

  // Load history when conversation changes
  useEffect(() => {
    if (!selectedUser) return;
    setMessages([]);
    api.get(`/api/messages/${selectedUser._id}`).then(({ data }) => setMessages(data));
  }, [selectedUser]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const onReceive = (msg) => {
      if (
        msg.senderId === selectedUser?._id ||
        msg.receiverId === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const onSent = (msg) => setMessages((prev) => [...prev, msg]);

    const onTyping = ({ senderId }) => {
      if (senderId === selectedUser?._id) setTyping(true);
    };

    const onStopTyping = ({ senderId }) => {
      if (senderId === selectedUser?._id) setTyping(false);
    };

    socket.on("receiveMessage", onReceive);
    socket.on("messageSent", onSent);
    socket.on("userTyping", onTyping);
    socket.on("userStopTyping", onStopTyping);

    return () => {
      socket.off("receiveMessage", onReceive);
      socket.off("messageSent", onSent);
      socket.off("userTyping", onTyping);
      socket.off("userStopTyping", onStopTyping);
    };
  }, [socket, selectedUser]);

  const sendMessage = useCallback(
    (message) => {
      if (!socket || !selectedUser || !message.trim()) return;
      socket.emit("sendMessage", { receiverId: selectedUser._id, message });
    },
    [socket, selectedUser]
  );

  const emitTyping = useCallback(() => {
    if (!socket || !selectedUser) return;
    socket.emit("typing", { receiverId: selectedUser._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 1500);
  }, [socket, selectedUser]);

  return { messages, typing, sendMessage, emitTyping };
};

export default useChat;
