import { useState } from "react";

const MessageInput = ({ onSend, onTyping, disabled }) => {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        className="message-input"
        value={text}
        onChange={handleChange}
        placeholder={disabled ? "select someone first" : "say something..."}
        disabled={disabled}
        maxLength={1000}
      />
      <button type="submit" className="send-btn" disabled={disabled || !text.trim()}>
        ➤
      </button>
    </form>
  );
};

export default MessageInput;
