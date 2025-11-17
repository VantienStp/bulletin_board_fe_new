'use client';
import { useEffect, useState } from 'react';
import { FaClone, FaEye, FaPlusSquare, FaFolderOpen, FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Modal from '@/components/admin/Modal';
import { API_BASE_URL, BASE_URL } from '@/lib/api';
import { useParams } from 'next/navigation';
import "./card-detail.css";
import { authFetch, getToken } from '@/lib/auth';
import { Select, MenuItem } from "@mui/material";

export default function CardDetailPage() {
	const [card, setCard] = useState(null);
	const [editingContent, setEditingContent] = useState(null);
	const [formData, setFormData] = useState({ type: 'image', url: '', description: '', qrCode: '' });
	const [showForm, setShowForm] = useState(false);
	const { id } = useParams();

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
		const token = getToken();
		if (!card) return;

		const finalData = JSON.parse(JSON.stringify(formData));

		// 🧠 Nếu người dùng chọn file mới cho url → upload lên BE trước
		if (formData.url instanceof File) {
			const fd = new FormData();
			fd.append("file", formData.url);

			const uploadRes = await authFetch(`${API_BASE_URL}/files/upload`, {
				method: "POST",
				body: fd,
			});

			const uploadData = await uploadRes.json();

			if (uploadRes.ok && uploadData.url) {
				// ✅ Lưu link file
				finalData.url = uploadData.url;
				finalData.type = uploadData.type || formData.type;

				// ✅ Tự động lấy ảnh QR từ BE (ảnh base64) để lưu vào card
				finalData.qrCode = uploadData.qrImage || uploadData.qrLink || "";
			} else {
				console.error("❌ Upload thất bại:", uploadData);
				alert("❌ Upload thất bại, vui lòng thử lại.");
				return;
			}
		}

		// 🧩 Gửi dữ liệu nội dung (tạo mới hoặc cập nhật)
		const method = editingContent !== null ? "PUT" : "POST";
		const url = editingContent !== null
			? `${API_BASE_URL}/cards/${id}/contents/${editingContent}`
			: `${API_BASE_URL}/cards/${id}/contents`;

		try {
			const res = await authFetch(url, {
				method,

				body: JSON.stringify(finalData),
			});

			if (res.ok) {
				alert(editingContent !== null ? "✅ Đã cập nhật nội dung" : "✅ Đã thêm nội dung mới");
				setShowForm(false);
				setEditingContent(null);
				fetchCard();
			} else {
				const msg = await res.text();
				console.error("❌ Server response:", msg);
				alert("❌ Cập nhật thất bại");
			}
		} catch (err) {
			console.error("❌ Lỗi khi lưu:", err);
			alert("❌ Lỗi khi gửi dữ liệu lên server");
		}
	}

	async function handleDeleteContent(index) {
		if (!confirm('Bạn có chắc muốn xóa nội dung này?')) return;
		const token = getToken();
		try {
			const res = await authFetch(`${API_BASE_URL}/cards/${id}/contents/${index}`, {
				method: 'DELETE',

			});
			if (res.ok) {
				alert('✅ Đã xóa nội dung');
				fetchCard();
			} else {
				alert('❌ Xóa thất bại');
			}
		} catch (err) {
			console.error('❌ Lỗi khi xóa nội dung:', err);
		}
	}

	function getFullUrl(path) {
		if (!path) return null; // tránh cảnh báo khi path rỗng
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
					<span>Chi tiết thẻ</span>
				</div>

				<button
					className="btn-primary"
					onClick={() => {
						setEditingContent(null);
						setFormData({ type: 'image', url: '', description: '', qrCode: '' });
						setShowForm(true);
					}}
				>
					<FaPlusSquare /> Thêm mới
				</button>
			</div>

			<table className="admin-table table-cards-detail">
				<thead>
					<tr>
						<th>Loại</th>
						<th>File / Hình ảnh</th>
						<th>Mô tả</th>
						<th>QR Code</th>
						<th>Hành động</th>
					</tr>
				</thead>
				<tbody>
					{card.contents.map((c, i) => (
						<tr key={i}>
							<td>{c.type}</td>
							<td>
								<div className="media-preview">
									{c.type === 'image' && c.url && <img src={getFullUrl(c.url)} alt="" />}
									{c.type === 'video' && c.url && <video src={getFullUrl(c.url)} controls />}
									{c.type === 'pdf' && c.url && <iframe src={getFullUrl(c.url)} />}
								</div>
							</td>

							<td>{c.description || '—'}</td>
							<td>
								<div className="media-qr">
									{c.qrCode ? (
										c.qrCode.startsWith("data:image")
											? <img src={c.qrCode} alt="QR" />
											: <img src={getFullUrl(c.qrCode)} alt="QR" />
									) : "—"}
								</div>
							</td>
							<td>
								{c.url && (
									<Link href={getFullUrl(c.url)} target="_blank" className="btn-view">
										<FaEye /> Xem
									</Link>
								)}
								<button className="btn-edit"
									onClick={() => {
										handleEditContent(i); setEditingContent("edit")
										console.log("Editing content index:", editingContent);
									}}>
									<FaEdit /> Sửa
								</button>
								<button className="btn-delete" onClick={() => handleDeleteContent(i)}>
									<FaTrash /> Xóa
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

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
