"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LayoutEditor from "@/components/feature/dashboard/LayoutEditor";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";

export default function LayoutDetailPage() {
	const { id } = useParams();
	const [layout, setLayout] = useState(null);

	useEffect(() => {
		if (!id) return;

		async function fetchLayout() {
			try {
				const res = await authFetch(`${API_BASE_URL}/gridLayouts/${id}`);
				const data = await res.json();
				setLayout(data);
			} catch (err) {
				console.error("❌ Lỗi khi tải layout:", err);
			}
		}

		fetchLayout();
	}, [id]);

	return (
		<div className="admin-page">
			{layout ? (
				<>
					<div className="bg-slate-50 p-5 rounded-lg mb-6 shadow-sm">
						<h2 className="text-[1.6rem] font-semibold text-blue-900 mb-2">
							{layout.title}
						</h2>
						<p className="text-sm text-slate-700">
							<strong>Mã code:</strong> {layout.code}<br />
							<strong>Số card hiển thị:</strong> {layout.cards?.length || 0}
						</p>
					</div>

					<LayoutEditor
						layoutId={layout._id}
						initialConfig={layout.config}
					/>
				</>
			) : (
				<p className="text-slate-500">Đang tải thông tin bố cục...</p>
			)}
		</div>
	);
}
