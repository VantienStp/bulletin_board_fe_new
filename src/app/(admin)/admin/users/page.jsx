"use client";
import { useEffect, useState } from "react";
import { FaUsers, FaPlusSquare, FaEdit, FaTrash } from "react-icons/fa";
import Modal from "@/components/admin/Modal";
import { Select, MenuItem } from "@mui/material";

import { API_BASE_URL } from "@/lib/api";
// import "./users.css";
import { authFetch } from "@/lib/auth";
import usePagination from "@/hooks/usePagination";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "editor",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ===== Fetch users =====
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await authFetch(`${API_BASE_URL}/users`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        console.warn("Không thể tải users:", res.status);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error("Lỗi fetchUsers:", err);
    }
  }

  function handleEdit(user) {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email || "",
      password: "",
      role: user.role || "editor",
    });
    setShowForm(true);
  }

  // ===== Delete =====
  async function handleDelete(id) {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    try {
      const res = await authFetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("✅ Đã xóa người dùng");
        fetchUsers();
      } else {
        const data = await res.json();
        alert(`❌ Xóa thất bại: ${data.message}`);
      }
    } catch (err) {
      console.error("Lỗi xóa user:", err);
      alert("❌ Không thể kết nối đến server");
    }
  }

  // ===== Create / Update =====
  async function handleSubmit(e) {
    e.preventDefault();

    const method = editingUser ? "PUT" : "POST";
    const url = editingUser
      ? `${API_BASE_URL}/users/${editingUser._id}`
      : `${API_BASE_URL}/users`; // đúng endpoint cho admin tạo user

    const payload = { ...formData };
    if (!payload.password) delete payload.password;

    try {
      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ ${editingUser ? "Cập nhật" : "Thêm"} người dùng thành công`);
        setShowForm(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        alert(`❌ Thao tác thất bại: ${data.message}`);
      }
    } catch (err) {
      console.error("Lỗi handleSubmit:", err);
      alert("❌ Không thể kết nối tới server");
    }
  }

  // ===== Pagination =====
  const {
    currentPage,
    totalPages,
    paginatedData: currentUsers,
    goNext,
    goPrev,
    goToPage,
  } = usePagination(users, 5);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="show-header">
          <span className="icon"><FaUsers /></span>
          <span>Người dùng</span>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            setFormData({ username: "", email: "", password: "", role: "editor" });
            setEditingUser(null);
            setShowForm(true);
          }}
        >
          <FaPlusSquare /> Thêm người dùng
        </button>
      </div>

      <table className="w-full border-collapse text-left admin-table">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="w-[25%] py-3 px-4 font-semibold text-gray-700">Tài khoản</th>
            <th className="w-[25%] py-3 px-4 font-semibold text-gray-700">Email</th>
            <th className="w-[20%] py-3 px-4 font-semibold text-gray-700">Quyền</th>
            <th className="w-[30%] py-3 px-4 font-semibold text-gray-700">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.map((u) => (
            <tr key={u._id} className="border-b hover:bg-gray-50">
              <td className="w-[25%] py-3 px-4">{u.username}</td>
              <td className="w-[25%] py-3 px-4">{u.email}</td>
              <td className="w-[20%] py-3 px-4">{u.role}</td>

              <td className="w-[30%] py-3 px-4">
                <button
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mr-4 btn-edit"
                  onClick={() => handleEdit(u)}
                >
                  <FaEdit /> Sửa
                </button>

                <button
                  className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 btn-delete"
                  onClick={() => handleDelete(u._id)}
                >
                  <FaTrash /> Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Pagination */}
      <div className="pagination">
        <button className="page-btn" onClick={goPrev} disabled={currentPage === 1}>
          ◀
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button className="page-btn" onClick={goNext} disabled={currentPage === totalPages}>
          ▶
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <Modal
          title={editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit}>
            <div>
              <label>Tên tài khoản</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Mật khẩu {editingUser ? "(bỏ trống nếu không đổi)" : ""}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label>Quyền</label>
              <Select
                variant="standard"
                disableUnderline
                value={formData.role}
                style={{
                  border: "0.2vw solid #ccc",
                  padding: "0.5vw",
                  borderRadius: "0.5vw",
                  width: "100%",
                }}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="viewer">Viewer</MenuItem>
              </Select>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn-primary">
                {editingUser ? "Cập nhật" : "Thêm mới"}
              </button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                Hủy
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
