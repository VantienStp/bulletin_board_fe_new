"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FaUsers } from "react-icons/fa";

// Libs & Adapters
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { userAdapter } from "@/data/adapters/userAdapter";

// Hooks
import { useUserFilters } from "@/hooks/useUserFilters";
import useArrowNavigation from "@/hooks/useArrowNavigation";
import usePagination from "@/hooks/usePagination";

// Components
import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";
import UserToolbar from "@/components/feature/users/UserToolbar";
import UserTable from "@/components/feature/users/UserTable";
import UserFormModal from "@/components/feature/users/UserFormModal";

// Toast System
import Toast from "@/components/ui/Toast";
import ToastContainer from "@/components/ui/ToastContainer";

export default function UsersPage() {

	const { data: rawUsers, mutate } = useSWR(`${API_BASE_URL}/users`, fetcher);

	// Chuẩn hóa dữ liệu
	const allUsers = useMemo(() => {
		return rawUsers ? rawUsers.map(item => userAdapter(item)) : [];
	}, [rawUsers]);

	// Hook Filter
	const {
		searchText, setSearchText,
		filters, toggleFilter, clearFilters,
		filteredUsers
	} = useUserFilters(allUsers);

	// HOOK USEPAGINATION 
	const ITEMS_PER_PAGE = 6;
	const {
		currentPage,
		paginatedData: paginatedUsers,
		goToPage
	} = usePagination(filteredUsers, ITEMS_PER_PAGE);

	// Focus Management
	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

	// Cấu hình Arrow Navigation
	const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
	const pagesArray = useMemo(() =>
		Array.from({ length: totalPages }, (_, i) => ({ id: i + 1 })),
		[totalPages]);

	useArrowNavigation({
		items: pagesArray,
		activeId: currentPage,
		setActiveId: goToPage,
		direction: "horizontal",
		enabled: tableActive && !searchFocused && totalPages > 1,
	});

	// --- TOAST STATE ---
	const [toasts, setToasts] = useState([]);

	const addToast = (type, message) => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, type, message }]);
	};

	const removeToast = (id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	// State Form & Delete
	const [editingUser, setEditingUser] = useState(null);
	const [showForm, setShowForm] = useState(false);

	const [deleteUserId, setDeleteUserId] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	// Reset trang khi search
	useEffect(() => {
		goToPage(1);
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

		try {
			const res = await authFetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (res?.ok) {
				setShowForm(false);
				setEditingUser(null);
				mutate();
				addToast("success", editingUser ? "Cập nhật người dùng thành công!" : "Thêm người dùng mới thành công!");
			} else {
				// 👇 SỬA Ở ĐÂY: Đọc message lỗi từ server gửi về
				const errorData = await res.json();
				addToast("error", errorData.message || "Lưu thất bại, vui lòng thử lại.");
			}
		} catch (error) {
			addToast("error", "Lỗi kết nối server!");
		}
	};
	const handleDelete = (id) => {
		setDeleteUserId(id);
		setDeleteStatus("confirming");
	};

	const handleDeleteConfirmed = async () => {
		if (!deleteUserId) return;
		setDeleteStatus("loading");

		try {
			const res = await authFetch(`${API_BASE_URL}/users/${deleteUserId}`, { method: "DELETE" });

			if (res?.ok) {
				setDeleteUserId(null);
				setDeleteStatus("idle");
				mutate();
				addToast("success", "Đã xóa người dùng thành công!");
			} else {
				setDeleteStatus("idle");
				setDeleteUserId(null);
				addToast("error", "Xóa thất bại!");
			}
		} catch (err) {
			setDeleteStatus("idle");
			setDeleteUserId(null);
			addToast("error", "Lỗi kết nối server!");
		}
	};

	if (!rawUsers) return <div>Đang tải dữ liệu...</div>;

	return (
		<div className="px-4 pb-20">
			{/* TOAST CONTAINER */}
			<ToastContainer>
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						id={toast.id}
						type={toast.type}
						message={toast.message}
						onClose={removeToast}
					/>
				))}
			</ToastContainer>

			{/* HEADER + TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<FaUsers /> Quản lý người dùng
					</h1>
					<p className="text-sm text-gray-500 mt-1">
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

			{/* VÙNG BẢNG (FOCUS AREA) */}
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
				<div className="flex justify-center mt-6">
					<Pagination
						totalItems={filteredUsers.length}
						itemsPerPage={ITEMS_PER_PAGE}
						currentPage={currentPage}
						onPageChange={(page) => {
							goToPage(page);
							paginationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
						}}
					/>
				</div>
			</div>

			{/* MODALS */}
			<UserFormModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				initialData={editingUser}
				onSubmit={handleSubmitForm}
			/>

			<DeleteModal
				open={!!deleteUserId}
				title="Xóa người dùng?"
				message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?"
				onCancel={() => {
					if (deleteStatus !== "loading") setDeleteUserId(null);
				}}
				onConfirm={handleDeleteConfirmed}
				isLoading={deleteStatus === "loading"}
			/>
		</div>
	);
}