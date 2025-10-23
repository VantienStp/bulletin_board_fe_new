'use client';
import { useEffect, useState } from 'react';
import { FaClone, FaEye, FaPlusSquare, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Modal from '@/components/admin/Modal';
import { API_BASE_URL } from '@/lib/api';
import { useParams } from 'next/navigation';
import "./card-detail.css";
import { getToken } from '@/lib/auth';

export default function CardDetailPage() {
  const [card, setCard] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({ type: 'image', url: '', description: '', qrCode: '' });
  const [showForm, setShowForm] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchCard();
  }, [id]);

  async function fetchCard() {
    try {
      const res = await fetch(`${API_BASE_URL}/cards/${id}`);
      const data = await res.json();
      setCard(data);
    } catch (err) {
      console.error('❌ Lỗi khi tải chi tiết thẻ:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = getToken();
    if (!card) return;

    const finalData = JSON.parse(JSON.stringify(formData));

    // 🧠 Nếu người dùng chọn file mới cho url → upload trước
    if (formData.url instanceof File) {
      const fd = new FormData();
      fd.append("file", formData.url);
      const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const uploadData = await uploadRes.json();

      if (uploadRes.ok && uploadData.url) {
        finalData.url = uploadData.url;
        finalData.type = uploadData.type || formData.type;
      } else {
        console.error("❌ Upload URL thất bại:", uploadData);
        finalData.url = "";
      }
    }

    if (formData.qrCode instanceof File) {
      const fd = new FormData();
      fd.append("file", formData.qrCode);
      const uploadRes = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const uploadData = await uploadRes.json();

      if (uploadRes.ok && uploadData.url) {
        finalData.qrCode = uploadData.url;
      } else {
        console.error("❌ Upload QR thất bại:", uploadData);
        finalData.qrCode = "";
      }
    }

    // 🧩 Sau khi có URL rồi, mới gọi API chính
    const method = editingContent !== null ? "PUT" : "POST";
    const url = editingContent !== null
      ? `${API_BASE_URL}/cards/${id}/contents/${editingContent}`
      : `${API_BASE_URL}/cards/${id}/contents`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });

      if (res.ok) {
        alert(editingContent !== null ? "✅ Đã cập nhật nội dung" : "✅ Đã thêm nội dung mới");
        setShowForm(false);
        setEditingContent(null);
        fetchCard();
      } else {
        const msg = await res.text();
        console.error("❌ Server response:", msg);
        alert("❌ Cập nhật thất bại");
      }
    } catch (err) {
      console.error("❌ Lỗi khi lưu:", err);
    }
  }
  
  async function handleDeleteContent(index) {
    if (!confirm('Bạn có chắc muốn xóa nội dung này?')) return;
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE_URL}/cards/${id}/contents/${index}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert('✅ Đã xóa nội dung');
        fetchCard();
      } else {
        alert('❌ Xóa thất bại');
      }
    } catch (err) {
      console.error('❌ Lỗi khi xóa nội dung:', err);
    }
  }

  function handleEditContent(index) {
    const content = card.contents[index];
    setEditingContent(index);
    setFormData({
      type: content.type || 'image',
      url: content.url || '',
      description: content.description || '',
      qrCode: content.qrCode || ''
    });
    setShowForm(true);
  }


  if (!card) return <p>Đang tải...</p>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2><FaClone /> Chi tiết thẻ</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingContent(null);
            setFormData({ type: 'image', url: '', description: '', qrCode: '' });
            setShowForm(true);
          }}
        >
          <FaPlusSquare /> Thêm nội dung
        </button>
      </div>

      <table className="admin-table table-cards-detail">
        <thead>
          <tr>
            <th>Loại</th>
            <th>File / Hình ảnh</th>
            <th>Mô tả</th>
            <th>QR Code</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {card.contents.map((c, i) => (
            <tr key={i}>
              <td>{c.type}</td>
              <td>
                {c.type === 'image' && <img src={`/${c.url}`} alt="" width="100" />}
                {c.type === 'video' && <video src={`/${c.url}`} controls width="150" />}
                {c.type === 'pdf' && <iframe src={`/${c.url}`} width="150" height="100" />}
              </td>
              <td>{c.description || '—'}</td>
              <td>
                {c.qrCode ? <img src={`/${c.qrCode}`} alt="QR" width="80" /> : '—'}
              </td>
              <td>
                <Link href={c.url} target="_blank" className="btn-view" title="Xem chi tiết">
                  <FaEye /> Xem
                </Link>
                <button className="btn-edit" onClick={() => handleEditContent(i)}>
                  <FaEdit /> Sửa
                </button>
                <button className="btn-delete" onClick={() => handleDeleteContent(i)}>
                  <FaTrash /> Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <Modal
          title={editingContent !== null ? 'Sửa nội dung' : 'Thêm nội dung mới'}
          onClose={() => setShowForm(false)}
          width="500px"
        >
          <form onSubmit={handleSubmit}>
            <label>Loại</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>

            <label>URL hình ảnh / file</label>
            <div className="upload-row">
              <input
                type="text"
                placeholder="Nhập đường dẫn hoặc chọn file..."
                value={formData.url instanceof File ? formData.url.name : formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />

              <input
                type="file"
                accept={
                  formData.type === 'video'
                    ? 'video/*'
                    : formData.type === 'pdf'
                    ? 'application/pdf'
                    : 'image/*'
                }
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setFormData({ ...formData, url: file });
                }}
              />
            </div>


            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả..."
            />

            <label>QR Code (URL hoặc chọn ảnh)</label>
            <div className="upload-row">
              <input
                type="text"
                placeholder="Đường dẫn QR hoặc chọn ảnh..."
                value={formData.qrCode instanceof File ? formData.qrCode.name : formData.qrCode}
                onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setFormData({ ...formData, qrCode: file });
                }}
              />
            </div>

            <div className="modal-actions">
              <button
                type="submit"
                className={`btn-primary ${editingContent !== null ? 'btn-warning' : ''}`}
              >
                {editingContent !== null ? 'Cập nhật' : 'Lưu'}
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
