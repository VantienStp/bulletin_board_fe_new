"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import Link from "next/link";
import { FaArrowLeft, FaFolderOpen } from "react-icons/fa";

// Libs & Hooks & Adapters
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import usePagination from "@/hooks/usePagination";
import { cardAdapter } from "@/data/adapters/cardAdapter";

// Import Mới
import { useCategoryDetailFilters } from "@/hooks/useCategoryDetailFilters";
import CategoryDetailToolbar from "@/components/feature/categories/detail/CategoryDetailToolbar";

// Components
import Pagination from "@/components/common/Pagination";
import CategoryCardTable from "@/components/feature/categories/detail/CategoryCardTable";
import AddCardModal from "@/components/feature/categories/detail/AddCardModal";

export default function CategoryDetailPage() {
	const { id } = useParams();

	const [category, setCategory] = useState(null);
	const [cards, setCards] = useState([]);
	const [allCards, setAllCards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);

	// --- HOOK FILTER ---
	const {
		searchText, setSearchText,
		filteredCards // Dữ liệu đã lọc
	} = useCategoryDetailFilters(cards);

	// Pagination (Dùng filteredCards)
	const {
		currentPage,
		paginatedData: currentCards,
		goToPage,
	} = usePagination(filteredCards, 4);

	useEffect(() => {
		if (!id) return;
		fetchData();
	}, [id]);

	// Reset trang về 1 khi search
	useEffect(() => {
		goToPage(1);
	}, [searchText]);

	async function fetchData() {
		setLoading(true);
		try {
			const catRes = await authFetch(`${API_BASE_URL}/categories/${id}`);
			const catData = await catRes.json();
			setCategory(catData);

			const cardsRes = await authFetch(`${API_BASE_URL}/categories/${id}/cards`);
			const cardsData = await cardsRes.json();
			if (Array.isArray(cardsData)) {
				setCards(cardsData.map(c => cardAdapter(c)));
			}

			const allRes = await authFetch(`${API_BASE_URL}/cards`);
			const allData = await allRes.json();
			if (Array.isArray(allData)) {
				setAllCards(allData.map(c => cardAdapter(c)));
			}

		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

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
			fetchData();
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
			fetchData();
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

	if (!category) return <div className="p-10 text-center">❌ Không tìm thấy danh mục</div>;

	return (
		<div className="px-4 pb-10">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<i className={"fa-solid fa-tags"} />Danh mục: {category.title}
				</h1>


			</div>

			{/* HEADER DƯỚI: THÔNG TIN & TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<p className="text-gray-500 text-sm pb-2">
					Hiển thị {filteredCards.length} thẻ trong danh mục.
				</p>

				{/* 👇 TOOLBAR MỚI NẰM Ở ĐÂY */}
				<CategoryDetailToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					onAdd={() => setShowModal(true)}
				/>
			</div>

			{/* LIST WRAPPER */}
			{/* (Đã bỏ header cũ bên trong bảng để dùng Toolbar bên ngoài) */}
			<CategoryCardTable
				cards={currentCards}
				onRemove={handleRemoveCard}
			/>

			{/* PAGINATION */}
			{filteredCards.length > 0 && (
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