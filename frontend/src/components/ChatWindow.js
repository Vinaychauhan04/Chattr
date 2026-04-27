import { useSocket } from "../context/SocketContext";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import useChat from "../hooks/useChat";

const ChatWindow = ({ selectedUser, currentUser }) => {
  const { onlineUsers } = useSocket();
  const { messages, typing, sendMessage, emitTyping } = useChat(selectedUser, currentUser._id);

  if (!selectedUser) {
    return (
      <div className="chat-window empty-state">
        <div>
      <p>pick someone to chat with</p>
        </div>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="avatar">{selectedUser.username[0].toUpperCase()}</div>
        <div>
          <div className="chat-header-name">{selectedUser.username}</div>
          <div className={`status-dot ${isOnline ? "online" : "offline"}`}>
            {isOnline ? "● Online" : "○ Offline"}
          </div>
        </div>
      </div>

      <MessageList messages={messages} currentUserId={currentUser._id} typing={typing} />

      <MessageInput onSend={sendMessage} onTyping={emitTyping} disabled={false} />
    </div>
  );
};

export default ChatWindow;
