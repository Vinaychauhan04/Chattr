import { useSocket } from "../context/SocketContext";

const Sidebar = ({ users, selectedUser, onSelect, currentUser, onLogout }) => {
  const { onlineUsers } = useSocket();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-me">
          <div className="avatar">{currentUser.username[0].toUpperCase()}</div>
          <span className="sidebar-username">{currentUser.username}</span>
        </div>
        <button className="logout-btn" onClick={onLogout} title="sign out">⏻</button>
      </div>

      <div className="sidebar-title">people</div>

      <ul className="user-list">
        {users.map((u) => {
          const isOnline = onlineUsers.includes(u._id);
          const isActive = selectedUser?._id === u._id;
          return (
            <li
              key={u._id}
              className={`user-item ${isActive ? "active" : ""}`}
              onClick={() => onSelect(u)}
            >
              <div className="avatar">{u.username[0].toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{u.username}</span>
                <span className={`status-dot ${isOnline ? "online" : "offline"}`}>
                  {isOnline ? "● Online" : "○ Offline"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
