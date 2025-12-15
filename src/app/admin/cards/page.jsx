'use client';
import { useEffect, useState } from 'react';
import { FaClone, FaEye, FaPlusSquare, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '@/components/admin/Modal';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/api';
import { authFetch } from '@/lib/auth';
import usePagination from '@/hooks/usePagination';

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    contents: [{ type: 'image', url: '', description: '', qrCode: '' }],
  });
  const [editingCard, setEditingCard] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // 🧠 Lấy danh sách card khi load trang
  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    try {
      const res = await fetch(`${API_BASE_URL}/cards`);
      const data = await res.json();
      if (Array.isArray(data)) setCards(data);
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách thẻ:', err);
    }
  }

  // 📝 Sửa card
  function handleEdit(card) {
    setEditingCard(card);
    setFormData({
      title: card.title,
      contents: card.contents || [{ type: 'image', url: '', description: '', qrCode: '' }],
    });
    setShowForm(true);
  }

  // 🗑 Xóa card
  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa thẻ này?')) return;

    try {
      const res = await authFetch(`${API_BASE_URL}/cards/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Đã xóa thẻ');
        fetchCards();
      } else {
        alert('Xóa thất bại');
      }
    } catch (err) {
      console.error('❌ Lỗi khi xóa thẻ:', err);
      alert('Lỗi kết nối server');
    }
  }

  // 🧾 Tạo / cập nhật card
  async function handleSubmit(e) {
    e.preventDefault();
    const method = editingCard ? 'PUT' : 'POST';
    const url = editingCard
      ? `${API_BASE_URL}/cards/${editingCard._id}`
      : `${API_BASE_URL}/cards`;

    try {
      const res = await authFetch(url, { method, body: JSON.stringify(formData) });

      if (res.ok) {
        alert(editingCard ? '✅ Đã cập nhật thẻ' : '✅ Đã tạo thẻ mới');
        setShowForm(false);
        setEditingCard(null);
        fetchCards();
      } else {
        const errData = await res.json();
        console.error('Phản hồi lỗi:', errData);
        alert(`❌ Lưu thất bại: ${errData.message || 'Lỗi không xác định'}`);
      }
    } catch (err) {
      console.error('❌ Lỗi khi lưu thẻ:', err);
      alert('Lỗi kết nối server');
    }
  }

  // 📄 Phân trang với hook dùng chung
  const {
    currentPage,
    totalPages,
    paginatedData: currentItems,
    goNext,
    goPrev,
    goToPage,
  } = usePagination(cards, 5); // mỗi trang 5 thẻ

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="show-header">
          <span className="icon"><FaClone /></span>
          <span>Thẻ nội dung</span>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setFormData({
              title: '',
              contents: [{ type: 'image', url: '', description: '', qrCode: '' }],
            });
            setEditingCard(null);
            setShowForm(true);
          }}
        >
          <FaPlusSquare /> Thêm mới
        </button>
      </div>

      {/* Danh sách Cards */}
      <table className="admin-table table-cards">
        <thead>
          <tr className="bg-slate-100">
            <th className="w-[30%] px-3 py-2">Tiêu đề</th>
            <th className="w-[40%] px-3 py-2 text-center">Số nội dung</th>
            <th className="w-[30%] px-3 py-2">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map(card => (
            <tr key={card._id} className="border-b last:border-b-0">
              <td className="px-3 py-2 font-medium">
                {card.title}
              </td>

              <td className="px-3 py-2 text-center">
                {card.contents?.length || 0}
              </td>

              <td className="px-3 py-2 space-x-2">
                <Link href={`/admin/cards/${card._id}`} className="btn-view">
                  <FaEye /> Xem chi tiết
                </Link>

                <button className="btn-edit" onClick={() => handleEdit(card)}>
                  <FaEdit /> Sửa
                </button>

                <button className="btn-delete" onClick={() => handleDelete(card._id)}>
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
          onClick={goPrev}
          disabled={currentPage === 1}
        >
          ◀
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
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
          title={editingCard ? 'Sửa thẻ nội dung' : 'Thêm thẻ mới'}
          onClose={() => setShowForm(false)}
          width="60%"
          height=""
        >
          <form onSubmit={handleSubmit}>
            <label>Tiêu đề</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <div className="modal-actions">
              <button type="submit" className="btn-primary">Lưu</button>
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
