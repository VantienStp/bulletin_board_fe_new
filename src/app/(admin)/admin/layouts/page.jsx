"use client";

import { useEffect, useState, useRef } from "react";
import { FaThLarge } from "react-icons/fa";
import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";
import { authFetch } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import { layoutAdapter } from "@/data/adapters/layoutAdapter";

// Import Components & Hooks
import { useLayoutFilters } from "@/hooks/useLayoutFilters";
import LayoutToolbar from "@/components/feature/layouts/LayoutToolbar";
import LayoutTable from "@/components/feature/layouts/LayoutTable";
import LayoutFormModal from "@/components/feature/layouts/LayoutFormModal";

export default function LayoutsPage() {
	const [allLayouts, setAllLayouts] = useState([]); // Đổi tên state gốc

	// --- HOOK FILTER & SEARCH ---
	const {
		searchText, setSearchText,
		filteredLayouts // Dữ liệu đã lọc để hiển thị
	} = useLayoutFilters(allLayouts);

	// State Form & Delete
	const [editingLayout, setEditingLayout] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [deleteLayoutId, setDeleteLayoutId] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	// Pagination
	const itemsPerPage = 5;
	const [currentPage, setCurrentPage] = useState(1);
	const paginationRef = useRef(null);

	useEffect(() => {
		fetchLayouts();
	}, []);

	// Reset về trang 1 khi tìm kiếm
	useEffect(() => {
		setCurrentPage(1);
	}, [searchText]);

	async function fetchLayouts() {
		try {
			const res = await authFetch(`${API_BASE_URL}/gridlayouts`);
			if (!res?.ok) return;

			const rawData = await res.json();
			if (Array.isArray(rawData)) {
				const cleanData = rawData.map(item => layoutAdapter(item));
				setAllLayouts(cleanData); // Lưu vào state gốc
			}
		} catch (err) {
			console.error("❌ fetchLayouts error:", err);
		}
	}

	// --- HANDLERS (Giữ nguyên) ---
	const handleOpenCreate = () => {
		setEditingLayout(null);
		setShowForm(true);
	};

	const handleOpenEdit = (layout) => {
		setEditingLayout(layout);
		setShowForm(true);
	};

	const handleSubmitForm = async (formData) => {
		const method = editingLayout ? "PUT" : "POST";
		const url = editingLayout
			? `${API_BASE_URL}/gridlayouts/${editingLayout.id}`
			: `${API_BASE_URL}/gridlayouts`;

		const res = await authFetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		if (res?.ok) {
			setShowForm(false);
			setEditingLayout(null);
			fetchLayouts();
		} else {
			alert("❌ Lưu thất bại");
		}
	};

	const handleDelete = (id) => {
		setDeleteLayoutId(id);
	};

	const handleDeleteConfirmed = async () => {
		if (!deleteLayoutId) return;
		setDeleteStatus("loading");

		try {
			const res = await authFetch(`${API_BASE_URL}/gridlayouts/${deleteLayoutId}`, { method: "DELETE" });
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Delete failed");

			await fetchLayouts();
			setDeleteStatus("success");

			setTimeout(() => {
				setDeleteLayoutId(null);
				setDeleteStatus("idle");
			}, 800);
		} catch (err) {
			setDeleteStatus(err.message);
		}
	};

	// --- PAGINATION ON FILTERED DATA ---
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedLayouts = filteredLayouts.slice(startIndex, startIndex + itemsPerPage);

	return (
		<div className="px-4 pb-10">
			{/* HEADER + TOOLBAR */}
			<div className="flex justify-between items-end mb-8">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<i className={"fa-solid fa-layer-group "} /> Bố cục hiển thị
					</h1>
					<p className="text-sm text-gray-500 mt-2">
						Hiển thị {filteredLayouts.length} bố cục phù hợp.
					</p>
				</div>

				{/* 👇 TOOLBAR MỚI NẰM Ở ĐÂY */}
				<LayoutToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					onAdd={handleOpenCreate}
				/>
			</div>

			{/* TABLE */}
			<LayoutTable
				layouts={paginatedLayouts}
				onEdit={handleOpenEdit}
				onDelete={handleDelete}
			/>

			{/* PAGINATION */}
			{filteredLayouts.length > 0 && (
				<div ref={paginationRef} className="flex justify-center">
					<Pagination
						totalItems={filteredLayouts.length}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={(page) => {
							setCurrentPage(page);
							paginationRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
						}}
					/>
				</div>
			)}

			{/* MODALS */}
			<LayoutFormModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				initialData={editingLayout}
				onSubmit={handleSubmitForm}
			/>

			<DeleteModal
				open={!!deleteLayoutId}
				title="Delete Layout?"
				message={
					deleteStatus === "loading" ? "Đang xóa bố cục..." :
						deleteStatus === "success" ? "✅ Xóa bố cục thành công" :
							deleteStatus !== "idle" ? `❌ ${deleteStatus}` :
								"Bạn có chắc muốn xóa bố cục này không?"
				}
				onCancel={() => {
					if (deleteStatus !== "loading") {
						setDeleteLayoutId(null);
						setDeleteStatus("idle");
					}
				}}
				onConfirm={handleDeleteConfirmed}
			/>
		</div>
	);
}