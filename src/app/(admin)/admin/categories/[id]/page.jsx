"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

// 1. Libs & Hooks & Adapters
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import usePagination from "@/hooks/usePagination";
import { cardAdapter } from "@/data/adapters/cardAdapter";
import useArrowNavigation from "@/hooks/useArrowNavigation";
import { useToast } from "@/context/ToastContext";

// 2. Import Components
import { useCategoryDetailFilters } from "@/hooks/useCategoryDetailFilters";
import CategoryDetailToolbar from "@/components/feature/categories/detail/CategoryDetailToolbar";
import Pagination from "@/components/common/Pagination";
import CategoryCardTable from "@/components/feature/categories/detail/CategoryCardTable";
import AddCardModal from "@/components/feature/categories/detail/AddCardModal";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function CategoryDetailPage() {
	const { id } = useParams();
	const { addToast } = useToast();

	// --- FETCH DATA ---
	const { data: category, error: catError } = useSWR(
		id ? `${API_BASE_URL}/categories/${id}` : null,
		fetcher
	);

	const { data: rawCards, mutate: mutateCards } = useSWR(
		id ? `${API_BASE_URL}/categories/${id}/cards` : null,
		fetcher
	);

	const { data: rawAllCards } = useSWR(`${API_BASE_URL}/cards`, fetcher);

	// --- CHUẨN HÓA DATA ---
	const cards = useMemo(() => {
		return rawCards ? rawCards.map(c => cardAdapter(c)) : [];
	}, [rawCards]);

	const allCards = useMemo(() => {
		return rawAllCards ? rawAllCards.map(c => cardAdapter(c)) : [];
	}, [rawAllCards]);

	const loading = !category || !rawCards;

	// --- HOOK FILTER & PAGINATION ---
	const { searchText, setSearchText, filteredCards } = useCategoryDetailFilters(cards);

	const ITEMS_PER_PAGE = 4;
	const {
		currentPage,
		paginatedData: currentCards,
		goToPage,
	} = usePagination(filteredCards, ITEMS_PER_PAGE);

	// --- FOCUS MANAGEMENT & ARROW NAVIGATION ---
	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

	const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
	const pagesArray = useMemo(() =>
		Array.from({ length: totalPages }, (_, i) => ({ id: i + 1 })),
		[totalPages]);

	// Hook điều hướng bàn phím ổn định
	useArrowNavigation({
		items: pagesArray,
		activeId: currentPage,
		setActiveId: goToPage,
		direction: "horizontal",
		enabled: tableActive && !searchFocused && totalPages > 1,
	});

	// --- STATE MODAL ---
	const [showAddModal, setShowAddModal] = useState(false);

	// State cho việc Gỡ thẻ (Remove)
	const [removeCardId, setRemoveCardId] = useState(null);
	const [removeStatus, setRemoveStatus] = useState("idle");

	// ⚡ QUAN TRỌNG: Reset về trang 1 khi search (Bỏ goToPage khỏi dependency để ổn định ArrowNav)
	useEffect(() => {
		goToPage(1);
	}, [searchText]);

	// --- HANDLERS ---
	const handleAddCard = async (cardId) => {
		try {
			const res = await authFetch(
				`${API_BASE_URL}/categories/${id}/add-card`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ cardId }),
				}
			);

			if (res.ok) {
				setShowAddModal(false);
				mutateCards();
				addToast("success", "Đã thêm thẻ vào danh mục thành công!");
			} else {
				addToast("error", "Thêm thất bại, vui lòng thử lại.");
			}
		} catch (error) {
			addToast("error", "Lỗi kết nối server!");
		}
	};

	const handleOpenRemove = (cardId) => {
		setRemoveCardId(cardId);
		setRemoveStatus("idle");
	};

	const handleRemoveConfirmed = async () => {
		if (!removeCardId) return;
		setRemoveStatus("deleting");

		try {
			const res = await authFetch(
				`${API_BASE_URL}/categories/${id}/remove-card/${removeCardId}`,
				{ method: "DELETE" }
			);

			if (res.ok) {
				mutateCards();
				addToast("success", "Đã gỡ thẻ khỏi danh mục!");
				setRemoveCardId(null); // Đóng modal ngay
			} else {
				addToast("error", "Gỡ thất bại!");
			}
		} catch (error) {
			addToast("error", "Lỗi kết nối server!");
		} finally {
			setRemoveStatus("idle");
		}
	};

	if (loading) {
		return (
			<div className="w-full h-96 flex flex-col items-center justify-center text-gray-400">
				<div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
				<p className="text-sm italic">Đang tải dữ liệu thẻ...</p>
			</div>
		);
	}

	if (catError) return <div className="p-10 text-center text-red-500 font-bold">❌ Không tìm thấy danh mục</div>;

	return (
		<div className="px-4 pb-10">
			{/* HEADER */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
					<i className={"fa-solid fa-tags text-amber-500"} /> Danh mục: {category.title}
				</h1>
			</div>

			{/* TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<p className="text-gray-500 text-sm pb-2 italic">
					Tìm thấy {filteredCards.length} thẻ trong danh mục.
				</p>

				<CategoryDetailToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					onAdd={() => setShowAddModal(true)}
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
				className="outline-none scroll-mt-4 focus:ring-1 focus:ring-amber-100 rounded-lg p-1 transition-all"
				ref={paginationRef}
			>
				<CategoryCardTable
					cards={currentCards}
					onRemove={handleOpenRemove}
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
			<AddCardModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				allCards={allCards}
				existingCards={cards}
				onAdd={handleAddCard}
			/>

			<ConfirmModal
				open={!!removeCardId}
				title="Gỡ thẻ khỏi danh mục?"
				message="Thẻ này sẽ bị xóa khỏi danh mục hiện tại, nhưng vẫn tồn tại trong hệ thống. Bạn có chắc chắn không?"
				onCancel={() => setRemoveCardId(null)}
				onConfirm={handleRemoveConfirmed}
				isLoading={removeStatus === "deleting"}
			/>
		</div>
	);
}