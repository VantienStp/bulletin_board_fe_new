"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr"; // 👈 Import SWR
import { fetcher } from "@/lib/fetcher"; // Import fetcher

import { FaArrowLeft, FaFolderOpen } from "react-icons/fa";
import Link from "next/link"; // Đừng quên import Link nếu dùng nút Back

// Libs & Hooks & Adapters
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import usePagination from "@/hooks/usePagination";
import { cardAdapter } from "@/data/adapters/cardAdapter";

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
	const {
		searchText, setSearchText,
		filteredCards
	} = useCategoryDetailFilters(cards);

	// Pagination
	const {
		currentPage,
		paginatedData: currentCards,
		goToPage,
	} = usePagination(filteredCards, 4);

	// Reset trang về 1 khi search
	useEffect(() => {
		goToPage(1);
	}, [searchText]);

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
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<FaFolderOpen className="text-yellow-500" /> Danh mục: {category.title}
				</h1>

				<Link
					href="/admin/categories"
					className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 flex items-center gap-2 transition"
				>
					<FaArrowLeft /> Quay lại
				</Link>
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
				/>
			</div>

			{/* LIST WRAPPER */}
			<CategoryCardTable
				cards={currentCards}
				onRemove={handleRemoveCard}
			/>

			{/* PAGINATION */}
			{filteredCards.length > 4 && (
				<div className="mt-6 flex justify-center">
					<Pagination
						totalItems={filteredCards.length}
						itemsPerPage={4}
						currentPage={currentPage}
						onPageChange={goToPage}
					/>
				</div>
			)}

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