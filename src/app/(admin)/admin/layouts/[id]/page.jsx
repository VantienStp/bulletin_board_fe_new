"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaLayerGroup } from "react-icons/fa"; // 👈 Đã đổi icon
import LayoutEditor from "@/components/feature/layouts/LayoutEditor";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";

export default function LayoutDetailPage() {
	const { id } = useParams();
	const [layout, setLayout] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;
		async function fetchLayout() {
			try {
				const res = await authFetch(`${API_BASE_URL}/gridlayouts/${id}`);
				const data = await res.json();
				setLayout(data);
			} catch (err) {
				console.error("❌ Lỗi:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchLayout();
	}, [id]);

	if (loading) {
		return (
			<div className="w-full h-96 flex flex-col items-center justify-center">
				<div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
				<p className="text-gray-400 text-sm">Đang tải bố cục...</p>
			</div>
		);
	}

	if (!layout) return <div className="p-10 text-center">❌ Không tìm thấy bố cục</div>;

	return (
		<div className="px-4 pb-20">
			{/* ===== HEADER ===== */}
			<div className="flex justify-between items-start mb-6">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
						{/* Icon FaLayerGroup nhìn hợp với Layout hơn */}
						<div className="p-2 bg-gray-100 rounded-lg text-gray-600">
							<i className={"fa-solid fa-layer-group "} />
						</div>

						{layout.title}
						<div className="flex items-center gap-3 text-sm ml-1">
							<span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-100 font-mono text-xs font-medium">
								{layout.slug || layout.code}
							</span>

						</div>
					</h1>


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