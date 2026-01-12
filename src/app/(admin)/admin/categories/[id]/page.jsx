"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr"; // 👈 Import SWR
import { fetcher } from "@/lib/fetcher"; // Import fetcher

// Libs & Hooks & Adapters
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { cardAdapter } from "@/data/adapters/cardAdapter";

import usePagination from "@/hooks/usePagination";
import useArrowNavigation from "@/hooks/useArrowNavigation";

// Import Components
import { useCategoryDetailFilters } from "@/hooks/useCategoryDetailFilters";
import CategoryDetailToolbar from "@/components/feature/categories/detail/CategoryDetailToolbar";
import Pagination from "@/components/common/Pagination";
import CategoryCardTable from "@/components/feature/categories/detail/CategoryCardTable";
import AddCardModal from "@/components/feature/categories/detail/AddCardModal";

export default function CategoryDetailPage() {
	const { id } = useParams();

	// Fetch Category Detail
	const { data: category, error: catError } = useSWR(
		id ? `${API_BASE_URL}/categories/${id}` : null,
		fetcher
	);

	// Fetch Cards trong Category 
	const { data: rawCards, mutate: mutateCards } = useSWR(
		id ? `${API_BASE_URL}/categories/${id}/cards` : null,
		fetcher
	);

	const { data: rawAllCards } = useSWR(`${API_BASE_URL}/cards`, fetcher);

	// --- CHUẨN HÓA DATA ---
	const cards = rawCards ? rawCards.map(c => cardAdapter(c)) : [];
	const allCards = rawAllCards ? rawAllCards.map(c => cardAdapter(c)) : [];

	const loading = !category || !rawCards;
	const [showModal, setShowModal] = useState(false);

	// --- HOOK FILTER ---
	const { searchText, setSearchText, filteredCards } = useCategoryDetailFilters(cards);

	// Hook Pagination
	const ITEMS_PER_PAGE = 4;
	const {
		currentPage,
		paginatedData: currentCards,
		goToPage,
	} = usePagination(filteredCards, ITEMS_PER_PAGE);

	// --- 3. STATE CHIA VÙNG (CONTEXT AWARE) ---
	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

	// --- 4. CẤU HÌNH NAVIGATION ---
	const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
	const pagesArray = useMemo(() =>
		Array.from({ length: totalPages }, (_, i) => ({ id: i + 1 })),
		[totalPages]);

	useArrowNavigation({
		items: pagesArray,
		activeId: currentPage,
		setActiveId: goToPage,
		direction: "horizontal",
		// Logic: Bật khi focus bảng + KHÔNG focus search + có nhiều trang
		enabled: tableActive && !searchFocused && totalPages > 1,
	});

	// Reset trang về 1 khi search
	useEffect(() => { goToPage(1); }, [searchText]);

	// --- HANDLERS ---
	const handleAddCard = async (cardId) => {
		const res = await authFetch(
			`${API_BASE_URL}/categories/${id}/add-card`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ cardId }),
			}
		);

		if (res.ok) {
			setShowModal(false);
			mutateCards();
			alert("✅ Thêm thành công");
		} else {
			alert("❌ Thêm thất bại");
		}
	};

	const handleRemoveCard = async (cardId) => {
		if (!confirm("Bạn có chắc muốn gỡ thẻ này khỏi danh mục?")) return;

		const res = await authFetch(
			`${API_BASE_URL}/categories/${id}/remove-card/${cardId}`,
			{ method: "DELETE" }
		);

		if (res.ok) {
			mutateCards();
			alert("✅ Gỡ thành công");
		} else {
			alert("❌ Gỡ thất bại");
		}
	};

	if (loading) {
		return (
			<div className="w-full h-96 flex flex-col items-center justify-center">
				<div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
				<p className="text-gray-400 text-sm">Đang tải dữ liệu...</p>
			</div>
		);
	}

	if (catError) return <div className="p-10 text-center text-red-500">❌ Không tìm thấy danh mục</div>;

	return (
		<div className="px-4 pb-10">
			{/* HEADER */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<i className={"fa-solid fa-tags"} /> Danh mục: {category.title}
				</h1>
			</div>

			{/* HEADER DƯỚI: THÔNG TIN & TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<p className="text-gray-500 text-sm pb-2">
					Hiển thị {filteredCards.length} thẻ trong danh mục.
				</p>

				<CategoryDetailToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					onAdd={() => setShowModal(true)}
					// 5. Truyền hàm bắt sự kiện focus
					onSearchFocusChange={setSearchFocused}
				/>
			</div>

			{/* 6. BỌC VÙNG BẢNG (FOCUS AREA) */}
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
				{/* LIST WRAPPER */}
				<CategoryCardTable
					cards={currentCards}
					onRemove={handleRemoveCard}
				/>

				{/* PAGINATION */}
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

			{/* ADD MODAL */}
			<AddCardModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				allCards={allCards}
				existingCards={cards}
				onAdd={handleAddCard}
			/>
		</div>
	);
}