'use client';
import { useEffect, useState } from 'react';
import { FaClone, FaEye, FaPlusSquare, FaFolderOpen, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Modal from '@/components/admin/Modal';
import { API_BASE_URL, BASE_URL } from '@/lib/api';
import { useParams } from 'next/navigation';
import { authFetch } from '@/lib/auth';
import { Select, MenuItem } from "@mui/material";
import usePagination from "@/hooks/usePagination";

export default function CardDetailPage() {
	const [card, setCard] = useState(null);
	const [editingContent, setEditingContent] = useState(null);
	const [formData, setFormData] = useState({ type: 'image', url: '', description: '', qrCode: '' });
	const [showForm, setShowForm] = useState(false);
	const { id } = useParams();

	// 🟦 Pagination 4 item mỗi trang
	const {
		currentPage,
		totalPages,
		paginatedData: currentContents,
		goPrev,
		goNext,
		goToPage
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
			console.error('❌ Lỗi khi tải chi tiết thẻ:', err);
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();
		if (!card) return;
		console.log("sads");

		const finalData = JSON.parse(JSON.stringify(formData));

		// Nếu upload file mới
		if (formData.url instanceof File) {
			const fd = new FormData();
			fd.append("file", formData.url);

			const uploadRes = await authFetch(`${API_BASE_URL}/files/upload`, {
				method: "POST",
				body: fd,
			});

			const uploadData = await uploadRes.json();

			if (!uploadRes.ok) {
				alert("❌ Upload thất bại!");
				return;
			}
			console.log(uploadData);


			finalData.url = uploadData.url;
			finalData.type = uploadData.type || formData.type;
			finalData.qrCode = uploadData.qrImage || uploadData.qrLink || "";

			if (uploadData.type === "pdf" && uploadData.images) {
				finalData.images = uploadData.images;

			}
		}

		const method = editingContent !== null ? "PUT" : "POST";
		const url = editingContent !== null
			? `${API_BASE_URL}/cards/${id}/contents/${editingContent}`
			: `${API_BASE_URL}/cards/${id}/contents`;

		const res = await authFetch(url, {
			method,
			body: JSON.stringify(finalData),
		});

		if (res.ok) {
			alert(editingContent !== null ? "✅ Đã cập nhật nội dung" : "✅ Đã thêm mới");
			setShowForm(false);
			setEditingContent(null);
			fetchCard();
		} else {
			alert("❌ Cập nhật thất bại");
		}
	}

	async function handleDeleteContent(index) {
		if (!confirm('Bạn có chắc muốn xóa nội dung này?')) return;

		const res = await authFetch(`${API_BASE_URL}/cards/${id}/contents/${index}`, {
			method: 'DELETE',
		});

		if (res.ok) {
			alert('✅ Đã xóa nội dung');
			fetchCard();
		} else {
			alert('❌ Xóa thất bại');
		}
	}

	function getFullUrl(path) {
		if (!path) return null;
		if (path.startsWith("http")) return path;
		return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
	}

	function handleEditContent(index) {
		const content = card.contents[index];
		setEditingContent(index);
		setFormData({
			type: content.type || 'image',
			url: content.url || '',
			description: content.description || '',
			qrCode: content.qrCode || ''
		});
		setShowForm(true);
	}

	if (!card) return <p>Đang tải...</p>;

	return (
		<div className="admin-page">
			<div className="page-header">
				<div className="show-header">
					<span className="icon"><FaClone /></span>
					<span>Chi tiết thẻ {card.title}</span>
				</div>

				<button
					className="btn-primary"
					onClick={() => {
						setEditingContent(null);
						setFormData({ type: 'image', url: '', description: '', qrCode: '' });
						setShowForm(true);
					}}>
					<FaPlusSquare /> Thêm mới
				</button>
			</div>

			{/* TABLE */}
			<table className="admin-table table-cards-detail">
				<thead>
					<tr className="bg-slate-100">
						<th className="w-[10%] px-3 py-2 text-center">Loại</th>
						<th className="w-[15%] px-3 py-2">File / Hình</th>
						<th className="w-[40%] px-3 py-2">Mô tả</th>
						<th className="w-[10%] px-3 py-2 text-center">QR</th>
						<th className="w-[25%] px-3 py-2">Hành động</th>
					</tr>
				</thead>

				<tbody>
					{currentContents.map((c, i) => {
						const realIndex = (currentPage - 1) * 4 + i;

						return (
							<tr key={realIndex}>
								<td>{c.type}</td>

								<td className="px-3 py-2">
									<div className="w-[8vw] h-[5vw] overflow-hidden rounded-md flex items-center justify-center">
										{c.type === "image" && <img className="w-full h-full object-cover" src={getFullUrl(c.url)} />}
										{c.type === "video" && <video className="w-full h-full object-cover" controls src={getFullUrl(c.url)} />}
										{c.type === "pdf" && <iframe className="w-full h-full" src={getFullUrl(c.url)} />}
									</div>
								</td>

								<td className="px-3 py-2">{c.description || '—'}</td>

								<td className="px-3 py-2 text-center">
									<div className="w-[5vw] aspect-square mx-auto">
										{c.qrCode ? (
											c.qrCode.startsWith("data:image")
												? <img src={c.qrCode} alt="QR" />
												: <img src={getFullUrl(c.qrCode)} alt="QR" />
										) : "—"}
									</div>
								</td>

								<td className="px-3 py-2">
									{c.url && (
										<Link href={getFullUrl(c.url)} target="_blank" className="btn-view">
											<FaEye /> Xem
										</Link>
									)}

									<button className="btn-edit" onClick={() => handleEditContent(realIndex)}>
										<FaEdit /> Sửa
									</button>

									<button className="btn-delete" onClick={() => handleDeleteContent(realIndex)}>
										<FaTrash /> Xóa
									</button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{/* PAGINATION */}
			<div className="pagination">
				<button className="page-btn" onClick={goPrev} disabled={currentPage === 1}>◀</button>

				{Array.from({ length: totalPages }, (_, i) => (
					<button
						key={i}
						className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
						onClick={() => goToPage(i + 1)}
					>
						{i + 1}
					</button>
				))}

				<button className="page-btn" onClick={goNext} disabled={currentPage === totalPages}>▶</button>
			</div>

			{/* FORM */}
			{showForm && (
				<Modal
					title={editingContent !== null ? "Sửa nội dung" : "Thêm nội dung mới"}
					onClose={() => setShowForm(false)}
				>
					<form onSubmit={handleSubmit}>
						<div className="modal-fixbug">
							<label>Loại</label>
							<Select variant="standard" disableUnderline value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
								<MenuItem value="image">Image</MenuItem>
								<MenuItem value="video">Video</MenuItem>
								<MenuItem value="pdf">PDF</MenuItem>
							</Select>
						</div>

						<div>
							<label>URL hình ảnh / file</label>
							<div className="upload-row">
								<input
									type="text"
									placeholder="Nhập đường dẫn hoặc chọn file..."
									value={formData.url instanceof File ? formData.url.name : formData.url}
									onChange={(e) => setFormData({ ...formData, url: e.target.value })}
								/>

								<span
									className="upload-btn"
									onClick={() => document.getElementById("fileInput").click()} // 👈 click thủ công
								>
									<span className="icon"><FaFolderOpen /></span>
								</span>

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
										if (file) setFormData({ ...formData, url: file });
									}}
								/>
							</div>
						</div>

						<div className="desc-qr-row">
							<div className="desc-box">
								<label>Mô tả</label>
								<textarea
									rows="3"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									placeholder="Nhập mô tả..."
								/>
							</div>

							<div className="qr-side">
								<label>QR Code</label>
								{formData.qrCode ? (
									<img src={formData.qrCode} alt="QR Preview" />
								) : (
									<span>(Tự động tạo sau khi upload)</span>
								)}
							</div>
						</div>

						<div className="modal-actions">
							<button
								type="submit"
								className={` ${editingContent == null ? "btn-view" : "btn-edit"}`}
							>
								{editingContent !== null ? "Cập nhật" : "Lưu"}
							</button>
							<button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
								Hủy
							</button>
						</div>
					</form>
				</Modal>


			)}

		</div>
	);
}
