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
import { useToast } from "@/context/ToastContext";

// 3. Components
import ContentToolbar from "@/components/feature/cards/contents/ContentToolbar";
import ContentTable from "@/components/feature/cards/contents/ContentTable";
import ContentFormModal from "@/components/feature/cards/contents/ContentFormModal";
import Pagination from "@/components/common/Pagination";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function CardDetailPage() {
	const { id } = useParams();
	const { addToast } = useToast();

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

	// --- FOCUS MANAGEMENT & ARROW NAVIGATION ---
	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

	const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE);
	const pagesArray = useMemo(() =>
		Array.from({ length: totalPages }, (_, i) => ({ id: i + 1 })),
		[totalPages]);

	// Hook điều hướng bàn phím (Left/Right)
	useArrowNavigation({
		items: pagesArray,
		activeId: currentPage,
		setActiveId: goToPage,
		direction: "horizontal",
		enabled: tableActive && !searchFocused && totalPages > 1,
	});

	// ⚡ QUAN TRỌNG: Reset về trang 1 khi search (Bỏ goToPage khỏi dependencies)
	useEffect(() => {
		goToPage(1);
	}, [searchText]);

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
			addToast("error", "Lỗi kết nối đến server!");
		}
	};

	const handleOpenDelete = (contentOrIndex) => {
		if (typeof contentOrIndex === 'object' && contentOrIndex.id) {
			setDeleteContentId(contentOrIndex.id);
		} else if (typeof contentOrIndex === 'number') {
			const content = currentContents[contentOrIndex];
			if (content) setDeleteContentId(content.id);
		}
		setDeleteStatus("idle");
	};

	const handleDeleteConfirmed = async () => {
		if (deleteContentId === null) return;
		setDeleteStatus("deleting");

		try {
			const res = await authFetch(`${API_BASE_URL}/cards/${id}/contents/${deleteContentId}`, {
				method: "DELETE",
			});

			if (res.ok) {
				mutate();
				addToast("success", "Đã xóa nội dung thành công!");
				setDeleteContentId(null); // Đóng modal ngay
			} else {
				addToast("error", "Xóa thất bại, vui lòng thử lại.");
			}
		} catch (error) {
			addToast("error", "Lỗi kết nối đến server!");
		} finally {
			setDeleteStatus("idle");
		}
	};

	if (isLoading) {
		return (
			<div className="w-full h-96 flex flex-col items-center justify-center text-gray-400">
				<i className="fa-solid fa-spinner animate-spin text-2xl mb-4 text-black"></i>
				<p className="text-sm">Đang tải dữ liệu nội dung...</p>
			</div>
		);
	}

	if (error || !card) return <div className="p-10 text-center text-red-500 font-bold">❌ Không tìm thấy thông tin thẻ</div>;

	return (
		<div className="px-4 pb-20">

			{/* INFO & TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<i className="fa-solid fa-layer-group" /> Chi tiết thẻ: {card.title}
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Đang hiển thị {filteredContents.length} nội dung.
					</p>
				</div>

				<ContentToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					onAdd={handleOpenAdd}
					onSearchFocusChange={setSearchFocused}
				/>
			</div>

			{/* TABLE AREA WITH FOCUS MANAGEMENT */}
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

				<div className="flex justify-center">
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

			<ConfirmModal
				open={deleteContentId !== null}
				title="Xóa nội dung?"
				message="Dữ liệu này sẽ biến mất vĩnh viễn. Bạn có chắc chắn không?"
				onCancel={() => setDeleteContentId(null)}
				onConfirm={handleDeleteConfirmed}
				isLoading={deleteStatus === "deleting"}
			/>
		</div>
	);
}