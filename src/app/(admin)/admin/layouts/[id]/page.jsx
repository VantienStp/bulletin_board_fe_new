"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

import { FaArrowLeft, FaLayerGroup, FaSpinner } from "react-icons/fa";
import LayoutEditor from "@/components/feature/layouts/LayoutEditor";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/context/ToastContext"; // ✅ Chuẩn bị sẵn Toast

export default function LayoutDetailPage() {
	const { id } = useParams();
	const { addToast } = useToast();

	// ✅ Fetch dữ liệu với SWR
	const { data: layout, error, isLoading } = useSWR(
		id ? `${API_BASE_URL}/gridlayouts/${id}` : null,
		fetcher
	);

	// Xử lý thông báo lỗi nếu fetch thất bại (tùy chọn)
	React.useEffect(() => {
		if (error) {
			addToast("error", "Không thể tải dữ liệu bố cục!");
		}
	}, [error, addToast]);

	// Trạng thái Loading chuyên nghiệp hơn
	if (isLoading) {
		return (
			<div className="w-full h-96 flex flex-col items-center justify-center text-gray-400">
				<FaSpinner className="animate-spin text-3xl mb-4 text-indigo-500" />
				<p className="text-sm font-medium">Đang thiết lập không gian thiết kế...</p>
			</div>
		);
	}

	if (error || !layout) {
		return (
			<div className="p-10 text-center flex flex-col items-center gap-4">
				<div className="text-4xl text-gray-300">❌</div>
				<h2 className="text-xl font-bold text-gray-800">Không tìm thấy bố cục</h2>
				<p className="text-gray-500">Bố cục bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
				<Link href="/admin/layouts" className="text-indigo-600 hover:underline flex items-center gap-2">
					<FaArrowLeft size={12} /> Quay lại danh sách
				</Link>
			</div>
		);
	}

	return (
		<div className="px-4 pb-20 animate-reveal"> {/* Thêm animation nhẹ cho trang */}
			{/* ===== HEADER ===== */}
			<div className="flex justify-between items-start mb-6">
				<div>
					<div className="flex items-center gap-3">
						<div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm border border-indigo-100">
							<FaLayerGroup size={20} />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900 leading-tight">
								{layout.title}
							</h1>
							<div className="flex items-center gap-3 mt-1.5 text-sm">
								<span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-mono text-xs">
									{layout.slug || layout.code}
								</span>
								<span className="text-gray-300">|</span>
								<span className="text-gray-500">
									Thiết lập: <span className="font-bold text-gray-800">{layout.config?.positions?.length || 0}</span> vị trí
								</span>
							</div>
						</div>
					</div>
				</div>

				<Link
					href="/admin/layouts"
					className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 hover:text-indigo-600 flex items-center gap-2 transition-all shadow-sm active:scale-95"
				>
					<FaArrowLeft /> Quay lại
				</Link>
			</div>

			{/* ===== EDITOR AREA ===== */}
			<div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden min-h-[600px]">
				<LayoutEditor
					layoutId={layout._id}
					initialConfig={layout.config}
				/>
			</div>
		</div>
	);
}