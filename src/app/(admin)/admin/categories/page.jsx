"use client";

import { useEffect, useState, useRef } from "react";
import { FaFolderOpen } from "react-icons/fa";
import Pagination from "@/components/common/Pagination";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { categoryAdapter } from "@/data/adapters/categoryAdapter";

// Import Hooks & Components mới
import { useCategoryFilters } from "@/hooks/useCategoryFilters";
import CategoryToolbar from "@/components/feature/categories/CategoryToolbar";
import CategoryTable from "@/components/feature/categories/CategoryTable";
import CategoryFormModal from "@/components/feature/categories/CategoryFormModal";

export default function CategoriesPage() {
	const [allCategories, setAllCategories] = useState([]);
	const [layouts, setLayouts] = useState([]);

	//  HOOK FILTER
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

	useEffect(() => {
		fetchCategories();
		fetchLayouts();
	}, []);

	// Reset trang về 1 khi search/filter thay đổi
	useEffect(() => {
		setCurrentPage(1);
	}, [searchText, filters]);

	async function fetchCategories() {
		try {
			const res = await fetch(`${API_BASE_URL}/categories`);
			const rawData = await res.json();
			if (Array.isArray(rawData)) {
				const cleanData = rawData.map(item => categoryAdapter(item));
				setAllCategories(cleanData);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function fetchLayouts() {
		try {
			const res = await fetch(`${API_BASE_URL}/gridlayouts`);
			const data = await res.json();
			if (Array.isArray(data)) setLayouts(data);
		} catch (err) {
			console.error(err);
		}
	}

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
		fetchCategories();
	};

	const handleDelete = async (id) => {
		if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
		const res = await authFetch(`${API_BASE_URL}/categories/${id}`, {
			method: "DELETE",
		});
		if (res.ok) fetchCategories();
	};

	// --- PAGINATION ON FILTERED DATA ---
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

	return (
		<div className="px-4 pb-20">
			{/* HEADER + TOOLBAR */}
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
			{filteredCategories.length > 0 && (
				<div ref={paginationRef} className="mt-6 flex justify-center">
					<Pagination
						totalItems={filteredCategories.length}
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