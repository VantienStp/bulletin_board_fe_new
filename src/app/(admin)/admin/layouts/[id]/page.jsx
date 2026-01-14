"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FaSpinner, FaArrowLeft } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

// Components
import LayoutEditor from "@/components/feature/layouts/LayoutEditor";
import LayoutDetailHeader from "@/components/feature/layouts/detail/LayoutDetailHeader";

export default function LayoutDetailPage() {
	const { id } = useParams();
	const { addToast } = useToast();

	// Fetch dữ liệu
	const { data: layout, error, isLoading, mutate } = useSWR(
		id ? `${API_BASE_URL}/gridlayouts/${id}` : null,
		fetcher
	);

	useEffect(() => {
		if (error) addToast("error", "Không thể tải dữ liệu bố cục!");
	}, [error, addToast]);

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
				<Link href="/admin/layouts" className="text-indigo-600 hover:underline flex items-center gap-2">
					<FaArrowLeft size={12} /> Quay lại danh sách
				</Link>
			</div>
		);
	}

	return (
		<div className="animate-reveal pb-10">
			{/* 1. Header (đã tách) */}
			<LayoutDetailHeader
				layout={layout}
				onUpdateSuccess={() => mutate()} // 🔥 Báo cho SWR load lại dữ liệu mới sau khi sửa tên
			/>

			{/* 2. Editor Workspace */}
			<div className="rounded-2xl overflow-hidden min-h-[600px]">
				<LayoutEditor
					layoutId={layout._id}
					initialConfig={layout.config}
				/>
			</div>
		</div>
	);
}