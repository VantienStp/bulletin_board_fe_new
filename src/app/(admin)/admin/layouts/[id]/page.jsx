"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr"; // 👈 Import SWR
import { fetcher } from "@/lib/fetcher"; // Import fetcher

import { FaArrowLeft, FaLayerGroup } from "react-icons/fa";
import LayoutEditor from "@/components/feature/layouts/LayoutEditor";
import { API_BASE_URL } from "@/lib/api";

export default function LayoutDetailPage() {
	const { id } = useParams();

	// ✅ Dùng SWR để fetch dữ liệu
	const { data: layout, error, isLoading } = useSWR(
		id ? `${API_BASE_URL}/gridlayouts/${id}` : null,
		fetcher
	);

	if (isLoading) {
		return (
			<div className="w-full h-96 flex flex-col items-center justify-center">
				<div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
				<p className="text-gray-400 text-sm">Đang tải bố cục...</p>
			</div>
		);
	}

	if (error || !layout) return <div className="p-10 text-center">❌ Không tìm thấy bố cục</div>;

	return (
		<div className="px-4 pb-20">
			{/* ===== HEADER ===== */}
			<div className="flex justify-between items-start mb-6">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
						<div className="p-2 bg-gray-100 rounded-lg text-gray-600">
							{/* Sửa lại dùng Component React Icon cho chuẩn */}
							<FaLayerGroup size={20} />
						</div>

						{layout.title}
					</h1>

					<div className="flex items-center gap-3 mt-3 text-sm ml-1">
						<span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-100 font-mono text-xs font-medium">
							{layout.slug || layout.code}
						</span>
						<span className="text-gray-300">|</span>
						<span className="text-gray-600 flex items-center gap-1">
							<span className="font-bold text-gray-800">{layout.config?.positions?.length || 0}</span> ô hiển thị
						</span>
					</div>
				</div>

				<Link
					href="/admin/layouts"
					className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 hover:text-black flex items-center gap-2 transition shadow-sm"
				>
					<FaArrowLeft /> Quay lại
				</Link>
			</div>

			{/* ===== EDITOR AREA ===== */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
				<LayoutEditor
					layoutId={layout._id}
					initialConfig={layout.config}
				/>
			</div>
		</div>
	);
}