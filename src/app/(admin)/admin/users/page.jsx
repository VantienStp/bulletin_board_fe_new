"use client";

import { useEffect, useState, useRef } from "react";
import { FaUsers } from "react-icons/fa";
import Modal from "@/components/common/Modal";
import { Select, MenuItem } from "@mui/material";
import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";


import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";

export default function UsersPage() {
  const [users, setUsers] = useState([]);


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "editor",
  });

  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("idle");
  const [showForm, setShowForm] = useState(false);

  // ===== Pagination state =====
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef(null);

  // ===== Fetch users =====
  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== Ensure currentPage luôn hợp lệ sau khi data thay đổi =====
  useEffect(() => {
    const totalPages = Math.ceil(users.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    // Nếu xóa hết user → quay về page 1
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [users.length, itemsPerPage, currentPage]);


  async function fetchUsers() {
    const res = await authFetch(`${API_BASE_URL}/users`);
    if (!res?.ok) return;

    const data = await res.json();
    if (Array.isArray(data)) setUsers(data);
  }

  // ===== Pagination slice =====
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  // ===== Handlers =====
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

  async function handleSubmit(e) {
    e.preventDefault();

    const method = editingUser ? "PUT" : "POST";
    const url = editingUser
      ? `${API_BASE_URL}/users/${editingUser._id}`
      : `${API_BASE_URL}/users`;

    const payload = { ...formData };
    if (!payload.password) delete payload.password;

    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res?.ok) {
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } else {
      alert("❌ Lưu thất bại");
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteUserId) return;

    setDeleteStatus("loading");

    try {
      const res = await authFetch(
        `${API_BASE_URL}/users/${deleteUserId}`,
        { method: "DELETE" }
      );

      if (!res?.ok) throw new Error("Delete failed");

      await fetchUsers();
      setDeleteStatus("success");

      // ⏱ đóng modal sau 800ms cho user kịp thấy
      setTimeout(() => {
        setDeleteUserId(null);
        setDeleteStatus("idle");
      }, 800);

    } catch (err) {
      setDeleteStatus("error");
    }
  }

  return (
    <div className="px-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaUsers /> User Management
        </h1>

        <button
          onClick={() => {
            setFormData({
              username: "",
              email: "",
              password: "",
              role: "editor",
            });
            setEditingUser(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-900"
        >
          + Add New User
        </button>
      </div>

      {/* TABLE WRAPPER */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* HEADER ROW */}
        <div
          className="
            grid grid-cols-[2fr_1.2fr_1fr_90px]
            px-6 py-4 font-semibold text-gray-600
            border-b gap-4 text-[14px] text-center
          "
        >
          <div className="pl-5 text-left">User</div>
          <div>Email</div>
          <div>Role</div>
          <div>Actions</div>
        </div>

        {/* ROWS */}
        <div className="divide-y">
          {currentUsers.map((u) => (
            <div
              key={u._id}
              className="
                grid grid-cols-[2fr_1.2fr_1fr_90px]
                px-6 py-3 items-center
                hover:bg-gray-50 transition
                gap-4 text-[13px]
              "
            >
              {/* USER */}
              <div className="flex items-center gap-4">
                <div
                  className="
                    w-12 h-12 rounded-full bg-gray-200
                    flex items-center justify-center
                    font-bold text-gray-600
                  "
                >
                  {u.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{u.username}</p>
                  <p className="text-[12px] text-gray-500">
                    ID: {u._id.slice(-6)}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="text-center text-gray-700">
                {u.email}
              </div>

              {/* ROLE */}
              <div className="text-center">
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium">
                  {u.role}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-1 text-center">
                <button
                  onClick={() => handleEdit(u)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteUserId(u._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION (NEW) */}
      <div ref={paginationRef}>
        <Pagination
          totalItems={users.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            paginationRef.current?.scrollIntoView({
              behavior: "auto",
              block: "start",
            });
          }}
        />
      </div>

      {/* MODAL */}
      {showForm && (
        <Modal
          title={editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit}>
            <label>Tên tài khoản</label>
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />

            <label>Email</label>
            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <label>
              Mật khẩu {editingUser && "(bỏ trống nếu không đổi)"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <label>Quyền</label>
            <Select
              variant="standard"
              disableUnderline
              fullWidth
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="editor">Editor</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
            </Select>

            <div className="modal-actions">
              <button type="submit" className="btn-primary">
                {editingUser ? "Cập nhật" : "Thêm mới"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </Modal>
      )}

      <DeleteModal
        open={!!deleteUserId}
        title="Delete User?"
        message={
          deleteStatus === "loading"
            ? "Đang xóa người dùng..."
            : deleteStatus === "success"
              ? "✅ Xóa người dùng thành công"
              : deleteStatus === "error"
                ? "❌ Xóa thất bại. Vui lòng thử lại."
                : "Bạn có chắc muốn xóa người dùng này không?"
        }
        onCancel={() => {
          if (deleteStatus !== "loading") {
            setDeleteUserId(null);
            setDeleteStatus("idle");
          }
        }}
        onConfirm={handleDeleteConfirmed}
      />

    </div>
  );
}
