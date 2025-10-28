"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, BASE_URL } from "@/lib/api";
import CryptoJS from "crypto-js";

export default function SignUpPage() {
  const router = useRouter();

  // Inputs & states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [focus, setFocus] = useState({
    email: false,
    password: false,
    confirm: false,
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirm: false,
  });

  // Email & Password criteria
  const [emailCriteria, setEmailCriteria] = useState({
    hasAt: false,
    hasDot: false,
    noSpace: true,
    notUsername: true,
  });

  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [criteria, setCriteria] = useState({
    length: false,
    numberOrSymbol: false,
    upperCase: false,
    notEmail: true,
  });

  const [loading, setLoading] = useState(false);

  // Validation rules
  const validateUsername = (val) => {
    if (!val.trim()) return "Tên người dùng không được để trống.";
    if (val.length < 3) return "Tên phải có ít nhất 3 ký tự.";
    if (!/^[a-zA-Z0-9_]+$/.test(val))
      return "Tên chỉ được chứa chữ, số hoặc dấu gạch dưới.";
    return "";
  };

  const validateEmail = (val) => {
    if (!val.trim()) return "Vui lòng nhập email.";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) return "Email không hợp lệ.";
    return "";
  };

  const validatePassword = (val) => {
    if (!val.trim()) return "Vui lòng nhập mật khẩu.";
    if (val.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
    if (!/[A-Z]/.test(val)) return "Cần ít nhất 1 chữ hoa.";
    if (!/[0-9]/.test(val)) return "Cần ít nhất 1 chữ số.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(val))
      return "Cần ít nhất 1 ký tự đặc biệt.";
    return "";
  };

  const validateConfirm = (val) => {
    if (val !== password) return "Mật khẩu nhập lại không khớp.";
    return "";
  };

  // ====== Criteria checkers ======
  const checkEmailCriteria = (val) => {
    setEmailCriteria({
      hasAt: val.includes("@"),
      hasDot: val.includes("."),
      noSpace: !val.includes(" "),
      notUsername: !val.includes(username),
    });
  };

  const checkPasswordStrength = (val) => {
    const hasLength = val.length >= 8;
    const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(val);
    const hasUpperCase = /[A-Z]/.test(val);
    const notEmail = !val.includes(email.split("@")[0]);
    setCriteria({ length: hasLength, numberOrSymbol: hasNumberOrSymbol, upperCase: hasUpperCase, notEmail });
    const passed = [hasLength, hasNumberOrSymbol, hasUpperCase, notEmail].filter(Boolean).length;
    if (passed <= 1) setPasswordStrength("weak");
    else if (passed === 2 || passed === 3) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  };

  // ====== Submit ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const userErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirm(confirmPassword);

    setUsernameError(userErr);
    setEmailError(emailErr);
    setPasswordError(passErr);
    setConfirmError(confirmErr);

    if (userErr || emailErr || passErr || confirmErr) return;

    setLoading(true);
    try {
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password: hashedPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");

      alert("✅ Đăng ký thành công! Mời đăng nhập.");
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ====== Show dynamic helpers ======
  const showEmail = touched.email && (focus.email );
  const showPassword = touched.password && (focus.password);
  const showConfirm = touched.confirm && (focus.confirm);

  return (
    <div className="auth-wrapper">
      <img src={`${BASE_URL}/uploads/blob-scene.svg`} alt="background shape" className="background-shape" />
      <div className="auth-card">
        <h1>Tạo tài khoản mới</h1>
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <label>Tên người dùng</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={(e) => {
              setTouched({ ...touched, username: true });
              setUsernameError(validateUsername(e.target.value));
            }}
            required
          />
          {/* {touched.username && usernameError && <span className="input-error">{usernameError}</span>} */}

          {/* EMAIL */}
          <label>Email</label>
          <input
            type="email"
            value={email}
            onFocus={() => setFocus({ ...focus, email: true })}
            onBlur={(e) => {
              setFocus({ ...focus, email: false });
              setTouched({ ...touched, email: true });
              setEmailError(validateEmail(e.target.value));
            }}
            onChange={(e) => {
              const val = e.target.value;
              setEmail(val);
              checkEmailCriteria(val);
            }}
            required
          />
          <div className={`password-strength-wrapper ${showEmail ? "visible" : "hidden"}`}>
            <p><strong>Email check:</strong></p>
            <ul className="criteria-list">
              <li className={emailCriteria.hasAt ? "ok" : "fail"}>{criteria.hasAt ? "✔" : "✖"} Contains "@"</li>
              <li className={emailCriteria.hasDot ? "ok" : "fail"}>{emailCriteria.hasDot ? "✔" : "✖"} Contains a dot after @</li>
              <li className={emailCriteria.noSpace ? "ok" : "fail"}>{emailCriteria.noSpace ? "✔" : "✖"} No spaces</li>
              <li className={emailCriteria.notUsername ? "ok" : "fail"}>{emailCriteria.notUsername ? "✔" : "✖"} Not same as username</li>
            </ul>
          </div>
          {/* {touched.email && emailError && <span className="input-error">{emailError}</span>} */}

          {/* PASSWORD */}
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onFocus={() => setFocus({ ...focus, password: true })}
            onBlur={(e) => {
              setFocus({ ...focus, password: false });
              setTouched({ ...touched, password: true });
              setPasswordError(validatePassword(e.target.value));
            }}
            onChange={(e) => {
              const val = e.target.value;
              setPassword(val);
              checkPasswordStrength(val);
            }}
            required
          />
          <div className={`password-strength-wrapper ${showPassword ? "visible" : "hidden"}`}>
            <p>
              <strong>Password strength:</strong>{" "}
              <span className={`strength-${passwordStrength}`}>{passwordStrength}</span>
            </p>
            <ul className="criteria-list"> 
              <li className={criteria.notEmail ? "ok" : "fail"}> {criteria.notEmail ? "✔" : "✖"} Cannot contain your name or email </li>
              <li className={criteria.length ? "ok" : "fail"}> {criteria.length ? "✔" : "✖"} At least 8 characters </li> 
              <li className={criteria.numberOrSymbol ? "ok" : "fail"}> {criteria.numberOrSymbol ? "✔" : "✖"} Contains a number or symbol </li> 
              <li className={criteria.upperCase ? "ok" : "fail"}> {criteria.upperCase ? "✔" : "✖"} Contains an uppercase letter </li> 
            </ul>
          </div>
          {/* {touched.password && passwordError && <span className="input-error">{passwordError}</span>} */}

          {/* CONFIRM PASSWORD */}
          <label>Nhập lại mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onFocus={() => setFocus({ ...focus, confirm: true })}
            onBlur={(e) => {
              setFocus({ ...focus, confirm: false });
              setTouched({ ...touched, confirm: true });
              setConfirmError(validateConfirm(e.target.value));
            }}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
          />
          <div className={`password-strength-wrapper ${showConfirm ? "visible" : "hidden"}`}>
            <p><strong>Password match:</strong></p>
            <ul className="criteria-list">
              <li className={confirmPassword === password ? "ok" : "fail"}>
                {confirmPassword === password ? "✔ Matched" : "✖ Not matched"}
              </li>
            </ul>
          </div>
          {/* {touched.confirm && confirmError && <span className="input-error">{confirmError}</span>} */}

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="redirect-text">
          Đã có tài khoản? <a onClick={() => router.push(`/login`)}>Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}
