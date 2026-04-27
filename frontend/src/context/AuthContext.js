import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("chatUser") || "null")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/auth/register", { username, email, password });
      localStorage.setItem("chatUser", JSON.stringify(data));
      setUser(data);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("chatUser", JSON.stringify(data));
      setUser(data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("chatUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
