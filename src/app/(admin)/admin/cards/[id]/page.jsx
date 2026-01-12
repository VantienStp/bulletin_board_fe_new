"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

// 1. Libs & Adapters
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { contentAdapter } from "@/data/adapters/contentAdapter";

// 2. Hooks
import usePagination from "@/hooks/usePagination";
import useArrowNavigation from "@/hooks/useArrowNavigation";
import { useContentFilters } from "@/hooks/useContentFilters";

// 3. Components
import ContentToolbar from "@/components/feature/cards/contents/ContentToolbar";
import ContentTable from "@/components/feature/cards/contents/ContentTable";
import ContentFormModal from "@/components/feature/cards/contents/ContentFormModal";
import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";

// 4. Import Toast System
import Toast from "@/components/ui/Toast";
import ToastContainer from "@/components/ui/ToastContainer";

export default function CardDetailPage() {
	const { id } = useParams();

	// --- FETCH DATA ---
	const { data: card, error, isLoading, mutate } = useSWR(
		id ? `${API_BASE_URL}/cards/${id}` : null,
		fetcher
	);

	// --- CHUẨN HÓA DATA ---
	const contents = useMemo(() => {
		if (!card?.contents) return [];
		return card.contents.map(c => contentAdapter(c));
	}, [card]);

	// --- FILTER & PAGINATION ---
	const { searchText, setSearchText, filteredContents } = useContentFilters(contents);

	const ITEMS_PER_PAGE = 5;
	const {
		currentPage,
		paginatedData: currentContents,
		goToPage,
	} = usePagination(filteredContents, ITEMS_PER_PAGE);

	// --- FOCUS MANAGEMENT ---
	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

	const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE);
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

	// --- 5. TOAST STATE ---
	const [toasts, setToasts] = useState([]);

	const addToast = (type, message) => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, type, message }]);
	};

	const removeToast = (id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	// Reset về trang 1 khi search
	useEffect(() => { goToPage(1); }, [searchText]);

	// --- MODAL STATE ---
	const [showForm, setShowForm] = useState(false);
	const [editingContent, setEditingContent] = useState(null);

	// State Delete
	const [deleteContentId, setDeleteContentId] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	// --- HANDLERS ---
	const handleOpenAdd = () => {
		setEditingContent(null);
		setShowForm(true);
	};

	const handleOpenEdit = (content) => {
		setEditingContent(content);
		setShowForm(true);
	};

	const handleSubmit = async (formData) => {
		const method = editingContent ? "PUT" : "POST";

		const url = editingContent
			? `${API_BASE_URL}/cards/${id}/contents/${editingContent.id}`
			: `${API_BASE_URL}/cards/${id}/contents`;

		try {
			const res = await authFetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				setShowForm(false);
				mutate();
				addToast("success", editingContent ? "Cập nhật nội dung thành công!" : "Thêm nội dung mới thành công!");
			} else {
				addToast("error", "Có lỗi xảy ra, vui lòng thử lại.");
			}
		} catch (err) {
			console.error(err);
			addToast("error", "Lỗi kết nối đến server!");
		}
	};

	const handleOpenDelete = (contentOrIndex) => {
		if (typeof contentOrIndex === 'object' && contentOrIndex.id) {
			setDeleteContentId(contentOrIndex.id);
			setDeleteStatus("idle");
		}
		else if (typeof contentOrIndex === 'number') {
			const content = currentContents[contentOrIndex];
			if (content) setDeleteContentId(content.id);
		}
	};

	const handleDeleteConfirmed = async () => {
		if (deleteContentId === null) return;
		setDeleteStatus("deleting");

		try {
			const res = await authFetch(`${API_BASE_URL}/cards/${id}/contents/${deleteContentId}`, {
				method: "DELETE",
			});

			if (res.ok) {
				setDeleteContentId(null);
				setDeleteStatus("idle");
				mutate();
				addToast("success", "Đã xóa nội dung thành công!");
			} else {
				setDeleteStatus("idle");
				setDeleteContentId(null);
				addToast("error", "Xóa thất bại, vui lòng thử lại.");
			}
		} catch (error) {
			setDeleteStatus("idle");
			setDeleteContentId(null);
			addToast("error", "Lỗi kết nối đến server!");
		}
	};

	if (isLoading) {
		return (
			<div className="w-full h-96 flex flex-col items-center justify-center">
				<div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
				<p className="text-gray-400 text-sm">Đang tải dữ liệu...</p>
			</div>
		);
	}

	if (error || !card) return <div className="p-10 text-center text-red-500">❌ Không tìm thấy thẻ</div>;

	return (
		<div className="px-4 pb-20">
			{/* 6. TOAST CONTAINER */}
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
			<div className="flex justify-between items-center mb-1">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<i className="fa-solid fa-layer-group" /> Chi tiết thẻ: {card.title}
				</h1>
			</div>

			{/* INFO & TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<p className="text-gray-500 text-sm pb-2">
					Quản lý {filteredContents.length} nội dung hiển thị.
				</p>

				<ContentToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					onAdd={handleOpenAdd}
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
				className="outline-none scroll-mt-4"
				ref={paginationRef}
			>
				<ContentTable
					contents={currentContents}
					onEdit={handleOpenEdit}
					onDelete={handleOpenDelete}
				/>

				<div className="flex justify-center mt-6">
					<Pagination
						totalItems={filteredContents.length}
						itemsPerPage={ITEMS_PER_PAGE}
						currentPage={currentPage}
						onPageChange={(page) => {
							goToPage(page);
							paginationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
						}}
					/>
				</div>
			</div>

			<ContentFormModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				initialData={editingContent}
				onSubmit={handleSubmit}
			/>

			<DeleteModal
				open={deleteContentId !== null}
				title="Xóa nội dung?"
				message="Bạn có chắc chắn muốn xóa nội dung này không? Hành động này không thể hoàn tác."
				onCancel={() => setDeleteContentId(null)}
				onConfirm={handleDeleteConfirmed}
				isLoading={deleteStatus === "deleting"}
			/>
		</div>
	);
}