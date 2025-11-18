'use client';
import { useEffect, useState } from 'react';
import { FaFolderOpen, FaEye, FaPlusSquare, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '@/components/admin/Modal';
import Link from 'next/link';
import "./categories.css";
import { API_BASE_URL } from '@/lib/api';
import { getToken, authFetch } from '@/lib/auth';
import usePagination from '@/hooks/usePagination';
import { Select, MenuItem } from "@mui/material";


export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', gridLayoutId: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [layouts, setLayouts] = useState([]);

  // ⭐ Paginate using custom hook
  const {
    currentPage,
    totalPages,
    paginatedData: currentItems,
    goNext,
    goPrev,
    goToPage,
  } = usePagination(categories || [], 5);

  useEffect(() => {
    fetchCategories();
    fetchLayouts();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách danh mục:', err);
    }
  }

  async function fetchLayouts() {
    try {
      const res = await fetch(`${API_BASE_URL}/gridlayouts`);
      const data = await res.json();
      if (Array.isArray(data)) setLayouts(data);
    } catch (err) {
      console.error('❌ Lỗi khi tải layout:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory
      ? `${API_BASE_URL}/categories/${editingCategory._id}`
      : `${API_BASE_URL}/categories`;

    try {
      const res = await authFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingCategory ? "✅ Đã cập nhật danh mục" : "✅ Đã tạo danh mục mới");
        setShowForm(false);
        setEditingCategory(null);
        fetchCategories();
      } else {
        const err = await res.json();
        console.error("❌ Phản hồi lỗi:", err);
        alert(err.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("❌ Lỗi khi lưu danh mục:", err);
      alert("Lỗi kết nối server");
    }
  }

  function handleEdit(category) {
    setEditingCategory(category);
    setFormData({
      title: category.title,
      description: category.description || '',
      gridLayoutId: category.gridLayoutId || '',
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    try {
      const res = await authFetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Đã xóa danh mục');
        fetchCategories();
      } else {
        alert('Xóa thất bại');
      }
    } catch (err) {
      console.error('❌ Lỗi khi xóa:', err);
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="show-header">
          <span className="icon"><FaFolderOpen /></span>
          <span>Danh mục</span>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingCategory(null);
            setFormData({ title: '', description: '', gridLayoutId: '' });
            setShowForm(true);
          }}
        >
          <FaPlusSquare /> Thêm mới
        </button>
      </div>

      <table className="admin-table table-categories">
        <thead>
          <tr>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Grid Layout</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.title}</td>
              <td>{cat.description || '—'}</td>
              <td>
                {typeof cat.gridLayoutId === 'object'
                  ? (cat.gridLayoutId.title || cat.gridLayoutId._id)
                  : (cat.gridLayoutId || '—')}
              </td>
              <td>
                <Link href={`/admin/categories/${cat._id}`} className="btn-view">
                  <FaEye /> Xem chi tiết
                </Link>
                <button className="btn-edit" onClick={() => handleEdit(cat)}>
                  <FaEdit /> Sửa
                </button>
                <button className="btn-delete" onClick={() => handleDelete(cat._id)}>
                  <FaTrash /> Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ⭐ Pagination UI */}
      <div className="pagination">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
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

        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          ▶
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <Modal
          title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
          onClose={() => setShowForm(false)}
          width="500px"
        >
          <form onSubmit={handleSubmit}>
            <label>Tên danh mục</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả ngắn..."
            />

            <label>Grid Layout</label>
            <Select
              variant="outlined"
              disableUnderline
              value={formData.gridLayoutId}
              onChange={(e) =>
                setFormData({ ...formData, gridLayoutId: e.target.value })
              }
              style={{ width: "100%" }}
            >
              <MenuItem value="">
                -- Chọn layout --
              </MenuItem>

              {layouts.map((layout) => (
                <MenuItem key={layout._id} value={layout._id}>
                  {layout.name || layout.title}
                </MenuItem>
              ))}
            </Select>


            <div className="modal-actions">
              <button type="submit" className="btn-primary">Lưu</button>
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
    </div>
  );
}
