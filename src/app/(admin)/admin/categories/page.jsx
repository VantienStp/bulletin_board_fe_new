"use client";

import { useEffect, useState, useRef } from "react";
import {
  FaFolderOpen,
  FaEye,
  FaPlusSquare,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import Modal from "@/components/common/Modal";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import usePagination from "@/hooks/usePagination";
import { Select, MenuItem } from "@mui/material";
import Pagination from "@/components/common/Pagination";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    gridLayoutId: "",
    icon: "",
  });

  const iconOptions = [
    "fas fa-folder",
    "fas fa-folder-open",
    "fas fa-file",
    "fas fa-file-alt",
    "fas fa-file-pdf",
    "fas fa-file-image",
    "fas fa-file-video",

    "fas fa-image",
    "fas fa-images",
    "fas fa-photo-video",
    "fas fa-camera",
    "fas fa-video",
    "fas fa-film",

    "fas fa-newspaper",
    "fas fa-bullhorn",
    "fas fa-bell",

    "fas fa-calendar",
    "fas fa-calendar-alt",
    "fas fa-clock",

    "fas fa-user",
    "fas fa-user-friends",
    "fas fa-users",

    "fas fa-star",
    "fas fa-bookmark",
    "fas fa-tags",
  ];

  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* ===== Pagination (GIỐNG CardsPage) ===== */
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef(null);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = categories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    fetchCategories();
    fetchLayouts();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    // Nếu xóa hết user → quay về page 1
    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [categories.length, itemsPerPage, currentPage]);

  async function fetchCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    const data = await res.json();
    if (Array.isArray(data)) setCategories(data);
  }

  async function fetchLayouts() {
    const res = await fetch(`${API_BASE_URL}/gridlayouts`);
    const data = await res.json();
    if (Array.isArray(data)) setLayouts(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const method = editingCategory ? "PUT" : "POST";
    const url = editingCategory
      ? `${API_BASE_URL}/categories/${editingCategory._id}`
      : `${API_BASE_URL}/categories`;

    const res = await authFetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });


    if (!res.ok) {
      alert("❌ Lưu thất bại");
      return;
    }

    setShowForm(false);
    setEditingCategory(null);
    fetchCategories();
  }

  function handleEdit(cat) {
    setEditingCategory(cat);
    setFormData({
      title: cat.title,
      description: cat.description || "",
      gridLayoutId:
        typeof cat.gridLayoutId === "object"
          ? cat.gridLayoutId._id
          : cat.gridLayoutId || "",
      icon: cat.icon || "",
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    const res = await authFetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
    });
    if (res.ok) fetchCategories();
  }

  return (
    <div className="px-4">
      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaFolderOpen /> Danh mục
        </h1>

        <button
          className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-900 flex items-center gap-2"
          onClick={() => {
            setEditingCategory(null);
            setFormData({
              title: "",
              description: "",
              gridLayoutId: "",
              icon: "",
            });
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
          grid grid-cols-[1.2fr_120px_2fr_1.2fr_260px]
          px-6 py-4 font-semibold text-gray-600
          border-b text-sm
        ">
          <div>Tên danh mục</div>
          <div className="text-center">Icon</div>
          <div>Mô tả</div>
          <div>Layout</div>
          <div className="text-center">Actions</div>
        </div>

        {/* ROWS */}
        <div className="divide-y">
          {paginatedCategories.map((cat) => (
            <div
              key={cat._id}
              className="
                grid grid-cols-[1.2fr_120px_2fr_1.2fr_260px]
                px-6 py-2 items-center
                hover:bg-gray-50 transition
                text-sm
              "
            >
              <div className="font-medium">{cat.title}</div>

              <div className="text-center text-xl">
                {cat.icon ? <i className={cat.icon} /> : "—"}
              </div>

              <div className="text-gray-700">
                {cat.description || "—"}
              </div>

              <div>
                {typeof cat.gridLayoutId === "object"
                  ? cat.gridLayoutId.title
                  : cat.gridLayoutId || "—"}
              </div>

              <div className="flex justify-center gap-2">
                <Link
                  href={`/admin/categories/${cat._id}`}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 w-20 text-center"
                >
                  View
                </Link>

                <button
                  onClick={() => handleEdit(cat)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 w-20"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(cat._id)}
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
          totalItems={categories.length}
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
          title={editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
          onClose={() => setShowForm(false)}
          width="500px"
        >
          <form onSubmit={handleSubmit}>
            <label>Tên danh mục</label>
            <input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <label>Icon</label>
            <Select
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              fullWidth
            >
              <MenuItem value="">— Chọn icon —</MenuItem>
              {iconOptions.map((ic) => (
                <MenuItem key={ic} value={ic}>
                  <i className={`${ic} mr-2`} /> {ic}
                </MenuItem>
              ))}
            </Select>

            <label>Mô tả</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />

            <label>Grid Layout</label>
            <Select
              value={formData.gridLayoutId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gridLayoutId: e.target.value,
                })
              }
              fullWidth
            >
              <MenuItem value="">— Chọn layout —</MenuItem>
              {layouts.map((l) => (
                <MenuItem key={l._id} value={l._id}>
                  {l.title}
                </MenuItem>
              ))}
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
                onClick={() => setShowForm(false)}
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
