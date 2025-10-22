"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
      } else {
        console.log("✅ Login success:", data);
        localStorage.setItem("accessToken", data.token);
        router.push("/admin/cards");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Không thể kết nối tới server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? "Signing in..." : "SIGN IN"}
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>

      <div className="login-right">
        <img
          src={encodeURI(`${BASE_URL}/uploads/login_bg.jpg`)}
          alt="Login Background"
        />
      </div>
    </div>
  );
}
