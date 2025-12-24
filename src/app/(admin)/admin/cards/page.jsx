"use client";

import { useEffect, useState, useRef } from "react";
import { FaClone, FaPlusSquare } from "react-icons/fa";
import Modal from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import Pagination from "@/components/common/Pagination";

import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [formData, setFormData] = useState({ title: "" });
  const [editingCard, setEditingCard] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("idle");

  /* ===== Pagination (GIỐNG LayoutsPage) ===== */
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef(null);

  /* ===== Fetch ===== */
  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(cards.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    // Nếu xóa hết user → quay về page 1
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [cards.length, itemsPerPage, currentPage]);

  async function fetchCards() {
    try {
      const res = await fetch(`${API_BASE_URL}/cards`);
      const data = await res.json();
      if (Array.isArray(data)) setCards(data);
    } catch (err) {
      console.error("❌ fetchCards error:", err);
    }
  }

  /* ===== Pagination slice ===== */
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCards = cards.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* ===== Edit ===== */
  function handleEdit(card) {
    setEditingCard(card);
    setFormData({ title: card.title });
    setShowForm(true);
  }

  /* ===== Delete ===== */
  function handleDelete(id) {
    setDeleteCardId(id);
  }

  async function handleDeleteConfirmed() {
    if (!deleteCardId) return;
    setDeleteStatus("loading");

    try {
      const res = await authFetch(
        `${API_BASE_URL}/cards/${deleteCardId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Xóa thẻ thất bại");

      await fetchCards();
      setDeleteStatus("success");

      setTimeout(() => {
        setDeleteCardId(null);
        setDeleteStatus("idle");
      }, 800);
    } catch (err) {
      setDeleteStatus(err.message);
    }
  }

  /* ===== Submit ===== */
  async function handleSubmit(e) {
    e.preventDefault();

    const method = editingCard ? "PUT" : "POST";
    const url = editingCard
      ? `${API_BASE_URL}/cards/${editingCard._id}`
      : `${API_BASE_URL}/cards`;

    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      alert("❌ Lưu thẻ thất bại");
      return;
    }

    setShowForm(false);
    setEditingCard(null);
    fetchCards();
  }

  return (
    <div className="px-4">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaClone /> Thẻ nội dung
        </h1>

        <button
          className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-900 flex items-center gap-2"
          onClick={() => {
            setFormData({ title: "" });
            setEditingCard(null);
            setShowForm(true);
          }}
        >
          <FaPlusSquare /> Thêm mới
        </button>
      </div>

      {/* ===== TABLE WRAPPER ===== */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* HEADER */}
        <div className="
          grid grid-cols-[1fr_1fr_300px]
          px-6 py-4 font-semibold text-gray-600
          border-b text-sm
        ">
          <div>Tiêu đề</div>
          <div className="text-center">Số nội dung</div>
          <div className="text-center">Actions</div>
        </div>

        {/* ROWS */}
        <div className="divide-y">
          {paginatedCards.map((card) => (
            <div
              key={card._id}
              className="
                grid grid-cols-[1fr_1fr_300px]
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
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 text-center w-20"
                >
                  View
                </Link>

                <button
                  onClick={() => handleEdit(card)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 text-center w-20"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(card._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 text-center w-20"
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

      {/* ===== MODAL ===== */}
      {showForm && (
        <Modal
          title={editingCard ? "Sửa thẻ nội dung" : "Thêm thẻ mới"}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit}>
            <label>Tiêu đề</label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <div className="modal-actions">
              <button type="submit" className="btn-primary">
                Lưu
              </button>
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

      {/* ===== DELETE MODAL ===== */}
      <DeleteModal
        open={!!deleteCardId}
        title="Delete Card?"
        message={
          deleteStatus === "loading"
            ? "Đang xóa thẻ..."
            : deleteStatus === "success"
              ? "✅ Xóa thẻ thành công"
              : deleteStatus !== "idle"
                ? `❌ ${deleteStatus}`
                : "Bạn có chắc muốn xóa thẻ này không?"
        }
        onCancel={() => {
          if (deleteStatus !== "loading") {
            setDeleteCardId(null);
            setDeleteStatus("idle");
          }
        }}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
