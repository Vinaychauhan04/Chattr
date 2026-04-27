import { useEffect, useRef } from "react";

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const MessageList = ({ messages, currentUserId, typing }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div className="message-list">
      {messages.map((msg) => {
        const isMine = msg.senderId === currentUserId;
        return (
          <div key={msg._id} className={`message-row ${isMine ? "mine" : "theirs"}`}>
            <div className={`bubble ${isMine ? "bubble-mine" : "bubble-theirs"}`}>
              <p>{msg.message}</p>
              <span className="timestamp">{formatTime(msg.createdAt)}</span>
              {isMine && (
                <span className="read-receipt">{msg.read ? "✓✓" : "✓"}</span>
              )}
            </div>
          </div>
        );
      })}

      {typing && (
        <div className="message-row theirs">
          <div className="bubble bubble-theirs typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
