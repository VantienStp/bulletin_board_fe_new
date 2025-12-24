"use client";

import { useEffect, useState, useRef } from "react";
import { FaThLarge, FaPlusSquare, FaEdit, FaTrash } from "react-icons/fa";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";

import { authFetch } from "@/lib/auth";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

export default function LayoutsPage() {
  const [layouts, setLayouts] = useState([]);
  const [formData, setFormData] = useState({ title: "" });
  const [editingLayout, setEditingLayout] = useState(null);
  const [deleteLayoutId, setDeleteLayoutId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("idle");

  const [showForm, setShowForm] = useState(false);

  // ===== Pagination state (GIỐNG PROJECT) =====
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef(null);

  // ===== Fetch layouts =====
  useEffect(() => {
    fetchLayouts();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(layouts.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    // Nếu xóa hết user → quay về page 1
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [layouts.length, itemsPerPage, currentPage]);

  async function fetchLayouts() {
    try {
      const res = await authFetch(`${API_BASE_URL}/gridlayouts`);
      if (!res?.ok) return;

      const data = await res.json();
      if (Array.isArray(data)) setLayouts(data);
    } catch (err) {
      console.error("❌ fetchLayouts error:", err);
    }
  }

  // ===== Pagination slice =====
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLayouts = layouts.slice(startIndex, endIndex);

  function handleDelete(id) {
    setDeleteLayoutId(id);
  }

  async function handleDeleteConfirmed() {
    if (!deleteLayoutId) return;

    setDeleteStatus("loading");

    try {
      const res = await authFetch(
        `${API_BASE_URL}/gridlayouts/${deleteLayoutId}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      await fetchLayouts();
      setDeleteStatus("success");

      setTimeout(() => {
        setDeleteLayoutId(null);
        setDeleteStatus("idle");
      }, 800);

    } catch (err) {
      setDeleteStatus(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const method = editingLayout ? "PUT" : "POST";
    const url = editingLayout
      ? `${API_BASE_URL}/gridlayouts/${editingLayout._id}`
      : `${API_BASE_URL}/gridlayouts`;

    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res?.ok) {
      setShowForm(false);
      setEditingLayout(null);
      fetchLayouts();
    } else {
      alert("❌ Lưu thất bại");
    }
  }

  return (
    <div className="px-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaThLarge /> Bố cục hiển thị
        </h1>

        <button
          className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-900 flex items-center gap-2"
          onClick={() => {
            setFormData({ title: "" });
            setEditingLayout(null);
            setShowForm(true);
          }}
        >
          <FaPlusSquare /> Thêm mới
        </button>
      </div>

      {/* TABLE WRAPPER */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* TABLE HEADER */}
        <div
          className="
            grid grid-cols-[1fr_0.8fr_0.6fr_1.2fr_100px]
            px-6 py-4 font-semibold text-gray-600
            border-b gap-4 text-[14px] text-center
          "
        >
          <div className="text-left">Tên bố cục</div>
          <div>Slug</div>
          <div>Số card</div>
          <div>Xem nhanh</div>
          <div>Actions</div>
        </div>

        {/* ROWS */}
        <div className="divide-y">
          {paginatedLayouts.map((l) => (
            <div
              key={l._id}
              className="
                grid grid-cols-[1fr_0.8fr_0.6fr_1.2fr_100px]
                px-6 py-2 items-center
                hover:bg-gray-50 transition
                gap-4 text-[13px]
              "
            >
              {/* TITLE */}
              <div className="font-medium">{l.title}</div>

              {/* Slug */}
              <div className="text-center text-gray-600">{l.slug}</div>


              {/* COUNT */}
              <div className="text-center font-medium">
                {l.config?.positions?.length || 0}
              </div>

              {/* PREVIEW */}
              <div className="flex justify-center">
                <div
                  className="inline-grid bg-gray-100 p-2 rounded-md gap-1"
                  style={{
                    gridTemplateColumns: l.config.columns.map(() => "16px").join(" "),
                    gridTemplateRows: `repeat(${l.config.rows}, 16px)`,
                  }}
                >
                  {l.config?.positions?.map((pos, i) => (
                    <div
                      key={i}
                      className="bg-blue-500/80 rounded-sm"
                      style={{
                        gridColumn: `${pos.x + 1} / span ${pos.w}`,
                        gridRow: `${pos.y + 1} / span ${pos.h}`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-1 text-center">
                <Link
                  href={`/admin/layouts/${l._id}`}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(l._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div ref={paginationRef}>
        <Pagination
          totalItems={layouts.length}
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

      {/* MODAL */}
      {showForm && (
        <Modal
          title={editingLayout ? "Sửa bố cục" : "Thêm bố cục mới"}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit}>
            <label>Tên bố cục</label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            {/* <label>Mã code</label>
            <input
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              required
            /> */}

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

      <DeleteModal
        open={!!deleteLayoutId}
        title="Delete Layout?"
        message={
          deleteStatus === "loading"
            ? "Đang xóa bố cục..."
            : deleteStatus === "success"
              ? "✅ Xóa bố cục thành công"
              : deleteStatus !== "idle"
                ? `❌ ${deleteStatus}`
                : "Bạn có chắc muốn xóa bố cục này không?"
        }
        onCancel={() => {
          if (deleteStatus !== "loading") {
            setDeleteLayoutId(null);
            setDeleteStatus("idle");
          }
        }}
        onConfirm={handleDeleteConfirmed}
      />

    </div>
  );
}
