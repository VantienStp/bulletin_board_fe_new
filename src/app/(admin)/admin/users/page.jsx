"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FaUsers } from "react-icons/fa";

import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { userAdapter } from "@/data/adapters/userAdapter";

import { useUserFilters } from "@/hooks/useUserFilters";
import useArrowNavigation from "@/hooks/useArrowNavigation";

import UserToolbar from "@/components/feature/users/UserToolbar";
import UserTable from "@/components/feature/users/UserTable";
import UserFormModal from "@/components/feature/users/UserFormModal";

export default function UsersPage() {

  const { data: rawUsers, mutate } = useSWR(`${API_BASE_URL}/users`, fetcher);
  const allUsers = rawUsers ? rawUsers.map(item => userAdapter(item)) : [];

  // Hook Filter
  const {
    searchText, setSearchText,
    filters, toggleFilter, clearFilters,
    filteredUsers
  } = useUserFilters(allUsers);

  // State Form & Delete
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("idle");

  // Pagination
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const paginationRef = useRef(null);

  const [tableActive, setTableActive] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const pagesArray = useMemo(() =>
    Array.from({ length: totalPages }, (_, i) => ({ id: i + 1 })),
    [totalPages]);

  useArrowNavigation({
    items: pagesArray,
    activeId: currentPage,
    setActiveId: setCurrentPage,
    direction: "horizontal",
    enabled: tableActive && !searchFocused && totalPages > 1,
  });

  // Reset trang khi search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filters]);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSubmitForm = async (formData) => {
    const method = editingUser ? "PUT" : "POST";
    const url = editingUser
      ? `${API_BASE_URL}/users/${editingUser.id}`
      : `${API_BASE_URL}/users`;

    const payload = { ...formData };
    if (!payload.password) delete payload.password;

    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res?.ok) {
      setShowForm(false);
      setEditingUser(null);
      mutate(); // Reload data
    } else {
      alert("❌ Lưu thất bại");
    }
  };

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setDeleteStatus("idle");
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteUserId) return;
    setDeleteStatus("loading");

    try {
      const res = await authFetch(`${API_BASE_URL}/users/${deleteUserId}`, { method: "DELETE" });
      if (!res?.ok) throw new Error("Delete failed");

      mutate(); // Reload data
      setDeleteStatus("success");

      setTimeout(() => {
        setDeleteUserId(null);
        setDeleteStatus("idle");
      }, 800);
    } catch (err) {
      setDeleteStatus("error");
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  if (!rawUsers) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="px-4 pb-20">
      {/* HEADER + TOOLBAR */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaUsers /> Quản lý người dùng
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Hiển thị {filteredUsers.length} người dùng phù hợp.
          </p>
        </div>

        <UserToolbar
          searchText={searchText}
          setSearchText={setSearchText}
          filters={filters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
          onAdd={handleOpenCreate}
          onSearchFocusChange={setSearchFocused}
        />
      </div>

      {/* 6. BỌC VÙNG BẢNG (FOCUS TRAP AREA) */}
      <div
        tabIndex={0}
        onFocus={() => setTableActive(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setTableActive(false);
          }
        }}
        className="outline-none scroll-mt-4"
        ref={paginationRef}
      >
        {/* TABLE */}
        <UserTable
          users={paginatedUsers}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />

        {/* PAGINATION */}
        <div className="flex justify-center">
          <Pagination
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              paginationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        </div>
      </div>

      {/* MODALS (Giữ nguyên) */}
      <UserFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        initialData={editingUser}
        onSubmit={handleSubmitForm}
      />

      <DeleteModal
        open={!!deleteUserId}
        title="Xóa người dùng?"
        message={deleteStatus === "loading" ? "Đang xóa..." : "Bạn có chắc muốn xóa?"}
        onCancel={() => setDeleteUserId(null)}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}