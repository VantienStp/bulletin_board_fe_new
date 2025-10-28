"use client";
import { useEffect, useState } from "react";
import { FaUsers, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import Modal from "@/components/admin/Modal";
import { API_BASE_URL } from "@/lib/api";
import "./users.css";
import { getToken } from "@/lib/auth";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // ===== Pagination =====
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  // ===== Fetch users =====
  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
      else console.error("Invalid user data:", data);
    } catch (err) {
      console.error("Lỗi fetchUsers:", err);
    }
  }

  // ===== Edit =====
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
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("✅ Đã xóa người dùng");
        fetchUsers();
      } else {
        const data = await res.json();
        alert(`❌ Xóa thất bại: ${data.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Lỗi xóa user:", err);
      alert("❌ Không thể kết nối đến server");
    }
  }

  // ===== Create / Update =====
  async function handleSubmit(e) {
    e.preventDefault();
    const token = getToken();

    const method = editingUser ? "PUT" : "POST";
    const url = editingUser
      ? `${API_BASE_URL}/users/${editingUser._id}`
      : `${API_BASE_URL}/auth/register`; // ✅ tạo mới dùng endpoint đăng ký

    const payload = { ...formData };
    if (!payload.password) delete payload.password; // bỏ qua nếu không đổi mật khẩu

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${editingUser ? "Cập nhật" : "Thêm"} người dùng thành công`);
        setShowForm(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        alert(`❌ Thao tác thất bại: ${data.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Lỗi handleSubmit:", err);
      alert("❌ Không thể kết nối tới server");
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2><FaUsers /> Người dùng</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setFormData({ username: "", email: "", password: "", role: "editor" });
            setEditingUser(null);
            setShowForm(true);
          }}
        >
          <FaUserPlus /> Thêm người dùng
        </button>
      </div>

      <table className="admin-table table-users">
        <thead>
          <tr>
            <th>Tài khoản</th>
            <th>Email</th>
            <th>Quyền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(u)}>
                  <FaEdit /> Sửa
                </button>
                <button className="btn-delete" onClick={() => handleDelete(u._id)}>
                  <FaTrash /> Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="page-btn"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
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
            <label>Tên tài khoản</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <label>Mật khẩu {editingUser ? "(để trống nếu không đổi)" : ""}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <label>Quyền</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>

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
