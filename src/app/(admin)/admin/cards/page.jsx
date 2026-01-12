"use client";

import { useState, useRef, useEffect, useMemo } from "react"; // 1. Thêm useMemo
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

// Components
import DeleteModal from "@/components/common/DeleteModal";
import Pagination from "@/components/common/Pagination"; // Component hiển thị
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { cardAdapter } from "@/data/adapters/cardAdapter";

// Hooks
import { useCardFilters } from "@/hooks/useCardFilters";
import usePagination from "@/hooks/usePagination";
import useArrowNavigation from "@/hooks/useArrowNavigation";

// Feature Components
import CardToolbar from "@/components/feature/cards/CardToolbar";
import CardTable from "@/components/feature/cards/CardTable";
import CardFormModal from "@/components/feature/cards/CardFormModal";

export default function CardsPage() {
	// 1. Fetch Data
	const { data: rawCards, mutate } = useSWR(`${API_BASE_URL}/cards`, fetcher);

	// 2. Tối ưu: Chỉ map lại khi rawCards thay đổi (Tránh lag khi gõ phím)
	const allCards = useMemo(() => {
		return rawCards ? rawCards.map(item => cardAdapter(item)) : [];
	}, [rawCards]);

	// 3. Hook Filter
	const {
		searchText, setSearchText,
		filters, toggleFilter, clearFilters,
		filteredCards
	} = useCardFilters(allCards);

	// 4. Hook Pagination (Thay thế code thủ công cũ)
	const ITEMS_PER_PAGE = 6;
	const {
		currentPage,
		paginatedData: paginatedCards,
		goToPage
	} = usePagination(filteredCards, ITEMS_PER_PAGE);

	// --- 2. STATE CHIA VÙNG (CONTEXT AWARE) ---
	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

	// --- 3. CẤU HÌNH NAVIGATION ---
	const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
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

	// State Form & Delete
	const [editingCard, setEditingCard] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [deleteCardId, setDeleteCardId] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	// Reset trang khi search
	useEffect(() => {
		goToPage(1);
	}, [searchText, filters]);

	// --- HANDLERS ---
	const handleOpenCreate = () => {
		setEditingCard(null);
		setShowForm(true);
	};

	const handleOpenEdit = (card) => {
		setEditingCard(card);
		setShowForm(true);
	};

	const handleSubmitForm = async (formData) => {
		const method = editingCard ? "PUT" : "POST";
		const url = editingCard
			? `${API_BASE_URL}/cards/${editingCard.id}`
			: `${API_BASE_URL}/cards`;

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
		setEditingCard(null);
		mutate(); // Reload data ngầm
	};

	const handleOpenDelete = (id) => {
		setDeleteCardId(id);
		setDeleteStatus("confirming");
	};

	async function handleDeleteConfirmed() {
		if (!deleteCardId) return;
		setDeleteStatus("deleting");

		try {
			const res = await authFetch(`${API_BASE_URL}/cards/${deleteCardId}`, { method: "DELETE" });

			if (res.ok) {
				alert("✅ Đã xóa thẻ thành công!");
				setDeleteCardId(null);
				setDeleteStatus("idle");
				mutate();
			} else {
				const errorData = await res.json();
				alert(`❌ ${errorData.message || "Xóa thất bại!"}`);
				setDeleteStatus("idle");
				setDeleteCardId(null);
			}
		} catch (error) {
			alert("❌ Lỗi kết nối đến server!");
			setDeleteStatus("idle");
			setDeleteCardId(null);
		}
	}

	return (
		<div className="px-4 pb-10">
			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<i className={"fa-solid fa-clone"} /> Thẻ nội dung
					</h1>
					<p className="text-sm text-gray-500 mt-2">
						Hiển thị {filteredCards.length} thẻ phù hợp.
					</p>
				</div>

				<CardToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					filters={filters}
					toggleFilter={toggleFilter}
					clearFilters={clearFilters}
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
				<CardTable
					cards={paginatedCards}
					onEdit={handleOpenEdit}
					onDelete={handleOpenDelete}
				/>

				<div className="flex justify-center">
					<Pagination
						totalItems={filteredCards.length}
						itemsPerPage={ITEMS_PER_PAGE}
						currentPage={currentPage}
						onPageChange={(page) => {
							goToPage(page);
							paginationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
						}}
					/>
				</div>
			</div>

			{/* MODALS */}
			<CardFormModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				initialData={editingCard}
				onSubmit={handleSubmitForm}
			/>

			<DeleteModal
				open={!!deleteCardId}
				title="Xóa thẻ nội dung"
				message="Hành động này sẽ xóa thẻ và toàn bộ file đính kèm vĩnh viễn khỏi server. Bạn có chắc chắn không?"
				onCancel={() => setDeleteCardId(null)}
				onConfirm={handleDeleteConfirmed}
			/>
		</div>
	);
}