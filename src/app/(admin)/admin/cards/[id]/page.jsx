"use client";

import { useEffect, useState, useRef } from "react";
import {
	FaClone,
	FaEye,
	FaPlusSquare,
	FaFolderOpen,
	FaEdit,
	FaTrash,
} from "react-icons/fa";

import Link from "next/link";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";

import { API_BASE_URL, BASE_URL } from "@/lib/api";
import { useParams } from "next/navigation";
import { authFetch } from "@/lib/auth";
import { Select, MenuItem } from "@mui/material";
import usePagination from "@/hooks/usePagination";

export default function CardDetailPage() {
	const { id } = useParams();

	const [card, setCard] = useState(null);
	const [editingContent, setEditingContent] = useState(null);
	const [formData, setFormData] = useState({
		type: "image",
		url: "",
		description: "",
		qrCode: "",
	});
	const [showForm, setShowForm] = useState(false);

	/* ===== Pagination ===== */
	const {
		currentPage,
		totalPages,
		paginatedData: currentContents,
		goPrev,
		goNext,
		goToPage,
	} = usePagination(card?.contents || [], 4);

	useEffect(() => {
		fetchCard();
	}, [id]);

	async function fetchCard() {
		try {
			const res = await fetch(`${API_BASE_URL}/cards/${id}`);
			const data = await res.json();
			setCard(data);
		} catch (err) {
			console.error("❌ fetchCard error:", err);
		}
	}

	/* ===== Helpers ===== */
	function getFullUrl(path) {
		if (!path) return null;
		if (path.startsWith("http")) return path;
		return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
	}

	/* ===== Edit ===== */
	function handleEditContent(index) {
		const content = card.contents[index];
		setEditingContent(index);
		setFormData({
			type: content.type || "image",
			url: content.url || "",
			description: content.description || "",
			qrCode: content.qrCode || "",
		});
		setShowForm(true);
	}

	/* ===== Delete ===== */
	async function handleDeleteContent(index) {
		if (!confirm("Bạn có chắc muốn xóa nội dung này?")) return;

		const res = await authFetch(
			`${API_BASE_URL}/cards/${id}/contents/${index}`,
			{ method: "DELETE" }
		);

		if (res.ok) {
			fetchCard();
		} else {
			alert("❌ Xóa thất bại");
		}
	}

	/* ===== Submit ===== */
	async function handleSubmit(e) {
		e.preventDefault();
		if (!card) return;

		const finalData = JSON.parse(JSON.stringify(formData));

		if (formData.url instanceof File) {
			const fd = new FormData();
			fd.append("file", formData.url);

			const uploadRes = await authFetch(
				`${API_BASE_URL}/files/upload`,
				{ method: "POST", body: fd }
			);

			const uploadData = await uploadRes.json();
			if (!uploadRes.ok) {
				alert("❌ Upload thất bại");
				return;
			}

			finalData.url = uploadData.url;
			finalData.type = uploadData.type || formData.type;
			finalData.qrCode = uploadData.qrImage || uploadData.qrLink || "";

			if (uploadData.type === "pdf" && uploadData.images) {
				finalData.images = uploadData.images;
			}
		}

		const method = editingContent !== null ? "PUT" : "POST";
		const url =
			editingContent !== null
				? `${API_BASE_URL}/cards/${id}/contents/${editingContent}`
				: `${API_BASE_URL}/cards/${id}/contents`;

		const res = await authFetch(url, {
			method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(finalData),
		});


		if (res.ok) {
			setShowForm(false);
			setEditingContent(null);
			fetchCard();
		} else {
			alert("❌ Lưu thất bại");
		}
	}

	if (!card) return <p>Đang tải...</p>;

	return (
		<div className="px-4">
			{/* ===== HEADER ===== */}
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<FaClone /> Chi tiết thẻ: {card.title}
				</h1>

				<button
					className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-gray-900"
					onClick={() => {
						setEditingContent(null);
						setFormData({
							type: "image",
							url: "",
							description: "",
							qrCode: "",
						});
						setShowForm(true);
					}}
				>
					<FaPlusSquare /> Thêm mới
				</button>
			</div>

			{/* ===== TABLE WRAPPER ===== */}
			<div className="bg-white rounded-xl shadow overflow-hidden">
				{/* HEADER */}
				<div className="grid grid-cols-[0.5fr_1fr_0.5fr_0.5fr_120px] px-6 py-4 font-semibold text-gray-600 text-center border-b text-sm">
					<div>File</div>
					<div>Mô tả</div>

					<div>Loại</div>

					<div>QR</div>
					<div>Actions</div>
				</div>

				{/* ROWS */}
				<div className="divide-y">
					{currentContents
						.filter(Boolean)
						.map((c, i) => {
							const realIndex = (currentPage - 1) * 4 + i;

							return (
								<div
									key={realIndex}
									className="grid grid-cols-[0.5fr_1fr_0.5fr_0.5fr_120px] px-6 py-2 items-center text-sm hover:bg-gray-50"
								>

									<div className="h-24 w-48 rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
										{c.type === "image" && (
											<img
												src={getFullUrl(c.url)}
												className="w-full h-full object-cover"
											/>
										)}
										{c.type === "video" && (
											<video
												src={getFullUrl(c.url)}
												className="w-full h-full object-cover"
												controls
											/>
										)}
										{c.type === "pdf" && (
											<iframe
												src={getFullUrl(c.url)}
												className="w-full h-full"
											/>
										)}
									</div>

									<div className="text-gray-700">
										{c.description || "—"}
									</div>

									<div className="text-center font-medium">{c.type}</div>

									<div className="flex justify-center">
										{c.qrCode ? (
											<img
												src={
													c.qrCode.startsWith("data:image")
														? c.qrCode
														: getFullUrl(c.qrCode)
												}
												className="w-20 h-20 object-contain"
											/>
										) : (
											"—"
										)}
									</div>

									<div className="flex flex-col gap-2 justify-center">
										{c.url && (
											<Link
												href={getFullUrl(c.url)}
												target="_blank"
												className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm text-center hover:bg-blue-600"
											>
												View
											</Link>
										)}

										<button
											onClick={() => handleEditContent(realIndex)}
											className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
										>
											Edit
										</button>

										<button
											onClick={() => handleDeleteContent(realIndex)}
											className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
										>
											Delete
										</button>
									</div>
								</div>
							);
						})}
				</div>
			</div>

			{/* ===== PAGINATION ===== */}
			<div className="mt-4">
				<Pagination
					totalItems={card.contents.length}
					itemsPerPage={4}
					currentPage={currentPage}
					onPageChange={goToPage}
				/>
			</div>

			{/* ===== FORM MODAL ===== */}
			{showForm && (
				<Modal
					title={editingContent !== null ? "Sửa nội dung" : "Thêm nội dung"}
					onClose={() => setShowForm(false)}
				>
					<form onSubmit={handleSubmit}>
						<label>Loại</label>
						<Select
							variant="standard"
							disableUnderline
							value={formData.type}
							onChange={(e) =>
								setFormData({ ...formData, type: e.target.value })
							}
						>
							<MenuItem value="image">Image</MenuItem>
							<MenuItem value="video">Video</MenuItem>
							<MenuItem value="pdf">PDF</MenuItem>
						</Select>

						<label>File / URL</label>
						<div className="flex gap-2 items-center">
							<input
								value={
									formData.url instanceof File
										? formData.url.name
										: formData.url
								}
								onChange={(e) =>
									setFormData({ ...formData, url: e.target.value })
								}
							/>

							<button
								type="button"
								className="px-3 py-2 bg-gray-200 rounded-md"
								onClick={() =>
									document.getElementById("fileInput").click()
								}
							>
								<FaFolderOpen />
							</button>

							<input
								id="fileInput"
								type="file"
								hidden
								accept={
									formData.type === "video"
										? "video/*"
										: formData.type === "pdf"
											? "application/pdf"
											: "image/*"
								}
								onChange={(e) => {
									const file = e.target.files[0];
									if (file)
										setFormData({ ...formData, url: file });
								}}
							/>
						</div>

						<label>Mô tả</label>
						<textarea
							rows="3"
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
						/>

						<div className="modal-actions">
							<button type="submit" className="btn-primary">
								{editingContent !== null ? "Cập nhật" : "Lưu"}
							</button>
							<button
								type="button"
								className="btn-cancel"
								onClick={() => setShowForm(false)}
							>
								Hủy
							</button>
						</div>
					</form>
				</Modal>
			)}
		</div>
	);
}
