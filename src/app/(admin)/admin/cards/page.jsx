"use client";

import { useState, useRef, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

import DeleteModal from "@/components/common/DeleteModal";
import Pagination from "@/components/common/Pagination";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { cardAdapter } from "@/data/adapters/cardAdapter";

import { useCardFilters } from "@/hooks/useCardFilters";
import CardToolbar from "@/components/feature/cards/CardToolbar";
import CardTable from "@/components/feature/cards/CardTable";
import CardFormModal from "@/components/feature/cards/CardFormModal";

export default function CardsPage() {
	// 1. Dùng SWR để fetch và cache data
	const { data: rawCards, mutate } = useSWR(`${API_BASE_URL}/cards`, fetcher);

	// 2. Chuẩn hóa data
	const allCards = rawCards ? rawCards.map(item => cardAdapter(item)) : [];

	const {
		searchText, setSearchText,
		filters, toggleFilter, clearFilters,
		filteredCards
	} = useCardFilters(allCards);

	const [editingCard, setEditingCard] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [deleteCardId, setDeleteCardId] = useState(null);
	const [deleteStatus, setDeleteStatus] = useState("idle");

	const itemsPerPage = 6;
	const [currentPage, setCurrentPage] = useState(1);
	const paginationRef = useRef(null);

	useEffect(() => {
		setCurrentPage(1);
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
				mutate(); // Reload data ngầm
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

	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedCards = filteredCards.slice(startIndex, startIndex + itemsPerPage);

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
				/>
			</div>

			<CardTable
				cards={paginatedCards}
				onEdit={handleOpenEdit}
				onDelete={handleOpenDelete}
			/>

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