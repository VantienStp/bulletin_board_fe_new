"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "./login.css";  // import css

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);

  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password, remember);
      router.push("/admin");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="login-container">
      {/* Left: form */}
      <div className="login-left">
        <div className="login-box">
          <h1 className="title">Welcome back</h1>
          <p className="subtitle">Enter your email and password to sign in</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="form-remember">
              <label>
                <input 
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)} 
                />
                Remember me
              </label>
            </div>

            <button type="submit" disabled={isLoading} className="btn-submit">
              {isLoading ? "Signing in..." : "SIGN IN"}
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>

      <div className="login-right">
        <img src="http://127.0.0.1:5000/uploads/login_bg.jpg" alt="Login Background" />
      </div>
    </div>
  );
}
