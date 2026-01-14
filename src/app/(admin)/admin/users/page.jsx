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
import { useToast } from "@/context/ToastContext"; // ✅ Dùng Toast toàn cục

// Components
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal"; // ✅ Đã đồng bộ tên
import UserToolbar from "@/components/feature/users/UserToolbar";
import UserTable from "@/components/feature/users/UserTable";
import UserFormModal from "@/components/feature/users/UserFormModal";

export default function UsersPage() {
	const { addToast } = useToast(); // ✅ Lấy hàm từ Context
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

	const [editingUser, setEditingUser] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [deleteUserId, setDeleteUserId] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	useEffect(() => {
		goToPage(1);
	}, [searchText, filters]);

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
				const errorData = await res.json();
				addToast("error", errorData.message || "Lưu thất bại, vui lòng kiểm tra lại.");
			}
		} catch (error) {
			addToast("error", "Lỗi kết nối server!");
		}
	};

	const handleDeleteConfirmed = async () => {
		if (!deleteUserId) return;
		setDeleteStatus("loading");

		try {
			const res = await authFetch(`${API_BASE_URL}/users/${deleteUserId}`, { method: "DELETE" });

			if (res?.ok) {
				mutate();
				addToast("success", "Đã xóa người dùng thành công!");
			} else {
				const errorData = await res.json();
				addToast("error", errorData.message || "Xóa thất bại!");
			}
		} catch (err) {
			addToast("error", "Lỗi kết nối server!");
		} finally {
			setDeleteUserId(null);
			setDeleteStatus("idle");
		}
	};

	if (!rawUsers) return (
		<div className="w-full h-64 flex items-center justify-center text-gray-400">
			<i className="fa-solid fa-spinner animate-spin mr-2"></i> Đang tải dữ liệu người dùng...
		</div>
	);

	return (
		<div className="px-4 pb-20">
			{/* HEADER + TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<FaUsers className="" /> Quản lý người dùng
					</h1>
					<p className="text-sm text-gray-500 mt-1 italic">
						Tìm thấy {filteredUsers.length} người dùng phù hợp.
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

			{/* VÙNG BẢNG (FOCUS AREA CHO BÀN PHÍM) */}
			<div
				tabIndex={0}
				onFocus={() => setTableActive(true)}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget)) {
						setTableActive(false);
					}
				}}
				className="outline-none scroll-mt-4 focus:ring-1 focus:ring-blue-100 rounded-lg p-1 transition-all"
				ref={paginationRef}
			>
				<UserTable
					users={paginatedUsers}
					onEdit={handleOpenEdit}
					onDelete={(id) => {
						setDeleteUserId(id);
						setDeleteStatus("idle");
					}}
				/>

				<div className="flex justify-center">
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

			<UserFormModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				initialData={editingUser}
				onSubmit={handleSubmitForm}
			/>

			{/* ✅ Sử dụng ConfirmModal đã nâng cấp */}
			<ConfirmModal
				open={!!deleteUserId}
				title="Xóa người dùng?"
				message="Dữ liệu này sẽ không thể khôi phục. Bạn có chắc chắn muốn xóa người dùng này?"
				confirmText="Xóa ngay"
				variant="danger"
				onCancel={() => setDeleteUserId(null)}
				onConfirm={handleDeleteConfirmed}
				isLoading={deleteStatus === "loading"}
			/>
		</div>
	);
}