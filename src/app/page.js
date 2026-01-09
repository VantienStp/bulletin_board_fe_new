"use client";

import { useEffect } from "react";
import "@/styles/tokens.css";
import "@/styles/globals.css";

// Imports components
import { useKioskData } from "@/hooks/useKioskData";
import Sidebar from "@/components/layout/user/Sidebar";
import KioskHeader from "@/components/layout/user/KioskHeader";
import ContentGrid from "@/components/layout/user/ContentGrid";

export default function HomePage() {
	// Lấy dữ liệu và logic từ Hook
	const {
		categories,
		selectedCategory,
		layoutConfig,
		config,
		timeLeft,
		totalTime,
		setAutoSwitch,
		handleSelectCategory
	} = useKioskData();

	useEffect(() => {
		const el = document.getElementById("devtools-indicator");
		if (el) el.style.display = "none";
	}, []);

	return (
		<>
			<Sidebar
				categories={categories}
				selectedCategory={selectedCategory}
				onSelect={handleSelectCategory}
			/>

			<div className="content-wrapper">
				<KioskHeader toggleAutoSwitch={() => setAutoSwitch(!config.autoSwitch)} />
				<main className="main-content">
					<ContentGrid
						categories={categories}
						selectedCategory={selectedCategory}
						layoutConfig={layoutConfig}
					/>
				</main>
			</div>

			{/* Footer / Overlay */}
			<div className="fixed bottom-0 right-0 w-[28%] min-w-[36px] h-[3%] min-h-[32px] bg-[rgba(234,17,17,0.8)] text-slate-50 text-[18px] font-medium flex items-center justify-center rounded-tl-[20px] shadow-[0_6px_20px_rgba(0,0,0,0.25)] select-none pointer-events-none z-[9999]">
				Vui lòng không chạm vào màn hình
			</div>
		</>
	);
}