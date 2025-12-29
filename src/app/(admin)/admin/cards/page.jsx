"use client";

import { useEffect, useState, useRef } from "react";
import { FaClone } from "react-icons/fa";
import DeleteModal from "@/components/common/DeleteModal";
import Pagination from "@/components/common/Pagination";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { cardAdapter } from "@/data/adapters/cardAdapter";

// Import mới
import { useCardFilters } from "@/hooks/useCardFilters";
import CardToolbar from "@/components/feature/cards/CardToolbar";
import CardTable from "@/components/feature/cards/CardTable";
import CardFormModal from "@/components/feature/cards/CardFormModal";

export default function CardsPage() {
	const [allCards, setAllCards] = useState([]); // Chứa toàn bộ data từ API

	// Dùng Hook Filter
	const {
		searchText, setSearchText,
		filters, toggleFilter, clearFilters,
		filteredCards // Data đã được lọc
	} = useCardFilters(allCards);

	// State Form & Delete
	const [editingCard, setEditingCard] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [deleteCardId, setDeleteCardId] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	// Pagination
	const itemsPerPage = 6;
	const [currentPage, setCurrentPage] = useState(1);
	const paginationRef = useRef(null);

	useEffect(() => {
		fetchCards();
	}, []);

	// Reset trang về 1 khi search/filter thay đổi
	useEffect(() => {
		setCurrentPage(1);
	}, [searchText, filters]);

	async function fetchCards() {
		try {
			const res = await fetch(`${API_BASE_URL}/cards`);
			const rawData = await res.json();
			if (Array.isArray(rawData)) {
				const cleanData = rawData.map(item => cardAdapter(item));
				setAllCards(cleanData); // Lưu vào state gốc
			}
		} catch (err) {
			console.error(err);
		}
	}

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
		fetchCards();
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
				setAllCards((prev) => prev.filter((c) => c.id !== deleteCardId));
				alert("✅ Đã xóa thẻ thành công!");
				setDeleteCardId(null);
				setDeleteStatus("idle");
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

	// --- PHÂN TRANG TRÊN DATA ĐÃ LỌC ---
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);

	return (
		<div className="px-4 pb-10">
			{/* HEADER + TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
						<FaClone /> Thẻ nội dung
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
				/>
			</div>

			{/* TABLE */}
			<CardTable
				cards={paginatedCards}
				onEdit={handleOpenEdit}
				onDelete={handleOpenDelete}
			/>

			{/* PAGINATION */}
			{filteredCards.length > itemsPerPage && (
				<div ref={paginationRef} className=" flex justify-center">
					<Pagination
						totalItems={filteredCards.length}
						itemsPerPage={itemsPerPage}
						currentPage={currentPage}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}

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