import { authFetch } from "@/lib/auth";

export const fetcher = async (url) => {
  const res = await authFetch(url);
  
  // Nếu authFetch trả về null (do logout hoặc lỗi refresh)
  if (!res) return null;
  
  return res.json();
};