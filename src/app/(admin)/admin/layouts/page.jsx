"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FaLayerGroup } from "react-icons/fa";

import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";
import { authFetch } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import { layoutAdapter } from "@/data/adapters/layoutAdapter";

import { useLayoutFilters } from "@/hooks/useLayoutFilters";
import LayoutToolbar from "@/components/feature/layouts/LayoutToolbar";
import LayoutTable from "@/components/feature/layouts/LayoutTable";
import LayoutFormModal from "@/components/feature/layouts/LayoutFormModal";

export default function LayoutsPage() {
	// 1. Dùng SWR để fetch
	const { data: rawLayouts, mutate } = useSWR(`${API_BASE_URL}/gridlayouts`, fetcher);

	// 2. Chuẩn hóa
	const allLayouts = rawLayouts ? rawLayouts.map(item => layoutAdapter(item)) : [];

	// --- HOOK FILTER & SEARCH ---
	const {
		searchText, setSearchText,
		filteredLayouts
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

	// Reset về trang 1 khi tìm kiếm
	useEffect(() => {
		setCurrentPage(1);
	}, [searchText]);

	// --- HANDLERS ---
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
			mutate(); // Reload data ngầm
		} else {
			alert("❌ Lưu thất bại");
		}
	};

	const handleDelete = (id) => {
		setDeleteLayoutId(id);
		setDeleteStatus("idle");
	};

	const handleDeleteConfirmed = async () => {
		if (!deleteLayoutId) return;
		setDeleteStatus("loading");

		try {
			const res = await authFetch(`${API_BASE_URL}/gridlayouts/${deleteLayoutId}`, { method: "DELETE" });
			const data = await res.json();

			if (!res.ok) throw new Error(data.message || "Delete failed");

			mutate(); // Reload data ngầm
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

	if (!rawLayouts) return <div>Đang tải dữ liệu...</div>;

	return (
		<div className="px-4 pb-10">
			{/* HEADER + TOOLBAR */}
			<div className="flex justify-between items-end mb-8">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<FaLayerGroup /> Bố cục hiển thị
					</h1>
					<p className="text-sm text-gray-500 mt-2">
						Hiển thị {filteredLayouts.length} bố cục phù hợp.
					</p>
				</div>

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