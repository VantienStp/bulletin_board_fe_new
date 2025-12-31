"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FaUsers } from "react-icons/fa";

import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { userAdapter } from "@/data/adapters/userAdapter";

import { useUserFilters } from "@/hooks/useUserFilters";
import UserToolbar from "@/components/feature/users/UserToolbar";
import UserTable from "@/components/feature/users/UserTable";
import UserFormModal from "@/components/feature/users/UserFormModal";

export default function UsersPage() {
  // 1. Dùng SWR để fetch
  const { data: rawUsers, mutate } = useSWR(`${API_BASE_URL}/users`, fetcher);

  // 2. Chuẩn hóa
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
        />
      </div>

      {/* TABLE */}
      <UserTable
        users={paginatedUsers}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* PAGINATION */}
      {filteredUsers.length > itemsPerPage && (
        <div ref={paginationRef} className="mt-6 flex justify-center">
          <Pagination
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              paginationRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
            }}
          />
        </div>
      )}

      {/* MODAL FORM */}
      <UserFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        initialData={editingUser}
        onSubmit={handleSubmitForm}
      />

      {/* DELETE MODAL */}
      <DeleteModal
        open={!!deleteUserId}
        title="Xóa người dùng?"
        message={
          deleteStatus === "loading" ? "Đang xóa..." :
            deleteStatus === "success" ? "✅ Đã xóa thành công" :
              deleteStatus === "error" ? "❌ Xóa thất bại!" :
                "Bạn có chắc muốn xóa người dùng này không?"
        }
        onCancel={() => {
          if (deleteStatus !== "loading") {
            setDeleteUserId(null);
            setDeleteStatus("idle");
          }
        }}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}