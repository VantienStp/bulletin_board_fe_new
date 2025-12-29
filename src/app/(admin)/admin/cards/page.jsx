"use client";

import { useEffect, useState, useRef } from "react";
import { FaClone, FaPlusSquare, FaCalendarAlt, FaClock } from "react-icons/fa";
import Modal from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal";
import Pagination from "@/components/common/Pagination";

import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  
  const [formData, setFormData] = useState({
    title: "",
    startDate: new Date().toISOString().split('T')[0], 
    endDate: "",
    isWorkDaysOnly: false
  });
  
  const [editingCard, setEditingCard] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  // State cho việc xóa
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("idle");

  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef(null);

  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    try {
      const res = await fetch(`${API_BASE_URL}/cards`);
      const data = await res.json();
      if (Array.isArray(data)) setCards(data);
    } catch (err) {
      console.error("❌ fetchCards error:", err);
    }
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCards = cards.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Vĩnh viễn";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (card) => {
    const now = new Date();
    const start = new Date(card.startDate);
    const end = card.endDate ? new Date(card.endDate) : null;

    if (start > now) return <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-semibold">Chờ</span>;
    if (end && end < now) return <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold">Hết hạn</span>;
    return <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold">Live</span>;
  };

  function handleEdit(card) {
    setEditingCard(card);
    setFormData({
      title: card.title,
      startDate: card.startDate ? card.startDate.split('T')[0] : "",
      endDate: card.endDate ? card.endDate.split('T')[0] : "",
      isWorkDaysOnly: card.isWorkDaysOnly || false
    });
    setShowForm(true);
  }

  // ✅ 1. Kích hoạt Modal Xóa
  function handleDelete(id) {
    setDeleteCardId(id);
    setDeleteStatus("confirming");
  }

  async function handleDeleteConfirmed() {
    if (!deleteCardId) return;

    setDeleteStatus("deleting");

    try {
      const res = await authFetch(`${API_BASE_URL}/cards/${deleteCardId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCards((prev) => prev.filter((c) => c._id !== deleteCardId));
        
        alert("✅ Đã xóa thẻ thành công!");
        
        setDeleteCardId(null);
        setDeleteStatus("idle");
      } else {
        const errorData = await res.json();
        
        alert(`❌ ${errorData.message || "Xóa thất bại! Vui lòng thử lại."}`);
        
        setDeleteStatus("idle");
        setDeleteCardId(null);
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("❌ Lỗi kết nối đến server!");
      setDeleteStatus("idle");
      setDeleteCardId(null);
    }
  }

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
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaClone /> Thẻ nội dung
        </h1>

        <button
          className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-900 flex items-center gap-2"
          onClick={() => {
            setFormData({
              title: "",
              startDate: new Date().toISOString().split('T')[0],
              endDate: "",
              isWorkDaysOnly: false
            });
            setEditingCard(null);
            setShowForm(true);
          }}
        >
          <FaPlusSquare /> Thêm mới
        </button>
      </div>

      {/* TABLE WRAPPER */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* HEADER */}
        <div className="
          grid grid-cols-[1.5fr_100px_100px_200px_120px_240px]
          px-6 py-4 font-semibold text-gray-600
          border-b text-sm
        ">
          <div>Tiêu đề</div>
          <div className="text-center">Nội dung</div>
          <div className="text-center">Status</div>
          <div className="text-center">Thời gian</div>
          <div className="text-center">Chế độ</div>
          <div className="text-center">Actions</div>
        </div>

        {/* ROWS */}
        <div className="divide-y">
          {paginatedCards.map((card) => (
            <div
              key={card._id}
              className="
                grid grid-cols-[1.5fr_100px_100px_200px_120px_240px]
                px-6 py-3 items-center
                hover:bg-gray-50 transition
                text-sm
              "
            >
              <div className="font-medium truncate pr-4">{card.title}</div>

              <div className="text-center">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs">{card.contents?.length || 0}</span>
              </div>

              <div className="text-center">
                {getStatusBadge(card)}
              </div>

              <div className="text-center text-xs text-gray-500">
                <div className="flex flex-col">
                  <span>S: {formatDate(card.startDate)}</span>
                  <span>E: {formatDate(card.endDate)}</span>
                </div>
              </div>

              <div className="text-center">
                {card.isWorkDaysOnly ? (
                  <span className="text-blue-500 text-xs flex items-center justify-center gap-1">
                    <FaClock /> T2-T6
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs flex items-center justify-center gap-1">
                    <FaCalendarAlt /> Full
                  </span>
                )}
              </div>

              <div className="flex justify-center gap-2">
                <Link
                  href={`/admin/cards/${card._id}`}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
                >
                  View
                </Link>

                <button
                  onClick={() => handleEdit(card)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(card._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div ref={paginationRef} className="mt-4">
        <Pagination totalItems={cards.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

      {/* MODAL EDIT/CREATE */}
      {showForm && (
        <Modal
          title={editingCard ? "Sửa thẻ nội dung" : "Thêm thẻ mới"}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
              <input
                className="w-full border rounded-lg p-2 text-sm"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-green-600">Ngày bắt đầu</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2 text-sm"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-red-600">Ngày kết thúc</label>
                <input
                  type="date"
                  className="w-full border rounded-lg p-2 text-sm"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                <small className="text-gray-400 text-[10px]">* Để trống nếu muốn hiện vĩnh viễn</small>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
              <input
                type="checkbox"
                id="isWorkDaysOnly"
                className="w-4 h-4"
                checked={formData.isWorkDaysOnly}
                onChange={(e) => setFormData({ ...formData, isWorkDaysOnly: e.target.checked })}
              />
              <label htmlFor="isWorkDaysOnly" className="text-sm font-medium text-blue-700 cursor-pointer">
                Chỉ hiển thị ngày hành chính (Thứ 2 - Thứ 6)
              </label>
            </div>

            <div className="modal-actions pt-4">
              <button type="submit" className="btn-primary w-full py-2 rounded-lg font-bold">
                Lưu thay đổi
              </button>
              <button
                type="button"
                className="btn-cancel w-full py-2 mt-2"
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ✅ DELETE MODAL - Đã được thêm lại */}
      <DeleteModal 
        open={!!deleteCardId}
        title="Xóa thẻ nội dung"
        message="Hành động này sẽ xóa thẻ và toàn bộ file đính kèm vĩnh viễn khỏi server. Bạn có chắc chắn không?"
        onCancel={() => setDeleteCardId(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}