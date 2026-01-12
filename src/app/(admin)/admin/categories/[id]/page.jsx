"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

// Libs & Hooks & Adapters
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import usePagination from "@/hooks/usePagination";
import { cardAdapter } from "@/data/adapters/cardAdapter";
import useArrowNavigation from "@/hooks/useArrowNavigation";

// Import Components
import { useCategoryDetailFilters } from "@/hooks/useCategoryDetailFilters";
import CategoryDetailToolbar from "@/components/feature/categories/detail/CategoryDetailToolbar";
import Pagination from "@/components/common/Pagination";
import CategoryCardTable from "@/components/feature/categories/detail/CategoryCardTable";
import AddCardModal from "@/components/feature/categories/detail/AddCardModal";
import DeleteModal from "@/components/common/DeleteModal"; // 1. Import Modal Xóa

// 2. Import Toast System
import Toast from "@/components/ui/Toast";
import ToastContainer from "@/components/ui/ToastContainer";

export default function CategoryDetailPage() {
	const { id } = useParams();

	// Fetch Data
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

	// --- FOCUS MANAGEMENT ---
	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

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

	// --- 3. TOAST STATE ---
	const [toasts, setToasts] = useState([]);

	const addToast = (type, message) => {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, type, message }]);
	};

	const removeToast = (id) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	// --- STATE MODAL ---
	const [showAddModal, setShowAddModal] = useState(false);

	// State cho việc Gỡ thẻ (Remove)
	const [removeCardId, setRemoveCardId] = useState(null);
	const [removeStatus, setRemoveStatus] = useState("idle");

	useEffect(() => { goToPage(1); }, [searchText]);

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

	// Bước 1: Mở modal xác nhận
	const handleOpenRemove = (cardId) => {
		setRemoveCardId(cardId);
		setRemoveStatus("confirming");
	};

	// Bước 2: Xử lý xóa thật
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
				setRemoveCardId(null);
				setRemoveStatus("idle");
				addToast("success", "Đã gỡ thẻ khỏi danh mục!");
			} else {
				setRemoveStatus("idle");
				setRemoveCardId(null);
				addToast("error", "Gỡ thất bại!");
			}
		} catch (error) {
			setRemoveStatus("idle");
			setRemoveCardId(null);
			addToast("error", "Lỗi kết nối server!");
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
			{/* 4. TOAST CONTAINER */}
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
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<i className={"fa-solid fa-tags"} /> Danh mục: {category.title}
				</h1>
			</div>

			{/* TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<p className="text-gray-500 text-sm pb-2">
					Hiển thị {filteredCards.length} thẻ trong danh mục.
				</p>

				<CategoryDetailToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					onAdd={() => setShowAddModal(true)}
					onSearchFocusChange={setSearchFocused}
				/>
			</div>

			{/* TABLE AREA */}
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
				<CategoryCardTable
					cards={currentCards}
					onRemove={handleOpenRemove} // Gọi hàm mở modal thay vì confirm
				/>

				<div className="flex justify-center mt-6">
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

			{/* ADD CARD MODAL */}
			<AddCardModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				allCards={allCards}
				existingCards={cards}
				onAdd={handleAddCard}
			/>

			{/* 5. DELETE CONFIRMATION MODAL */}
			<DeleteModal
				open={!!removeCardId}
				title="Gỡ thẻ khỏi danh mục?"
				message="Thẻ này sẽ bị xóa khỏi danh mục hiện tại, nhưng vẫn tồn tại trong hệ thống. Bạn có chắc chắn không?"
				onCancel={() => setRemoveCardId(null)}
				onConfirm={handleRemoveConfirmed}
			/>
		</div>
	);
}