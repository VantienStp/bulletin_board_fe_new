"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr"; // 👈 Import SWR
import { fetcher } from "@/lib/fetcher"; // Import fetcher

// Import Libs & Hooks
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import usePagination from "@/hooks/usePagination";
import { contentAdapter } from "@/data/adapters/contentAdapter";

// Import Components & Hooks Mới
import { useContentFilters } from "@/hooks/useContentFilters";
import ContentToolbar from "@/components/feature/cards/contents/ContentToolbar";
import Pagination from "@/components/common/Pagination";
import ContentTable from "@/components/feature/cards/contents/ContentTable";
import ContentFormModal from "@/components/feature/cards/contents/ContentFormModal";

export default function CardDetailPage() {
	const { id } = useParams();

	const { data: rawCard, error, isLoading, mutate } = useSWR(
		id ? `${API_BASE_URL}/cards/${id}` : null,
		fetcher
	);

	const contents = rawCard?.contents ? rawCard.contents.map(c => contentAdapter(c)) : [];

	// --- HOOK FILTER \
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
		goToPage(1);
	}, [searchText, filters]);

	// --- HANDLERS ---

	const handleOpenCreate = () => {
		setEditingIndex(null);
		setShowForm(true);
	};

	const handleOpenEdit = (content) => {
		const idx = contents.findIndex(c => c === content);
		if (idx !== -1) {
			setEditingIndex(idx);
			setShowForm(true);
		}
	};

	const handleDelete = async (currentIndex) => {
		if (!confirm("Bạn có chắc muốn xóa nội dung này?")) return;
		const contentToDelete = currentContents[currentIndex];

		const originalIndex = contents.findIndex(c => c === contentToDelete);

		if (originalIndex === -1) return;

		try {
			const res = await authFetch(
				`${API_BASE_URL}/cards/${id}/contents/${originalIndex}`,
				{ method: "DELETE" }
			);

			if (res.ok) {
				mutate();
				alert("✅ Đã xóa thành công");
			} else {
				alert("❌ Xóa thất bại");
			}
		} catch (error) {
			console.error(error);
			alert("❌ Lỗi kết nối");
		}
	};

	const handleSubmitForm = async (formData) => {
		let finalData = { ...formData };

		if (formData.url instanceof File) {
			const fd = new FormData();
			fd.append("file", formData.url);

			try {
				const uploadRes = await authFetch(`${API_BASE_URL}/files/upload`, {
					method: "POST",
					body: fd,
				});

				if (!uploadRes.ok) throw new Error("Upload failed");

				const uploadData = await uploadRes.json();
				finalData.url = uploadData.url;
				finalData.type = uploadData.type || formData.type;
				finalData.qrCode = uploadData.qrImage || uploadData.qrLink || "";

				if (uploadData.type === "pdf" && uploadData.images) {
					finalData.images = uploadData.images;
				}
			} catch (error) {
				alert("❌ Upload thất bại");
				return;
			}
		}

		const method = editingIndex !== null ? "PUT" : "POST";
		const url = editingIndex !== null
			? `${API_BASE_URL}/cards/${id}/contents/${editingIndex}`
			: `${API_BASE_URL}/cards/${id}/contents`;

		try {
			const res = await authFetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(finalData),
			});

			if (res.ok) {
				setShowForm(false);
				setEditingIndex(null);
				mutate(); // 👈 Reload data bằng SWR
			} else {
				alert("❌ Lưu thất bại");
			}
		} catch (error) {
			alert("❌ Lỗi kết nối");
		}
	};

	if (isLoading) {
		return (
			<div className="w-full h-96 flex flex-col items-center justify-center">
				<div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
				<p className="text-gray-400 text-sm">Đang tải nội dung...</p>
			</div>
		);
	}

	if (error || !rawCard) return <p className="p-10 text-center text-red-500">❌ Không tìm thấy thẻ hoặc lỗi tải dữ liệu.</p>;

	return (
		<div className="px-4 pb-20">
			{/* HEADER + TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
						<i className={"fa-solid fa-clone"} /> Chi tiết thẻ: {rawCard.title}
					</h1>
					<p className="text-gray-500 text-sm">
						Hiển thị {filteredContents.length} nội dung phù hợp.
					</p>
				</div>

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
					{filteredContents.length > 4 && (
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
				// Lấy data từ mảng gốc (contents) dựa trên editingIndex
				initialData={editingIndex !== null ? contents[editingIndex] : null}
				onSubmit={handleSubmitForm}
			/>
		</div>
	);
}