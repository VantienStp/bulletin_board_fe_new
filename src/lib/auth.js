// lib/auth.js
import { API_BASE_URL } from "@/lib/api";

export function clearToken() {
  // Xóa các thông tin liên quan đến session nếu có
  localStorage.removeItem("user_status"); 
}

/**
 * Hàm fetch có hỗ trợ tự động làm mới Token (Silent Refresh)
 */
export async function authFetch(url, options = {}) {
  // 1. Thực hiện gọi API lần đầu
  let res = await fetch(url, {
    ...options,
    credentials: "include", // Luôn gửi kèm HttpOnly Cookie (access_token)
  });

  // 2. Nếu Server báo 401 và không phải là đang gọi chính API refresh/logout
  const isAuthRequest = url.includes("/auth/refresh") || url.includes("/auth/logout");
  if (res.status === 401 && !isAuthRequest) {
    console.warn("🔑 Access Token hết hạn, đang thử làm mới...");

    try {
      // 3. Gọi API Refresh để đổi lấy Access Token mới
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Gửi kèm refresh_token cookie
      });

      if (refreshRes.ok) {
        console.log("✅ Làm mới Token thành công. Đang thử lại yêu cầu...");
        
        // 4. Nếu Refresh thành công, gọi lại API ban đầu lần nữa
        // Lúc này Cookie access_token mới đã được Server ghi đè vào trình duyệt rồi
        res = await fetch(url, {
          ...options,
          credentials: "include",
        });
      } else {
        // Nếu ngay cả Refresh Token cũng hết hạn (7 ngày) -> Hết cứu, phải Login lại
        console.error("❌ Refresh Token cũng đã hết hạn.");
        await logout();
        return null;
      }
    } catch (err) {
      console.error("🔥 Lỗi trong quá trình Refresh:", err);
      await logout();
      return null;
    }
  }

  return res;
}

export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.warn("⚠️ Lỗi logout:", err);
  } finally {
    clearToken();
    // Tránh dùng window.location.href nếu đang ở trang Kiosk (không cần đăng nhập)
    // Nhưng nếu em đang ở trong Admin thì dùng được:
    if (window.location.pathname.startsWith('/admin')) {
        window.location.href = "/login";
    }
  }
}