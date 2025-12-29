"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FaClone } from "react-icons/fa";

// Import Libs & Hooks
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import usePagination from "@/hooks/usePagination";
import { contentAdapter } from "@/data/adapters/contentAdapter";

// Import Components Mới
import { useContentFilters } from "@/hooks/useContentFilters";
import ContentToolbar from "@/components/feature/cards/contents/ContentToolbar";
import Pagination from "@/components/common/Pagination";
import ContentTable from "@/components/feature/cards/contents/ContentTable";
import ContentFormModal from "@/components/feature/cards/contents/ContentFormModal";
export default function CardDetailPage() {
	const { id } = useParams();

	const [card, setCard] = useState(null);
	const [contents, setContents] = useState([]);
	const [loading, setLoading] = useState(true);

	// --- HOOK FILTER ---
	const {
		searchText, setSearchText,
		filters, toggleFilter, clearFilters,
		filteredContents
	} = useContentFilters(contents);

	// Form State
	const [editingIndex, setEditingIndex] = useState(null);
	const [showForm, setShowForm] = useState(false);

	// Pagination 
	const {
		currentPage,
		paginatedData: currentContents,
		goToPage,
	} = usePagination(filteredContents, 4);

	useEffect(() => {
		fetchCard();
	}, [id]);

	async function fetchCard() {
		setLoading(true);
		try {
			const res = await fetch(`${API_BASE_URL}/cards/${id}`);
			if (!res.ok) return;

			const data = await res.json();
			setCard(data);

			if (data.contents) {
				setContents(data.contents.map(c => contentAdapter(c)));
			}
		} catch (err) {
			console.error("❌ fetchCard error:", err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		goToPage(1);
	}, [searchText, filters]);

	const handleOpenCreate = () => {
		setEditingIndex(null);
		setShowForm(true);
	};

	const handleOpenEdit = (content, index) => {
		const originalIndex = contents.findIndex(c => c.url === content.url && c.description === content.description);

		if (originalIndex !== -1) {
			setEditingIndex(originalIndex);
			setShowForm(true);
		}
	};

	const handleDelete = async (index) => {
		if (!confirm("Bạn có chắc muốn xóa nội dung này?")) return;
		const contentToDelete = currentContents[index];
		const originalIndex = contents.findIndex(c => c === contentToDelete);

		if (originalIndex === -1) return;

		const res = await authFetch(
			`${API_BASE_URL}/cards/${id}/contents/${originalIndex}`,
			{ method: "DELETE" }
		);

		if (res.ok) {
			fetchCard();
		} else {
			alert("❌ Xóa thất bại");
		}
	};

	const handleSubmitForm = async (formData) => {
		let finalData = { ...formData };

		if (formData.url instanceof File) {
			const fd = new FormData();
			fd.append("file", formData.url);

			const uploadRes = await authFetch(`${API_BASE_URL}/files/upload`, {
				method: "POST",
				body: fd,
			});

			if (!uploadRes.ok) {
				alert("❌ Upload thất bại");
				return;
			}

			const uploadData = await uploadRes.json();
			finalData.url = uploadData.url;
			finalData.type = uploadData.type || formData.type;
			finalData.qrCode = uploadData.qrImage || uploadData.qrLink || "";

			if (uploadData.type === "pdf" && uploadData.images) {
				finalData.images = uploadData.images;
			}
		}

		const method = editingIndex !== null ? "PUT" : "POST";
		const url = editingIndex !== null
			? `${API_BASE_URL}/cards/${id}/contents/${editingIndex}`
			: `${API_BASE_URL}/cards/${id}/contents`;

		const res = await authFetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(finalData),
		});

		if (res.ok) {
			setShowForm(false);
			setEditingIndex(null);
			fetchCard();
		} else {
			alert("❌ Lưu thất bại");
		}
	};


	if (loading) {
		return (
			<div className="w-full h-96 flex flex-col items-center justify-center">
				<div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
				<p className="text-gray-400 text-sm">Đang tải nội dung...</p>
			</div>
		);
	}

	if (!card) return <p className="p-4 text-red-500">Không tìm thấy thẻ.</p>;

	return (
		<div className="px-4 pb-20">
			{/* HEADER + TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
						<i className={"fa-solid fa-clone"} /> Chi tiết thẻ: {card.title}
					</h1>
					<p className="text-gray-500 text-sm">
						Hiển thị {filteredContents.length} nội dung phù hợp.
					</p>
				</div>

				{/* 👇 TOOLBAR MỚI */}
				<ContentToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					filters={filters}
					toggleFilter={toggleFilter}
					clearFilters={clearFilters}
					onAdd={handleOpenCreate}
				/>
			</div>

			{/* TABLE */}
			{filteredContents.length > 0 ? (
				<>
					<ContentTable
						contents={currentContents}
						onEdit={handleOpenEdit}
						onDelete={handleDelete}
					/>

					{/* PAGINATION */}
					{filteredContents.length > 0 && (
						<div className="mt-6 flex justify-center">
							<Pagination
								totalItems={filteredContents.length}
								itemsPerPage={4}
								currentPage={currentPage}
								onPageChange={goToPage}
							/>
						</div>
					)}
				</>
			) : (
				<div className="bg-white rounded-xl border border-dashed p-10 text-center text-gray-400">
					{contents.length === 0 ? "Chưa có nội dung nào. Hãy thêm mới!" : "Không tìm thấy nội dung phù hợp."}
				</div>
			)}

			{/* FORM MODAL */}
			<ContentFormModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				initialData={editingIndex !== null ? contents[editingIndex] : null}
				onSubmit={handleSubmitForm}
			/>
		</div>
	);
}