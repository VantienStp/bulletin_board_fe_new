"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

// Components
import ConfirmModal from "@/components/common/ConfirmModal";
import Pagination from "@/components/common/Pagination";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { cardAdapter } from "@/data/adapters/cardAdapter";

// Hooks
import { useCardFilters } from "@/hooks/useCardFilters";
import usePagination from "@/hooks/usePagination";
import useArrowNavigation from "@/hooks/useArrowNavigation";
import { useToast } from "@/context/ToastContext";

// Feature Components
import CardToolbar from "@/components/feature/cards/CardToolbar";
import CardTable from "@/components/feature/cards/CardTable";
import CardFormModal from "@/components/feature/cards/CardFormModal";

export default function CardsPage() {
	// 1. Fetch dữ liệu với SWR
	const { data: rawCards, mutate } = useSWR(`${API_BASE_URL}/cards`, fetcher);
	const { addToast } = useToast();

	// 2. Chuẩn hóa dữ liệu (Dùng useMemo để ổn định tham chiếu allCards)
	const allCards = useMemo(() => {
		return rawCards ? rawCards.map(item => cardAdapter(item)) : [];
	}, [rawCards]);

	// 3. Logic Lọc dữ liệu
	const {
		searchText, setSearchText,
		filters, toggleFilter, clearFilters,
		filteredCards
	} = useCardFilters(allCards);

	// 4. Logic Phân trang
	const ITEMS_PER_PAGE = 5;
	const {
		currentPage,
		paginatedData: paginatedCards,
		goToPage
	} = usePagination(filteredCards, ITEMS_PER_PAGE);

	// 5. Quản lý Focus và Điều hướng phím mũi tên
	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

	const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
	const pagesArray = useMemo(() =>
		Array.from({ length: totalPages }, (_, i) => ({ id: i + 1 })),
		[totalPages]);

	// Hook điều hướng bằng phím Left/Right
	useArrowNavigation({
		items: pagesArray,
		activeId: currentPage,
		setActiveId: goToPage,
		direction: "horizontal",
		enabled: tableActive && !searchFocused && totalPages > 1,
	});

	// 6. State Form & Xóa
	const [editingCard, setEditingCard] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [deleteCardId, setDeleteCardId] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	useEffect(() => {
		goToPage(1);
	}, [searchText, filters]);

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

		try {
			const res = await authFetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!res.ok) throw new Error("Lỗi khi lưu");

			setShowForm(false);
			setEditingCard(null);
			mutate();
			addToast("success", editingCard ? "Cập nhật thẻ thành công!" : "Tạo thẻ mới thành công!");
		} catch (error) {
			addToast("error", "Có lỗi xảy ra, vui lòng thử lại.");
		}
	};

	const handleOpenDelete = (id) => {
		setDeleteCardId(id);
		setDeleteStatus("confirming");
	};

	const handleDeleteConfirmed = async () => {
		if (!deleteCardId) return;
		setDeleteStatus("deleting");

		try {
			const res = await authFetch(`${API_BASE_URL}/cards/${deleteCardId}`, { method: "DELETE" });

			if (res.ok) {
				setDeleteCardId(null);
				setDeleteStatus("idle");
				mutate();
				addToast("success", "Đã xóa thẻ nội dung thành công!");
			} else {
				setDeleteStatus("idle");
				setDeleteCardId(null);
				addToast("error", "Xóa thất bại!");
			}
		} catch (error) {
			setDeleteStatus("idle");
			setDeleteCardId(null);
			addToast("error", "Lỗi kết nối đến server!");
		}
	};

	return (
		<div className="px-4 pb-10">
			{/* HEADER & TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<i className={"fa-solid fa-clone"} /> Thẻ nội dung
					</h1>
					<p className="text-sm text-gray-500 mt-1">
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

			{/* VÙNG FOCUS CHO ĐIỀU HƯỚNG BÀN PHÍM */}
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

			<ConfirmModal
				open={!!deleteCardId}
				title="Xóa thẻ nội dung"
				message="Hành động này sẽ xóa thẻ và toàn bộ file đính kèm..."
				onCancel={() => {
					if (deleteStatus !== "deleting") setDeleteCardId(null);
				}}
				onConfirm={handleDeleteConfirmed}
				isLoading={deleteStatus === "deleting"}
			/>
		</div>
	);
}