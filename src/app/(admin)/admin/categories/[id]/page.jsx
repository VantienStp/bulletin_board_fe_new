'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import {
  FaArrowLeft,
  FaTrashAlt,
  FaFolderOpen,
  FaPlusSquare,
} from 'react-icons/fa';

import Modal from '@/components/admin/Modal';

import { API_BASE_URL } from '@/lib/api';
import { authFetch } from "@/lib/auth";

// 👉 Select & MenuItem
import { Select, MenuItem } from "@mui/material";

// 👉 Pagination hook
import usePagination from "@/hooks/usePagination";

export default function CategoryDetailPage() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 👉 Pagination 4 item/page
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedCards,
    goPrev,
    goNext,
    goToPage
  } = usePagination(cards, 4);

  // Modal state
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchCategoryDetail();
    fetchCategoryCards();
    fetchAllCards();
  }, [id]);

  async function fetchCategoryDetail() {
    try {
      const res = await authFetch(`${API_BASE_URL}/categories/${id}`);
      const data = await res.json();
      setCategory(data);
    } catch (err) {
      console.error("❌ Lỗi khi lấy chi tiết category:", err);
    }
  }

  async function fetchCategoryCards() {
    try {
      const res = await authFetch(`${API_BASE_URL}/categories/${id}/cards`);
      const data = await res.json();
      setCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy card theo category:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAllCards() {
    try {
      const res = await authFetch(`${API_BASE_URL}/cards`);
      const data = await res.json();
      setAllCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách card:", err);
    }
  }

  async function handleAddCard(cardId) {
    try {
      const res = await authFetch(`${API_BASE_URL}/categories/${id}/add-card`, {
        method: "POST",
        body: JSON.stringify({ cardId }),
      });

      if (res.ok) {
        alert("✅ Đã thêm thẻ vào danh mục");
        setShowCardModal(false);
        setSelectedCardId("");
        fetchCategoryCards();
      } else {
        alert("❌ Thêm thất bại");
      }
    } catch (err) {
      console.error("❌ Lỗi khi thêm card:", err);
    }
  }

  async function handleRemoveCard(cardId) {
    if (!confirm("Bạn có chắc muốn gỡ thẻ này khỏi danh mục?")) return;

    try {
      const res = await authFetch(`${API_BASE_URL}/categories/${id}/remove-card/${cardId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Đã gỡ thẻ khỏi danh mục");
        fetchCategoryCards();
      } else {
        alert("Gỡ thất bại");
      }
    } catch (err) {
      console.error("❌ Lỗi khi gỡ card:", err);
    }
  }

  if (isLoading) return <div>⏳ Đang tải dữ liệu...</div>;
  if (!category) return <div>❌ Không tìm thấy danh mục</div>;

  return (
    <div className="admin-page bg-slate-50 p-6 min-h-[80vh] rounded-xl">


      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[1.6rem] font-bold text-slate-800 flex items-center gap-2">
          <FaFolderOpen />
          Chi tiết danh mục {category.title}
        </h2>

        <Link href="/admin/categories" className="btn-secondary">
          <FaArrowLeft /> Quay lại
        </Link>
      </div>

      {/* LIST CARDS */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold text-slate-700">
            📋 Danh sách thẻ trong danh mục
          </div>

          <button className="btn-primary" onClick={() => setShowCardModal(true)}>
            <FaPlusSquare /> Thêm mới
          </button>
        </div>

        {cards.length === 0 ? (
          <p>Danh mục này hiện chưa có thẻ nào.</p>
        ) : (
          <>
            {/* TABLE */}
            <table className="admin-table w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-3 py-2 w-[40%]">Tiêu đề</th>
                  <th className="px-3 py-2 w-[20%] text-center">Số nội dung</th>
                  <th className="px-3 py-2 w-[40%]">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {paginatedCards.map(card => (
                  <tr key={card._id} className="border-b last:border-b-0">
                    <td className="px-3 py-2 font-medium">{card.title}</td>
                    <td className="px-3 py-2 text-center">{card.contents?.length || 0}</td>
                    <td className="px-3 py-2 space-x-2">
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
              <button className="page-btn" onClick={goPrev} disabled={currentPage === 1}>◀</button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button className="page-btn" onClick={goNext} disabled={currentPage === totalPages}>▶</button>
            </div>
          </>
        )}
      </div>

      {showCardModal && (
        <Modal
          title="Thêm thẻ vào danh mục"
          onClose={() => setShowCardModal(false)}
          width="500px"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedCardId) return alert("Vui lòng chọn thẻ");
              handleAddCard(selectedCardId);
            }}
          >
            <div className="modal-fixbug">
              <label>Chọn thẻ</label>

              <Select
                variant="standard"
                disableUnderline
                value={selectedCardId}
                onChange={(e) => setSelectedCardId(e.target.value)}
                style={{ width: "100%" }}
              >
                {allCards
                  .filter(c => !cards.some(cc => cc._id === c._id))
                  .map(c => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.title} — ({c.contents?.length || 0} nội dung)
                    </MenuItem>
                  ))
                }

                {allCards.filter(c => !cards.some(cc => cc._id === c._id)).length === 0 && (
                  <MenuItem disabled>Không còn thẻ nào để thêm</MenuItem>
                )}
              </Select>
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn-view">
                Lưu
              </button>

              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowCardModal(false)}
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
