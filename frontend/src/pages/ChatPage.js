import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import api from "../utils/api";

const ChatPage = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    api.get("/api/users").then(({ data }) => setUsers(data));
  }, []);

  return (
    <div className="chat-layout">
      <Sidebar
        users={users}
        selectedUser={selectedUser}
        onSelect={setSelectedUser}
        currentUser={user}
        onLogout={logout}
      />
      <ChatWindow selectedUser={selectedUser} currentUser={user} />
    </div>
  );
};

export default ChatPage;
