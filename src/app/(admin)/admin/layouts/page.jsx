'use client';
import { useEffect, useState } from 'react';
import { FaThLarge, FaPlusSquare, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Modal from '@/components/common/Modal';
import { authFetch } from "@/lib/auth";
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';
import usePagination from "@/hooks/usePagination";


export default function LayoutsPage() {
  const [layouts, setLayouts] = useState([]);
  const [formData, setFormData] = useState({ title: '', code: '' });
  const [editingLayout, setEditingLayout] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const {
    currentPage,
    totalPages,
    paginatedData: currentItems,
    goNext,
    goPrev,
    goToPage,
  } = usePagination(layouts, 5);

  useEffect(() => { fetchLayouts(); }, []);

  async function fetchLayouts() {
    try {
      const res = await authFetch(`${API_BASE_URL}/gridlayouts`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) return console.warn("Không load được layouts");

      const data = await res.json();
      if (Array.isArray(data)) setLayouts(data);

    } catch (err) {
      console.error("Lỗi fetchLayouts:", err);
    }
  }


  function handleEdit(layout) {
    setEditingLayout(layout);
    setFormData({ title: layout.title, code: layout.code });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa bố cục này?')) return;

    const res = await authFetch(`${API_BASE_URL}/gridlayouts/${id}`, {
      method: 'DELETE',
    });

    if (res?.ok) {
      alert('Đã xóa bố cục');
      fetchLayouts();
    } else {
      alert('Xóa thất bại');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const method = editingLayout ? 'PUT' : 'POST';
    const url = editingLayout
      ? `${API_BASE_URL}/gridlayouts/${editingLayout._id}`
      : `${API_BASE_URL}/gridlayouts`;

    const res = await authFetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    console.log("📤 Form data gửi đi:", formData);

    if (res?.ok) {
      setShowForm(false);
      setEditingLayout(null);
      fetchLayouts();
    } else {
      alert('Lưu thất bại');
    }
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
          <tr className="bg-slate-100 text-left">
            <th className="w-[25%] px-3 py-2">Tên bố cục</th>
            <th className="w-[15%] px-3 py-2">Slug</th>
            <th className="w-[15%] px-3 py-2 text-center">Số card</th>
            <th className="w-[20%] px-3 py-2 text-center">Xem nhanh</th>
            <th className="w-[25%] px-3 py-2 text-center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((l) => (
            <tr key={l._id}>
              <td className="px-3 py-2">{l.title}</td>
              <td className="px-3 py-2">{l.code}</td>
              <td className="px-3 py-2 text-center font-medium">
                {l.config?.positions?.length || 0}
              </td>
              <td className="px-3 py-2 text-center">
                <div
                  className="
                    inline-grid place-items-center mx-auto
                    bg-[var(--color-bg-content)]
                    p-[0.3vw] rounded-md
                    gap-[0.2vw]
                  "
                  style={{
                    gridTemplateColumns: l.config.columns.map(() => "1.2vw").join(" "),
                    gridTemplateRows: `repeat(${l.config.rows}, 1.2vw)`,
                    minWidth: `${l.config.columns.length * 1.2 + (l.config.columns.length - 1) * 0.2 + 0.6}vw`,
                    minHeight: `${l.config.rows * 1.2 + (l.config.rows - 1) * 0.2 + 0.6}vw`,
                  }}
                >
                  {Array.isArray(l.config.positions) &&
                    l.config.positions.map((pos, i) => (
                      <div
                        key={i}
                        className=" relative group bg-blue-600/80 rounded-sm w-full h-full transition hover:opacity-100 hover:shadow-md"
                        style={{
                          gridColumn: `${pos.x + 1} / span ${pos.w}`,
                          gridRow: `${pos.y + 1} / span ${pos.h}`,
                        }}
                      >
                        <div
                          className="
                            absolute -top-[1.6vw] left-1/2 -translate-x-1/2
                            px-[0.4vw] py-[0.2vw]
                            bg-black/75 text-white
                            text-[0.8vw]
                            rounded
                            opacity-0
                            group-hover:opacity-100
                            pointer-events-none
                            whitespace-nowrap
                            transition
                          "
                        >
                          x:{pos.x}, y:{pos.y}, w:{pos.w}, h:{pos.h}
                        </div>
                      </div>

                    ))}
                </div>

              </td>
              <td className="px-3 py-2">

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

        <button
          className="page-btn"
          onClick={goNext}
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

