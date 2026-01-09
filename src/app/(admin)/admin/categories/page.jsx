"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

// Libs & Adapters
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { categoryAdapter } from "@/data/adapters/categoryAdapter";

// Hooks
import { useCategoryFilters } from "@/hooks/useCategoryFilters";
import usePagination from "@/hooks/usePagination"; // 👈 Nhớ import Hook này

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

	// 3. Hook Filter (Xử lý tìm kiếm và lọc)
	const {
		searchText, setSearchText,
		filters, toggleFilter, clearFilters,
		filteredCategories
	} = useCategoryFilters(allCategories);

	// 4. Hook Pagination (Thay thế cho logic thủ công cũ)
	// 💡 Mẹo: Đổi tên 'paginatedData' thành 'paginatedCategories' để khớp với code bên dưới
	const {
		currentPage,
		paginatedData: paginatedCategories,
		goToPage
	} = usePagination(filteredCategories, 6);

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
				/>
			</div>

			{/* TABLE */}
			<CategoryTable
				categories={paginatedCategories} // Biến này lấy từ usePagination
				onEdit={handleOpenEdit}
				onDelete={handleDelete}
			/>

			{/* PAGINATION */}
			{filteredCategories.length > 6 && (
				<div className="mt-6 flex justify-center">
					<Pagination
						totalItems={filteredCategories.length}
						itemsPerPage={6}
						currentPage={currentPage}
						onPageChange={goToPage} // Dùng hàm của Hook
					/>
				</div>
			)}

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