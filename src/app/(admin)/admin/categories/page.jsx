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

export default function CategoriesPage() {
	// 1. Fetch Data
	const { data: rawCategories, mutate } = useSWR(`${API_BASE_URL}/categories`, fetcher);
	const { data: rawLayouts } = useSWR(`${API_BASE_URL}/gridlayouts`, fetcher);

	// 2. Chuẩn hóa dữ liệu
	const allCategories = rawCategories ? rawCategories.map(item => categoryAdapter(item)) : [];
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
		// Logic: Bật khi focus bảng + KHÔNG focus search + có nhiều trang
		enabled: tableActive && !searchFocused && totalPages > 1,
	});

	// State Form Modal
	const [editingCategory, setEditingCategory] = useState(null);
	const [showForm, setShowForm] = useState(false);

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

		const res = await authFetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		if (!res.ok) {
			alert("❌ Lưu thất bại");
			return;
		}

		setShowForm(false);
		setEditingCategory(null);
		mutate(); // Reload data ngầm
	};

	const handleDelete = async (id) => {
		if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
		const res = await authFetch(`${API_BASE_URL}/categories/${id}`, {
			method: "DELETE",
		});
		if (res.ok) mutate();
	};

	if (!rawCategories && !rawLayouts) return <div>Đang tải dữ liệu...</div>;

	return (
		<div className="px-4 pb-20">
			{/* HEADER */}
			<div className="flex justify-between items-end mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<i className={"fa-solid fa-tags"} /> Danh mục
					</h1>
					<p className="text-sm text-gray-500 mt-2">
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
					// 7. Truyền hàm bắt sự kiện focus
					onSearchFocusChange={setSearchFocused}
				/>
			</div>

			{/* 8. BỌC VÙNG BẢNG (FOCUS AREA) */}
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
				<div className="flex justify-center">
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

			{/* MODAL */}
			<CategoryFormModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				initialData={editingCategory}
				layouts={layouts}
				onSubmit={handleSubmitForm}
			/>
		</div>
	);
}