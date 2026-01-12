"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

// 1. Libs & Adapters
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";
import { contentAdapter } from "@/data/adapters/contentAdapter";

// 2. Hooks
import usePagination from "@/hooks/usePagination";
import useArrowNavigation from "@/hooks/useArrowNavigation";
import { useContentFilters } from "@/hooks/useContentFilters";

// 3. Components
import ContentToolbar from "@/components/feature/cards/contents/ContentToolbar";
import ContentTable from "@/components/feature/cards/contents/ContentTable";
import ContentFormModal from "@/components/feature/cards/contents/ContentFormModal";
import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";

export default function CardDetailPage() {
	const { id } = useParams();

	// --- FETCH DATA (QUAY VỀ CÁCH CŨ: CHỈ GỌI 1 API) ---
	// Gọi API lấy chi tiết thẻ, trong đó đã có sẵn mảng contents
	const { data: card, error, isLoading, mutate } = useSWR(
		id ? `${API_BASE_URL}/cards/${id}` : null,
		fetcher
	);

	// --- CHUẨN HÓA DATA ---
	const contents = useMemo(() => {
		// Lấy contents từ card object (giống code cũ của em)
		if (!card?.contents) return [];
		return card.contents.map(c => contentAdapter(c));
	}, [card]);

	// --- FILTER & PAGINATION ---
	const { searchText, setSearchText, filteredContents } = useContentFilters(contents);

	const ITEMS_PER_PAGE = 5;
	const {
		currentPage,
		paginatedData: currentContents,
		goToPage,
	} = usePagination(filteredContents, ITEMS_PER_PAGE);

	// --- FOCUS MANAGEMENT (GIỮ NGUYÊN TÍNH NĂNG MỚI) ---
	const [tableActive, setTableActive] = useState(false);
	const [searchFocused, setSearchFocused] = useState(false);
	const paginationRef = useRef(null);

	const totalPages = Math.ceil(filteredContents.length / ITEMS_PER_PAGE);
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

	// Reset về trang 1 khi search
	useEffect(() => { goToPage(1); }, [searchText]);

	// --- MODAL STATE ---
	const [showForm, setShowForm] = useState(false);
	const [editingContent, setEditingContent] = useState(null);
	const [deleteContentId, setDeleteContentId] = useState(null);

	// --- HANDLERS ---
	const handleOpenAdd = () => {
		setEditingContent(null);
		setShowForm(true);
	};

	const handleOpenEdit = (content) => {
		setEditingContent(content);
		setShowForm(true);
	};

	const handleSubmit = async (formData) => {
		// ... (Logic upload file giữ nguyên nếu em cần upload ảnh) ... 
		// Ở đây thầy viết gọn phần gọi API JSON

		// Lưu ý: Nếu backend lưu content mảng lồng trong card,
		// thì thường ta phải POST vào `/cards/{id}/contents`
		// hoặc PUT vào `/cards/{id}` (tùy backend của em).
		// Giả sử em có API riêng để thêm content vào card:

		const indexToUpdate = editingContent
			? contents.findIndex(c => c.id === editingContent.id) // Tìm theo ID ảo nếu adapter tạo ID
			: -1;

		// Nếu adapter tạo ID ảo, tìm theo object reference an toàn hơn:
		const realIndex = editingContent ? contents.indexOf(editingContent) : -1;

		const method = editingContent ? "PUT" : "POST";

		// Em check lại API backend đoạn này nhé.
		// Nếu API là sửa theo index mảng: `/cards/${id}/contents/${realIndex}`
		// Nếu API chuẩn RESTful có ID riêng: `/contents/${editingContent.id}`

		// Thầy dùng lại logic trong "Code cũ" của em (dùng index):
		const url = editingContent
			? `${API_BASE_URL}/cards/${id}/contents/${realIndex}`
			: `${API_BASE_URL}/cards/${id}/contents`;

		try {
			const res = await authFetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (res.ok) {
				setShowForm(false);
				mutate(); // Reload lại toàn bộ card để cập nhật list contents
				alert(editingContent ? "✅ Cập nhật thành công" : "✅ Thêm mới thành công");
			} else {
				alert("❌ Có lỗi xảy ra");
			}
		} catch (err) {
			console.error(err);
			alert("❌ Lỗi kết nối");
		}
	};

	const handleOpenDelete = (contentOrIndex) => {
		// Vì Table trả về object content hoặc index, ta cần xử lý linh hoạt
		// Code cũ của em dùng index để xóa
		let targetIndex = -1;

		if (typeof contentOrIndex === 'number') {
			// Nếu table trả về index trong trang hiện tại (0..4)
			// Ta cần tìm content đó trong mảng gốc
			const contentInPage = currentContents[contentOrIndex];
			targetIndex = contents.indexOf(contentInPage);
		} else {
			// Nếu table trả về object
			targetIndex = contents.indexOf(contentOrIndex);
		}

		if (targetIndex !== -1) {
			setDeleteContentId(targetIndex); // Lưu index để xóa
		}
	};

	const handleDeleteConfirmed = async () => {
		if (deleteContentId === null) return; // check null chặt chẽ vì index có thể là 0

		const res = await authFetch(`${API_BASE_URL}/cards/${id}/contents/${deleteContentId}`, {
			method: "DELETE",
		});

		if (res.ok) {
			setDeleteContentId(null);
			mutate(); // Reload data
			alert("✅ Đã xóa nội dung");
		} else {
			alert("❌ Xóa thất bại");
		}
	};

	if (isLoading) {
		return (
			<div className="w-full h-96 flex flex-col items-center justify-center">
				<div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
				<p className="text-gray-400 text-sm">Đang tải dữ liệu...</p>
			</div>
		);
	}

	if (error || !card) return <div className="p-10 text-center text-red-500">❌ Không tìm thấy thẻ</div>;

	return (
		<div className="px-4 pb-20">
			{/* HEADER */}
			<div className="flex justify-between items-center mb-1">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<i className="fa-solid fa-layer-group" /> Chi tiết thẻ: {card.title}
				</h1>
			</div>

			{/* INFO & TOOLBAR */}
			<div className="flex justify-between items-end mb-6">
				<p className="text-gray-500 text-sm pb-2">
					Quản lý {filteredContents.length} nội dung hiển thị.
				</p>

				<ContentToolbar
					searchText={searchText}
					setSearchText={setSearchText}
					onAdd={handleOpenAdd}
					onSearchFocusChange={setSearchFocused}
				/>
			</div>

			{/* VÙNG FOCUS (FOCUS SCOPE) */}
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
				{/* TABLE */}
				<ContentTable
					contents={currentContents}
					onEdit={handleOpenEdit}
					onDelete={handleOpenDelete}
				/>

				{/* PAGINATION */}
				{filteredContents.length > ITEMS_PER_PAGE && (
					<div className="mt-6 flex justify-center">
						<Pagination
							totalItems={filteredContents.length}
							itemsPerPage={ITEMS_PER_PAGE}
							currentPage={currentPage}
							onPageChange={(page) => {
								goToPage(page);
								paginationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
							}}
						/>
					</div>
				)}
			</div>

			{/* FORM MODAL */}
			<ContentFormModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				initialData={editingContent}
				onSubmit={handleSubmit}
			/>

			{/* DELETE CONFIRM MODAL */}
			<DeleteModal
				open={deleteContentId !== null}
				title="Xóa nội dung?"
				message="Bạn có chắc chắn muốn xóa nội dung này không? Hành động này không thể hoàn tác."
				onCancel={() => setDeleteContentId(null)}
				onConfirm={handleDeleteConfirmed}
			/>
		</div>
	);
}