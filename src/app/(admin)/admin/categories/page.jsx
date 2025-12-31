"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

// Components
import Pagination from "@/components/common/Pagination";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { categoryAdapter } from "@/data/adapters/categoryAdapter";

import { useCategoryFilters } from "@/hooks/useCategoryFilters";
import CategoryToolbar from "@/components/feature/categories/CategoryToolbar";
import CategoryTable from "@/components/feature/categories/CategoryTable";
import CategoryFormModal from "@/components/feature/categories/CategoryFormModal";

export default function CategoriesPage() {
	// 1. Dùng SWR để lấy danh sách Category
	const { data: rawCategories, mutate } = useSWR(`${API_BASE_URL}/categories`, fetcher);

	// 2. Dùng SWR để lấy danh sách Layouts (để nạp vào Dropdown filter và Modal)
	// Layout ít khi thay đổi, nên SWR sẽ cache rất hiệu quả
	const { data: rawLayouts } = useSWR(`${API_BASE_URL}/gridlayouts`, fetcher);

	// Chuẩn hóa dữ liệu
	const allCategories = rawCategories ? rawCategories.map(item => categoryAdapter(item)) : [];
	const layouts = rawLayouts || [];

	// Hook Filter
	const {
		searchText, setSearchText,
		filters, toggleFilter, clearFilters,
		filteredCategories
	} = useCategoryFilters(allCategories);

	// State Form
	const [editingCategory, setEditingCategory] = useState(null);
	const [showForm, setShowForm] = useState(false);

	// Pagination
	const itemsPerPage = 6;
	const [currentPage, setCurrentPage] = useState(1);
	const paginationRef = useRef(null);

	// Reset page khi search
	useEffect(() => {
		setCurrentPage(1);
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
		if (res.ok) mutate(); // Reload data ngầm
	};

	// Pagination slice
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

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
				categories={paginatedCategories}
				onEdit={handleOpenEdit}
				onDelete={handleDelete}
			/>

			{/* PAGINATION */}
			{filteredCategories.length > itemsPerPage && (
				<div ref={paginationRef} className="mt-6 flex justify-center">
					<Pagination
						totalItems={filteredCategories.length}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
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