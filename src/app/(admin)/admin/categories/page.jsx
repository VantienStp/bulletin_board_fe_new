"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

// Libs & Adapters
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { categoryAdapter } from "@/data/adapters/categoryAdapter";

// Hooks
import { useCategoryFilters } from "@/hooks/useCategoryFilters";
import usePagination from "@/hooks/usePagination";
import useArrowNavigation from "@/hooks/useArrowNavigation";

// Components
import Pagination from "@/components/common/Pagination";
import CategoryToolbar from "@/components/feature/categories/CategoryToolbar";
import CategoryTable from "@/components/feature/categories/CategoryTable";
import CategoryFormModal from "@/components/feature/categories/CategoryFormModal";
import DeleteModal from "@/components/common/DeleteModal"; // 1. Import DeleteModal

// 2. Import Toast System
import Toast from "@/components/ui/Toast";
import ToastContainer from "@/components/ui/ToastContainer";

export default function CategoriesPage() {
	// 1. Fetch Data
	const { data: rawCategories, mutate } = useSWR(`${API_BASE_URL}/categories`, fetcher);
	const { data: rawLayouts } = useSWR(`${API_BASE_URL}/gridlayouts`, fetcher);

	// 2. Chuẩn hóa dữ liệu
	const allCategories = useMemo(() => {
		return rawCategories ? rawCategories.map(item => categoryAdapter(item)) : [];
	}, [rawCategories]);

	const layouts = rawLayouts || [];

	// 3. Hook Filter
	const {
		searchText, setSearchText,
		filters, toggleFilter, clearFilters,
		filteredCategories
	} = useCategoryFilters(allCategories);

	// 4. Hook Pagination
	const ITEMS_PER_PAGE = 6;
	const {
		currentPage,
		paginatedData: paginatedCategories,
		goToPage
	} = usePagination(filteredCategories, ITEMS_PER_PAGE);

	// --- 5. STATE CHIA VÙNG (CONTEXT AWARE) ---
	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

	// --- 6. CẤU HÌNH NAVIGATION ---
	const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
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

	// --- 7. TOAST STATE ---
	const [toasts, setToasts] = useState([]);

	const addToast = (type, message) => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, type, message }]);
	};

	const removeToast = (id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	// State Form & Delete Modal
	const [editingCategory, setEditingCategory] = useState(null);
	const [showForm, setShowForm] = useState(false);

	const [deleteCategoryId, setDeleteCategoryId] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	// Reset về trang 1 khi search hoặc filter thay đổi
	useEffect(() => {
		goToPage(1);
	}, [searchText, filters]);

	// --- HANDLERS ---
	const handleOpenCreate = () => {
		setEditingCategory(null);
		setShowForm(true);
	};

	const handleOpenEdit = (cat) => {
		setEditingCategory(cat);
		setShowForm(true);
	};

	const handleSubmitForm = async (formData) => {
		const method = editingCategory ? "PUT" : "POST";
		const url = editingCategory
			? `${API_BASE_URL}/categories/${editingCategory.id}`
			: `${API_BASE_URL}/categories`;

		try {
			const res = await authFetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) throw new Error("Lỗi lưu");

			setShowForm(false);
			setEditingCategory(null);
			mutate();
			addToast("success", editingCategory ? "Cập nhật danh mục thành công!" : "Tạo danh mục mới thành công!");

		} catch (error) {
			addToast("error", "Có lỗi xảy ra, vui lòng thử lại.");
		}
	};

	// Thay thế window.confirm bằng DeleteModal
	const handleDelete = (id) => {
		setDeleteCategoryId(id);
		setDeleteStatus("confirming");
	};

	const handleDeleteConfirmed = async () => {
		if (!deleteCategoryId) return;
		setDeleteStatus("deleting");

		try {
			const res = await authFetch(`${API_BASE_URL}/categories/${deleteCategoryId}`, {
				method: "DELETE",
			});

			if (res.ok) {
				setDeleteCategoryId(null);
				setDeleteStatus("idle");
				mutate();
				addToast("success", "Đã xóa danh mục thành công!");
			} else {
				setDeleteStatus("idle");
				setDeleteCategoryId(null);
				addToast("error", "Xóa thất bại!");
			}
		} catch (error) {
			setDeleteStatus("idle");
			setDeleteCategoryId(null);
			addToast("error", "Lỗi kết nối đến server!");
		}
	};

	if (!rawCategories && !rawLayouts) return <div>Đang tải dữ liệu...</div>;

	return (
		<div className="px-4 pb-20">
			{/* 8. HIỂN THỊ TOAST CONTAINER */}
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

			{/* HEADER */}
			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<i className={"fa-solid fa-tags"} /> Danh mục
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Hiển thị {filteredCategories.length} danh mục phù hợp.
					</p>
				</div>

				<CategoryToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					filters={filters}
					toggleFilter={toggleFilter}
					clearFilters={clearFilters}
					layouts={layouts}
					onAdd={handleOpenCreate}
					onSearchFocusChange={setSearchFocused}
				/>
			</div>

			{/* BỌC VÙNG BẢNG (FOCUS AREA) */}
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
				<CategoryTable
					categories={paginatedCategories}
					onEdit={handleOpenEdit}
					onDelete={handleDelete}
				/>

				{/* PAGINATION */}
				<div className="flex justify-center mt-6">
					<Pagination
						totalItems={filteredCategories.length}
						itemsPerPage={ITEMS_PER_PAGE}
						currentPage={currentPage}
						onPageChange={(page) => {
							goToPage(page);
							paginationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
						}}
					/>
				</div>
			</div>

			{/* MODAL FORM */}
			<CategoryFormModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				initialData={editingCategory}
				layouts={layouts}
				onSubmit={handleSubmitForm}
			/>

			{/* DELETE MODAL */}
			<DeleteModal
				open={!!deleteCategoryId}
				title="Xóa danh mục?"
				message="Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác."
				onCancel={() => setDeleteCategoryId(null)}
				onConfirm={handleDeleteConfirmed}
			/>
		</div>
	);
}