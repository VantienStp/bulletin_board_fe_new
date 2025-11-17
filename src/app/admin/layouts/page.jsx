'use client';
import { useEffect, useState } from 'react';
import { FaThLarge, FaPlusSquare, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Modal from '@/components/admin/Modal';
import "./layouts.css";
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';
import { getToken } from '@/lib/auth';


export default function LayoutsPage() {
  const [layouts, setLayouts] = useState([]);
  const [formData, setFormData] = useState({ title: '', code: '' });
  const [editingLayout, setEditingLayout] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = layouts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(layouts.length / itemsPerPage);

  useEffect(() => { fetchLayouts(); }, []);

  async function fetchLayouts() {
    const res = await fetch(`${API_BASE_URL}/gridlayouts`);
    const data = await res.json();
    if (Array.isArray(data)) setLayouts(data);
  }

  function handleEdit(layout) {
    setEditingLayout(layout);
    setFormData({ title: layout.title, code: layout.code });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa bố cục này?')) return;
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/gridlayouts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      alert('Đã xóa bố cục');
      fetchLayouts();
    } else alert('Xóa thất bại');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = getToken();
    const method = editingLayout ? 'PUT' : 'POST';
    const url = editingLayout
      ? `${API_BASE_URL}/gridlayouts/${editingLayout._id}`
      : `${API_BASE_URL}/gridlayouts`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    });
    console.log("📤 Form data gửi đi:", formData);

    if (res.ok) {
      setShowForm(false);
      setEditingLayout(null);
      fetchLayouts();
    } else alert('Lưu thất bại');
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="show-header">
          <span className="icon"><FaThLarge /></span>
          <span>Bố cục hiển thị</span>
        </div>
        <button className="btn-primary" onClick={() => {
          setFormData({ title: '', code: '' });
          setEditingLayout(null);
          setShowForm(true);
        }}>
          <FaPlusSquare /> Thêm mới
        </button>
      </div>

      <table className="admin-table table-layouts">
        <thead>
          <tr>
            <th>Tên bố cục</th>
            <th>Slug</th>
            <th>Số card hiển thị</th>
            <th>Xem nhanh</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((l) => (
            <tr key={l._id}>
              <td>{l.title}</td>
              <td>{l.code}</td>
              <td>{l.config?.positions?.length || 0}</td>
              <td>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: l.config.columns.map(() => "1.2vw").join(" "), // mỗi ô ~1.2vw
                    gridTemplateRows: `repeat(${l.config.rows}, 1.2vw)`,
                    gap: "0.2vw",
                    background: "var(--color-bg-content)",
                    padding: "0.3vw",
                    borderRadius: "0.4vw",
                    width: "fit-content",
                    margin: "0 auto",
                    maxWidth: "15vw",   // tránh to quá trên màn hình rộng
                    minWidth: `${l.config.columns.length * 1.2 + (l.config.columns.length - 1) * 0.2 + 0.6}vw`,
                    minHeight: `${l.config.rows * 1.2 + (l.config.rows - 1) * 0.2 + 0.6}vw`,
                    boxSizing: "border-box",
                  }}
                >
                  {Array.isArray(l.config.positions) &&
                    l.config.positions.map((pos, i) => (
                      <div
                        key={i}
                        style={{
                          gridColumn: `${pos.x + 1} / span ${pos.w}`,
                          gridRow: `${pos.y + 1} / span ${pos.h}`,
                          position: "relative",
                          background: "#2563eb",
                          borderRadius: "0.2vw",
                          width: "100%",
                          height: "100%",
                          opacity: 0.8,
                        }}
                        onMouseEnter={(e) => {
                          const tooltip = document.createElement("div");
                          tooltip.innerText = `x:${pos.x}, y:${pos.y}, w:${pos.w}, h:${pos.h}`;
                          tooltip.style.position = "absolute";
                          tooltip.style.top = "-1.6vw";
                          tooltip.style.left = "50%";
                          tooltip.style.transform = "translateX(-50%)";
                          tooltip.style.padding = "0.2vw 0.4vw";
                          tooltip.style.background = "rgba(0,0,0,0.75)";
                          tooltip.style.color = "#fff";
                          tooltip.style.fontSize = "1vw";
                          tooltip.style.borderRadius = "0.2vw";
                          tooltip.style.pointerEvents = "none";
                          tooltip.style.whiteSpace = "nowrap";
                          tooltip.classList.add("tooltip");
                          tooltip.style.zIndex = "1000";
                          e.currentTarget.appendChild(tooltip);
                          e.currentTarget.style.opacity = 1;
                          e.currentTarget.style.boxShadow = "0 0 0.4vw rgba(0,0,0,0.5)";
                        }}
                        onMouseLeave={(e) => {
                          const tooltip = e.currentTarget.querySelector(".tooltip");
                          if (tooltip) tooltip.remove();
                          e.currentTarget.style.opacity = 0.8;
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    ))}
                </div>

              </td>
              <td>
                {/* <Link href={`/admin/layouts/${l._id}`} className="btn-view" title="Xem chi tiết">
                  <FaEye /> Xem chi tiết
                </Link> */}
                {/* <button className="btn-edit" onClick={() => handleEdit(l)}><FaEdit /> Sửa</button> */}

                <Link href={`/admin/layouts/${l._id}`} className="btn-view" title="Xem chi tiết">
                  <FaEdit /> Sửa
                </Link>

                <button className="btn-delete" onClick={() => handleDelete(l._id)}><FaTrash /> Xóa</button>
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
          title={editingLayout ? 'Sửa bố cục' : 'Thêm bố cục mới'}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit}>
            <label>Tên bố cục</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <label>Mã code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />

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
