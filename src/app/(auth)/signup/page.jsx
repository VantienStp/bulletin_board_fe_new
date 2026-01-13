"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import CryptoJS from "crypto-js";
import { User, Mail, Lock, CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";

export default function SignUpPage() {
    const router = useRouter();

    // --- STATE & INPUTS (Giữ nguyên logic cũ) ---
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState(null);
    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const [focus, setFocus] = useState({ email: false, password: false, confirm: false });
    const [touched, setTouched] = useState({ username: false, email: false, password: false, confirm: false });

    const [emailCriteria, setEmailCriteria] = useState({ hasAt: false, hasDot: false, noSpace: true, notUsername: true });
    const [passwordStrength, setPasswordStrength] = useState("weak");
    const [criteria, setCriteria] = useState({ length: false, numberOrSymbol: false, upperCase: false, notEmail: true });
    const [loading, setLoading] = useState(false);

    // --- VALIDATION LOGIC (Giữ nguyên logic cũ) ---
    const validateUsername = (val) => {
        if (!val.trim()) return "Tên người dùng không được để trống.";
        if (val.length < 3) return "Tên phải có ít nhất 3 ký tự.";
        if (!/^[a-zA-Z0-9_]+$/.test(val)) return "Tên chỉ được chứa chữ, số hoặc gạch dưới.";
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
        if (val.length < 8) return "Mật khẩu quá ngắn.";
        if (!/[A-Z]/.test(val)) return "Thiếu chữ hoa.";
        if (!/[0-9]/.test(val)) return "Thiếu chữ số.";
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(val)) return "Thiếu ký tự đặc biệt.";
        return "";
    };

    const validateConfirm = (val) => {
        if (val !== password) return "Mật khẩu không khớp.";
        return "";
    };

    const checkEmailCriteria = (val) => {
        setEmailCriteria({ hasAt: val.includes("@"), hasDot: val.includes("."), noSpace: !val.includes(" ") });
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

    // --- SUBMIT HANDLER ---
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

    const CriteriaItem = ({ valid, text }) => (
        <li className={`flex items-center gap-2 text-xs transition-colors duration-200 ${valid ? "text-green-600 font-medium" : "text-gray-400"}`}>
            {valid ? <CheckCircle size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
            {text}
        </li>
    );

    const showEmail = touched.email && focus.email;
    const showPassword = touched.password && focus.password;
    const showConfirm = touched.confirm && focus.confirm;

    return (
        <div className="auth-wrapper  min-h-[40vh] max-h-[vh] flex items-center justify-center relative overflow-hidden font-sans p-4">
            <img
                src={'/law_bg.png'}
                alt="background shape"
                className="background-shape"
            />

            <div className="relative z-10 w-[550px] bg-white px-6 py-6 rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm">

                <div className="text-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Tạo tài khoản</h1>
                    <p className="text-gray-500 text-xs mt-1 font-medium">Đăng ký để truy cập hệ thống quản trị</p>
                </div>

                {error && (
                    <div className="mb-4 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-xs animate-pulse">
                        <XCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-1.5">

                    {/* Username */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 ml-1">Tên người dùng</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2E7D32] transition-colors" size={16} />
                            <input
                                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-gray-50/50 focus:bg-white outline-none transition-all duration-200 text-gray-800 placeholder-gray-400
                                ${touched.username && usernameError
                                        ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                                        : 'border-gray-200 hover:border-gray-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-green-50'}`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={(e) => {
                                    setTouched({ ...touched, username: true });
                                    setUsernameError(validateUsername(e.target.value));
                                }}
                                placeholder="Nhập tên tài khoản"
                                required
                            />
                        </div>
                        {touched.username && usernameError && <p className="text-red-500 text-[10px] ml-1 mt-1 font-medium">{usernameError}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2E7D32] transition-colors" size={16} />
                            <input
                                type="email"
                                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm bg-gray-50/50 focus:bg-white outline-none transition-all duration-200 text-gray-800 placeholder-gray-400
                                ${touched.email && emailError ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-green-50'}`}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    checkEmailCriteria(e.target.value);
                                }}
                                onFocus={() => setFocus({ ...focus, email: true })}
                                onBlur={(e) => {
                                    setFocus({ ...focus, email: false });
                                    setTouched({ ...touched, email: true });
                                    setEmailError(validateEmail(e.target.value));
                                }}
                                placeholder="example@gmail.com"
                                required
                            />
                        </div>
                        {/* Email Criteria nhỏ gọn hơn */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showEmail ? "max-h-20 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                            <ul className="grid grid-cols-2 gap-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <CriteriaItem valid={emailCriteria.hasAt} text="Có @" />
                                <CriteriaItem valid={emailCriteria.hasDot} text="Có dấu chấm" />
                                <CriteriaItem valid={emailCriteria.noSpace} text="Không khoảng trắng" />
                            </ul>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 ml-1">Mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2E7D32] transition-colors" size={16} />
                            <input
                                type="password"
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#2E7D32] focus:ring-2 focus:ring-green-50 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    checkPasswordStrength(e.target.value);
                                }}
                                onFocus={() => setFocus({ ...focus, password: true })}
                                onBlur={(e) => {
                                    setFocus({ ...focus, password: false });
                                    setTouched({ ...touched, password: true });
                                    setPasswordError(validatePassword(e.target.value));
                                }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {/* Password Strength nhỏ gọn */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showPassword ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                            <div className="flex gap-1 h-1 mb-1.5 mt-1 px-1">
                                <div className={`flex-1 rounded-full transition-colors ${passwordStrength !== "" ? (passwordStrength === "weak" ? "bg-red-400" : passwordStrength === "medium" ? "bg-yellow-400" : "bg-green-500") : "bg-gray-200"}`}></div>
                                <div className={`flex-1 rounded-full transition-colors ${passwordStrength === "medium" || passwordStrength === "strong" ? (passwordStrength === "medium" ? "bg-yellow-400" : "bg-green-500") : "bg-gray-200"}`}></div>
                                <div className={`flex-1 rounded-full transition-colors ${passwordStrength === "strong" ? "bg-green-500" : "bg-gray-200"}`}></div>
                            </div>
                            <ul className="grid grid-cols-1 gap-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <CriteriaItem valid={criteria.length} text="Ít nhất 8 ký tự" />
                                <CriteriaItem valid={criteria.numberOrSymbol} text="Số hoặc ký tự đặc biệt" />
                                <CriteriaItem valid={criteria.upperCase} text="Chữ in hoa" />
                            </ul>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 ml-1">Nhập lại mật khẩu</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2E7D32] transition-colors" size={16} />
                            <input
                                type="password"
                                className={`w-full pl-9 pr-3 py-1 rounded-lg border text-sm bg-gray-50/50 focus:bg-white outline-none transition-all duration-200 text-gray-800 placeholder-gray-400
                                ${confirmPassword && confirmPassword !== password ? 'border-red-300 focus:ring-2 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-green-50'}`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onFocus={() => setFocus({ ...focus, confirm: true })}
                                onBlur={(e) => {
                                    setFocus({ ...focus, confirm: false });
                                    setTouched({ ...touched, confirm: true });
                                    setConfirmError(validateConfirm(e.target.value));
                                }}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {showConfirm && (
                            <div className={`text-[10px] mt-1 ml-1 transition-all duration-300 flex items-center gap-1 font-medium ${confirmPassword === password ? "text-green-600" : "text-red-500"}`}>
                                {confirmPassword === password ? <><CheckCircle size={12} /> Khớp</> : <><XCircle size={12} /> Không khớp</>}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] hover:from-[#388E3C] hover:to-[#2E7D32] text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <span>Đăng ký ngay</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className=" border-t border-gray-100 text-center">
                    <p className=" text-gray-600 font-medium">
                        Bạn đã có tài khoản?{" "}
                        <button
                            onClick={() => router.push(`/login`)}
                            className="font-bold hover:underline transition-colors ml-1 py-2.5 bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] hover:from-[#388E3C] hover:to-[#2E7D32]"
                        >
                            Đăng nhập
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}