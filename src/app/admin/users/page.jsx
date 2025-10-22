'use client';
import { useEffect, useState } from 'react';
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Modal from '@/components/admin/Modal';
import { API_BASE_URL } from '@/lib/api';
import "./users.css";
import Link from 'next/link';
import { getToken } from '@/lib/auth';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'editor' });
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setUsers(data);
  }

  function handleEdit(user) {
    setEditingUser(user);
    setFormData({ username: user.username, password: '', role: user.role });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      alert('Đã xóa người dùng');
      fetchUsers();
    } else alert('Xóa thất bại');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = getToken();
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser
      ? `${API_BASE_URL}/users/${editingUser._id}`
      : `${API_BASE_URL}/users`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } else alert('Lưu thất bại');
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2><FaUsers /> Người dùng</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setFormData({ username: '', password: '', role: 'editor' });
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
            <th>Quyền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                {/* <Link href={`/admin/tables/${u._id}`} className="btn-view" title="Xem chi tiết">
                  <FaEye /> Xem chi tiết
                </Link> */}
                <button className="btn-edit" onClick={() => handleEdit(u)}><FaEdit /> Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(u._id)}><FaTrash /> Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
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

      {showForm && (
        <Modal
          title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
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

            <label>Mật khẩu {editingUser ? '(để trống nếu không đổi)' : ''}</label>
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
              <option value="viewer">Viewer</option>
            </select>

            <div className="modal-actions">
              <button type="submit" className="btn-primary">Lưu</button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
