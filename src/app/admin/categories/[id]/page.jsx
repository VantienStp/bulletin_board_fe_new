'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaPlusCircle, FaTrashAlt } from 'react-icons/fa';
import './category-detail.css';
import { API_BASE_URL } from '@/lib/api';
import { getToken } from '@/lib/auth';


export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);

  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCards = cards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cards.length / itemsPerPage);

  useEffect(() => {
    if (!id) return;
    fetchCategoryDetail();
    fetchCategoryCards();
    fetchAllCards();
  }, [id]);

  async function fetchCategoryDetail() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`);
      const data = await res.json();
      setCategory(data);
    } catch (err) {
      console.error('❌ Lỗi khi lấy chi tiết category:', err);
    }
  }

  async function fetchCategoryCards() {
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}/cards`);
      const data = await res.json();
      console.log("res: ", res);


      setCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Lỗi khi lấy card theo category:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAllCards() {
    try {
      const res = await fetch(`${API_BASE_URL}/cards`);
      const data = await res.json();
      setAllCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách card:', err);
    }
  }

  async function handleAddCard() {
    if (!selectedCardId) return alert('Vui lòng chọn thẻ để thêm.');
    const token = getToken();

    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}/add-card`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cardId: selectedCardId }),
      });

      if (res.ok) {
        alert('✅ Đã thêm thẻ vào danh mục');
        setSelectedCardId('');
        fetchCategoryCards();
      } else {
        const errData = await res.json();
        console.error(errData);
        alert('❌ Thêm thất bại');
      }
    } catch (err) {
      console.error('❌ Lỗi khi thêm card:', err);
      alert('Lỗi kết nối server');
    }
  }

  async function handleRemoveCard(cardId) {
    if (!confirm('Bạn có chắc muốn gỡ thẻ này khỏi danh mục?')) return;
    const token = getToken();

    try {
      const res = await fetch(
        `${API_BASE_URL}/categories/${id}/remove-card/${cardId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        alert('Đã gỡ thẻ khỏi danh mục');
        fetchCategoryCards();
      } else {
        alert('Gỡ thất bại');
      }
    } catch (err) {
      console.error('❌ Lỗi khi gỡ card:', err);
      alert('Lỗi kết nối server');
    }
  }

  if (isLoading) return <div>⏳ Đang tải dữ liệu...</div>;
  if (!category) return <div>❌ Không tìm thấy danh mục</div>;

  return (
    <div className="admin-page category-detail">
      <div className="page-header">
        <h2>📁 Chi tiết danh mục {category.title}</h2>
        <Link href="/admin/categories" className="btn-secondary">
          <FaArrowLeft /> Quay lại
        </Link>
      </div>

      <div className="category-info">
        <h3>{category.title}</h3>
        <p><b>Mô tả:</b> {category.description || '(Không có mô tả)'}</p>
        <p>
          <b>Grid Layout:</b>{' '}
          {category.gridLayoutId ? (
            <Link
              href={`/admin/layouts/${category.gridLayoutId._id}`}
              className="link-inline"
            >
              {category.gridLayoutId.title || '(Không có tên)'}
            </Link>
          ) : (
            '(Chưa gán layout)'
          )}
        </p>
      </div>

      {/* Thêm card vào danh mục */}
      <div className="add-card-section">
        <h4>Thêm thẻ vào danh mục</h4>
        <div className="add-card-controls">
          <select
            value={selectedCardId}
            onChange={(e) => setSelectedCardId(e.target.value)}
          >
            <option value="">-- Chọn thẻ cần thêm --</option>
            {allCards
              .filter(c => !cards.some(cc => cc._id === c._id))
              .map(c => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
          </select>
          <button onClick={handleAddCard} className="btn-primary">
            <FaPlusCircle /> Thêm
          </button>
        </div>
      </div>

      {/* Danh sách card trong category */}
      <div className="cards-list">
        <h4>📋 Danh sách thẻ trong danh mục</h4>

        {cards.length === 0 ? (
          <p>Danh mục này hiện chưa có thẻ nào.</p>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Số nội dung</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentCards.map((card) => (
                  <tr key={card._id}>
                    <td>{card.title}</td>
                    <td>{card.contents?.length || 0}</td>
                    <td>
                      <Link href={`/admin/cards/${card._id}`} className="btn-view">
                        👁 Xem chi tiết
                      </Link>
                      <button
                        className="btn-delete"
                        onClick={() => handleRemoveCard(card._id)}
                      >
                        <FaTrashAlt /> Gỡ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
