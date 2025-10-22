'use client';
import { useEffect, useState } from 'react';
import { FaClone, FaPlus, FaEye, FaPlusSquare, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '@/components/admin/Modal';
import Link from 'next/link';
import "./cards.css";
import { API_BASE_URL, BASE_URL } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    contents: [{ type: 'image', url: '', description: '', qrCode: '' }],
  });
  const [editingCard, setEditingCard] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Mỗi trang 5 dòng

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cards.length / itemsPerPage);

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
      // contents:
      //   card.contents && card.contents.length > 0
      //     ? card.contents
      //     : [{ type: 'image', url: '', description: '', qrCode: '' }],
    });
    setShowForm(true);
  }

  // 🗑 Xóa card
  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa thẻ này?')) return;
    const token = getToken();

    try {
      const res = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // ✍️ Thay đổi nội dung trong form
  function handleContentChange(index, field, value) {
    const newContents = [...formData.contents];
    newContents[index][field] = value;
    setFormData({ ...formData, contents: newContents });
  }

  // 🖼 Khi chọn file ảnh / video / pdf / QR code
  function handleFileSelect(e, index, field) {
    const file = e.target.files[0];
    if (!file) return;
    const newContents = [...formData.contents];
    newContents[index][field] = file; // Lưu file object tạm
    setFormData({ ...formData, contents: newContents });
  }

  function handleAddContent() {
    setFormData({
      ...formData,
      contents: [
        ...formData.contents,
        { type: 'image', url: '', description: '', qrCode: '' },
      ],
    });
  }

  function handleRemoveContent(index) {
    const newContents = formData.contents.filter((_, i) => i !== index);
    setFormData({ ...formData, contents: newContents });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = getToken();
    const finalData = JSON.parse(JSON.stringify(formData));

    for (let i = 0; i < formData.contents.length; i++) {
      const c = formData.contents[i];

      if (c.url instanceof File) {
        const fd = new FormData();
        fd.append('file', c.url);
        const res = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: fd,
        });
        const data = await res.json();
        if (data.url) {
          finalData.contents[i].url = data.url;
          finalData.contents[i].type = data.type || c.type;
        }
      }

      if (c.qrCode instanceof File) {
        const fd = new FormData();
        fd.append('file', c.qrCode);
        const res = await fetch(`${API_BASE_URL}/upload`, {
          method: 'POST',
          body: fd,
        });
        const data = await res.json();
        if (data.url) {
          finalData.contents[i].qrCode = data.url;
        }
      }
    }

    const method = editingCard ? 'PUT' : 'POST';
    const url = editingCard
      ? `${API_BASE_URL}/cards/${editingCard._id}`
      : `${API_BASE_URL}/cards`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });

      console.log('❌ Lỗi HTTP:', res.status, res.statusText);

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

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2><FaClone /> Thẻ nội dung</h2>
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
          <FaPlusSquare /> Thêm thẻ
        </button>
      </div>

      {/* Danh sách Cards */}
      <table className="admin-table table-cards">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Số nội dung</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(card => (
            <tr key={card._id}>
              <td>{card.title}</td>
              <td>{card.contents?.length || 0}</td>
              <td>
                <Link href={`/admin/cards/${card._id}`} className="btn-view"><FaEye /> Xem chi tiết</Link>
                <button className="btn-edit" onClick={() => handleEdit(card)}><FaEdit /> Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(card._id)}><FaTrash /> Xóa</button>
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
          title={editingCard ? 'Sửa thẻ nội dung' : 'Thêm thẻ mới'}
          onClose={() => setShowForm(false)}
          width="600px"
        >
          <form onSubmit={handleSubmit}>
            <label>Tiêu đề</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            {/* <h4 style={{ marginTop: '10px', marginBottom: '5px' }}>Danh sách nội dung</h4> */}

            {/* {formData.contents.map((c, i) => (
              <div key={i} className="content-item">
                <div className="content-item-header">
                  <span>Nội dung {i + 1}</span>
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => handleRemoveContent(i)}
                  >
                    🗑
                  </button>
                </div>

                <label>Loại nội dung</label>
                <select
                  value={c.type}
                  onChange={(e) => handleContentChange(i, 'type', e.target.value)}
                >
                  <option value="image">Hình ảnh</option>
                  <option value="video">Video</option>
                  <option value="pdf">Tệp PDF</option>
                </select>

                <label>URL hình ảnh / file</label>
                <div className="upload-row">
                  <input
                    type="text"
                    placeholder={`${BASE_URL}/uploads/...`}
                    value={c.url instanceof File ? c.url.name : c.url}
                    onChange={(e) => handleContentChange(i, 'url', e.target.value)}
                  />
                  <input
                    type="file"
                    accept={
                      c.type === 'video'
                        ? 'video/*'
                        : c.type === 'pdf'
                        ? 'application/pdf'
                        : 'image/*'
                    }
                    onChange={(e) => handleFileSelect(e, i, 'url')}
                  />
                </div>

                <label>Mô tả</label>
                <textarea
                  placeholder="Mô tả ngắn..."
                  value={c.description}
                  onChange={(e) => handleContentChange(i, 'description', e.target.value)}
                />

                <label>QR Code (URL)</label>
                <div className="upload-row">
                  <input
                    type="text"
                    placeholder={`${BASE_URL}/uploads/qrcode.png`}
                    value={c.qrCode instanceof File ? c.qrCode.name : c.qrCode}
                    onChange={(e) => handleContentChange(i, 'qrCode', e.target.value)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, i, 'qrCode')}
                  />
                </div>
              </div>
            ))} */}

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
