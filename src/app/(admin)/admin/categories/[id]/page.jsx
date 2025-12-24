'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import {
  FaArrowLeft,
  FaTrashAlt,
  FaFolderOpen,
  FaPlusSquare,
} from 'react-icons/fa';

import Modal from '@/components/common/Modal';
import Pagination from '@/components/common/Pagination';

import { API_BASE_URL } from '@/lib/api';
import { authFetch } from "@/lib/auth";
import { Select, MenuItem } from "@mui/material";

export default function CategoryDetailPage() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");

  /* ===== Pagination (GIỐNG CardsPage) ===== */
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef(null);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCards = cards.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    if (!id) return;
    fetchCategoryDetail();
    fetchCategoryCards();
    fetchAllCards();
  }, [id]);

  useEffect(() => {
    const totalPages = Math.ceil(cards.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [cards.length, itemsPerPage, currentPage]);




  async function fetchCategoryDetail() {
    const res = await authFetch(`${API_BASE_URL}/categories/${id}`);
    const data = await res.json();
    setCategory(data);
  }

  async function fetchCategoryCards() {
    try {
      const res = await authFetch(`${API_BASE_URL}/categories/${id}/cards`);
      const data = await res.json();
      setCards(Array.isArray(data) ? data : []);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchAllCards() {
    const res = await authFetch(`${API_BASE_URL}/cards`);
    const data = await res.json();
    setAllCards(Array.isArray(data) ? data : []);
  }

  async function handleAddCard(cardId) {
    const res = await authFetch(
      `${API_BASE_URL}/categories/${id}/add-card`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId }),
      }
    );

    if (res.ok) {
      setShowCardModal(false);
      setSelectedCardId("");
      fetchCategoryCards();
    } else {
      alert("❌ Thêm thất bại");
    }
  }


  async function handleRemoveCard(cardId) {
    if (!confirm("Bạn có chắc muốn gỡ thẻ này khỏi danh mục?")) return;

    const res = await authFetch(
      `${API_BASE_URL}/categories/${id}/remove-card/${cardId}`,
      { method: "DELETE" }
    );

    if (res.ok) fetchCategoryCards();
  }

  if (isLoading) return <div>⏳ Đang tải...</div>;
  if (!category) return <div>❌ Không tìm thấy danh mục</div>;

  return (
    <div className="px-4">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaFolderOpen />
          Danh mục: {category.title}
        </h1>

        <Link
          href="/admin/categories"
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 flex items-center gap-2"
        >
          <FaArrowLeft /> Quay lại
        </Link>
      </div>

      {/* ===== LIST WRAPPER ===== */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* LIST HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="font-semibold text-gray-700">
            Danh sách thẻ trong danh mục
          </div>

          <button
            className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-900 flex items-center gap-2"
            onClick={() => setShowCardModal(true)}
          >
            <FaPlusSquare /> Thêm thẻ
          </button>
        </div>

        {/* TABLE HEADER */}
        <div className="
            grid grid-cols-[1fr_160px_260px]
            px-6 py-3 font-semibold text-gray-600
            border-b text-sm
          ">
          <div>Tiêu đề</div>
          <div className="text-center">Số nội dung</div>
          <div className="text-center">Actions</div>
        </div>

        {/* ROWS */}
        <div className="divide-y">
          {paginatedCards.length === 0 && (
            <div className="px-6 py-6 text-gray-500">
              Danh mục này chưa có thẻ nào
            </div>
          )}

          {paginatedCards.map((card) => (
            <div
              key={card._id}
              className="
                  grid grid-cols-[1fr_160px_260px]
                  px-6 py-2 items-center
                  hover:bg-gray-50 transition
                  text-sm
                "
            >
              <div className="font-medium">{card.title}</div>

              <div className="text-center">
                {card.contents?.length || 0}
              </div>

              <div className="flex justify-center gap-2">
                <Link
                  href={`/admin/cards/${card._id}`}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 w-20 text-center"
                >
                  View
                </Link>

                <button
                  onClick={() => handleRemoveCard(card._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 w-20"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== PAGINATION ===== */}
      <div ref={paginationRef}>
        <Pagination
          totalItems={cards.length}
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

      {/* ===== ADD CARD MODAL ===== */}
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
            <label>Chọn thẻ</label>
            <Select
              variant="standard"
              disableUnderline
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              fullWidth
            >
              {allCards
                .filter(c => !cards.some(cc => cc._id === c._id))
                .map(c => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.title} ({c.contents?.length || 0})
                  </MenuItem>
                ))}

              {allCards.filter(c => !cards.some(cc => cc._id === c._id)).length === 0 && (
                <MenuItem disabled>Không còn thẻ nào</MenuItem>
              )}
            </Select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[18px] font-medium transition"
              >
                Lưu
              </button>

              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[18px] font-medium transition"
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
