"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FaLayerGroup } from "react-icons/fa";

// Components
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal"; // ✅ ĐÃ ĐỔI TÊN
import { authFetch } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/api";
import { layoutAdapter } from "@/data/adapters/layoutAdapter";

// Hooks
import { useLayoutFilters } from "@/hooks/useLayoutFilters";
import usePagination from "@/hooks/usePagination";
import useArrowNavigation from "@/hooks/useArrowNavigation";
import { useToast } from "@/context/ToastContext";

// Feature Components
import LayoutToolbar from "@/components/feature/layouts/LayoutToolbar";
import LayoutTable from "@/components/feature/layouts/LayoutTable";
import LayoutFormModal from "@/components/feature/layouts/LayoutFormModal";

export default function LayoutsPage() {
	const { addToast } = useToast();

	const { data: rawLayouts, mutate } = useSWR(`${API_BASE_URL}/gridlayouts`, fetcher);

	const allLayouts = useMemo(() => {
		return rawLayouts ? rawLayouts.map(item => layoutAdapter(item)) : [];
	}, [rawLayouts]);

	const { searchText, setSearchText, filteredLayouts } = useLayoutFilters(allLayouts);

	const ITEMS_PER_PAGE = 5;
	const {
		currentPage,
		paginatedData: paginatedLayouts,
		goToPage
	} = usePagination(filteredLayouts, ITEMS_PER_PAGE);

	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

	const totalPages = Math.ceil(filteredLayouts.length / ITEMS_PER_PAGE);
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

	const [editingLayout, setEditingLayout] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [deleteLayoutId, setDeleteLayoutId] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	useEffect(() => {
		goToPage(1);
	}, [searchText, goToPage]);

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

		try {
			const res = await authFetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) throw new Error("Lưu thất bại");

			setShowForm(false);
			setEditingLayout(null);
			mutate();
			addToast("success", editingLayout ? "Cập nhật bố cục thành công!" : "Tạo bố cục mới thành công!");
		} catch (error) {
			addToast("error", "Lưu thất bại, vui lòng kiểm tra lại.");
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
			if (res.ok) {
				mutate();
				addToast("success", "Đã xóa bố cục hiển thị thành công!");
			} else {
				addToast("error", "Xóa thất bại!");
			}
		} catch (err) {
			addToast("error", "Lỗi kết nối đến server!");
		} finally {
			setDeleteLayoutId(null);
			setDeleteStatus("idle");
		}
	};

	if (!rawLayouts) return (
		<div className="w-full h-64 flex items-center justify-center text-gray-400 italic">
			<i className="fa-solid fa-spinner animate-spin mr-2"></i> Đang tải dữ liệu bố cục...
		</div>
	);

	return (
		<div className="px-4 pb-10">
			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
						<FaLayerGroup className="text-indigo-500" /> Bố cục hiển thị
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Hiển thị {filteredLayouts.length} bố cục phù hợp.
					</p>
				</div>

				<LayoutToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					onAdd={handleOpenCreate}
					onSearchFocusChange={setSearchFocused}
				/>
			</div>

			<div
				tabIndex={0}
				onFocus={() => setTableActive(true)}
				onBlur={(e) => {
					if (!e.currentTarget.contains(e.relatedTarget)) {
						setTableActive(false);
					}
				}}
				className="outline-none scroll-mt-4 focus:ring-1 focus:ring-indigo-100 rounded-lg p-1 transition-all"
				ref={paginationRef}
			>
				<LayoutTable
					layouts={paginatedLayouts}
					onEdit={handleOpenEdit}
					onDelete={handleDelete}
				/>

				<div className="flex justify-center">
					<Pagination
						totalItems={filteredLayouts.length}
						itemsPerPage={ITEMS_PER_PAGE}
						currentPage={currentPage}
						onPageChange={(page) => {
							goToPage(page);
							paginationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
						}}
					/>
				</div>
			</div>

			<LayoutFormModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				initialData={editingLayout}
				onSubmit={handleSubmitForm}
			/>

			{/* ✅ SỬA: Chuyển sang ConfirmModal chuyên nghiệp */}
			<ConfirmModal
				open={!!deleteLayoutId}
				title="Xóa bố cục?"
				message="Bạn có chắc chắn muốn xóa bố cục này không? Hành động này không thể hoàn tác."
				confirmText="Xóa ngay"
				variant="danger"
				onCancel={() => setDeleteLayoutId(null)}
				onConfirm={handleDeleteConfirmed}
				isLoading={deleteStatus === "loading"}
			/>
		</div>
	);
}