import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const { login, register, loading, error, setError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setError(null);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) login(form.email, form.password);
    else register(form.username, form.email, form.password);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Chattr</h1>
        <h2>{isLogin ? "good to see you again" : "join the chat"}</h2>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? "hang on..." : isLogin ? "sign in" : "create account"}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "new here?" : "already got one?"}{" "}
          <span onClick={() => { setIsLogin(!isLogin); setError(null); }}>
            {isLogin ? "make an account" : "sign in"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
