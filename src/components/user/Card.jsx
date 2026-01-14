"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function PdfImageSlider({ images }) {
	const [pageIndex, setPageIndex] = useState(0);

	useEffect(() => {
		if (!images || images.length <= 1) return;
		const nextPageIndex = (pageIndex + 1) % images.length;
		const img = new Image();
		img.src = images[nextPageIndex];
	}, [pageIndex, images]);

	useEffect(() => {
		const timer = setInterval(() => {
			setPageIndex((prev) => (prev + 1) % images.length);
		}, 15 * 1000);
		return () => clearInterval(timer);
	}, [images]);

	return (
		<AnimatePresence mode="wait">
			<motion.img
				key={pageIndex}
				src={images[pageIndex]}
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -50 }}
				transition={{ duration: 0.8, ease: "easeInOut" }}
				className="w-full h-full object-contain"
				alt={`Page ${pageIndex + 1}`}
			/>
		</AnimatePresence>
	);
}

export default function Card({ title, contents = [], style = {} }) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [showTitle, setShowTitle] = useState(true);
	const [canClick, setCanClick] = useState(true);

	const containerRef = useRef(null);
	const timerRef = useRef(null);

	const activeFile = contents[activeIndex];

	/* ======================== AUTO SWITCH ======================== */
	useEffect(() => {
		if (!contents.length) return;

		const current = contents[activeIndex];
		let intervalTime = 20000;
		if (current.type === "video") intervalTime = 60000;
		else if (current.type === "pdf") intervalTime = 75000;
		else intervalTime = 25000 + Math.random() * 15000;

		clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => {
			setActiveIndex((prev) => (prev + 1) % contents.length);
		}, intervalTime);

		return () => clearTimeout(timerRef.current);
	}, [activeIndex, contents]);

	/* ======================== DYNAMIC SIZES ======================== */
	useEffect(() => {
		if (!containerRef.current) return;

		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const { width: w, height: h } = entry.contentRect;
				const larger = Math.max(w, h);

				const container = containerRef.current;
				container.style.setProperty("--larger", `${larger}px`);

				const fontSize = Math.min(Math.max(larger * 0.029, 12), 100);
				const bottomH = Math.min(Math.max(larger * 0.2, 80), 500);
				const maxLines = Math.floor(bottomH / (fontSize * 1.4)) - 1;
				container.style.setProperty("--max-lines", maxLines);
			}
		});

		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);

	function handleClick() {
		if (!canClick) return;
		clearTimeout(timerRef.current);
		setActiveIndex((prev) => (prev + 1) % contents.length);
		setCanClick(false);
		setTimeout(() => setCanClick(true), 3000);
	}

	const getFullUrl = (p) => (!p ? null : p.startsWith("http") ? p : p.replace(/^\/+/, ""));

	return (
		<div className="flex flex-col relative card-dynamic-container" style={style} ref={containerRef}>
			{/* TITLE */}
			<div className="title">
				<span>{title}</span>
			</div>

			<div className="relative flex flex-col flex-1">
				{/* MEDIA CONTAINER */}
				<div
					className="relative flex-1 overflow-hidden cursor-pointer rounded-[1vw]"
					onClick={handleClick}
				>
					{contents.length ? (
						<AnimatePresence mode="wait">
							<motion.div
								key={activeIndex}
								initial={{ opacity: 0, scale: 1.05 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.6, ease: "easeOut" }}
								className="absolute inset-0 w-full h-full z-[1]"
							>
								{activeFile?.type === "image" && (
									<img
										src={getFullUrl(activeFile.url)}
										className="absolute inset-0 w-full h-full object-cover object-top"
										alt=""
									/>
								)}
								{activeFile?.type === "video" && (
									<video
										src={getFullUrl(activeFile.url)}
										muted
										loop
										autoPlay
										playsInline
										controls={false}
										disablePictureInPicture
										disableRemotePlayback
										className="absolute inset-0 w-full h-full object-cover bg-black pointer-events-none"
									/>
								)}
								{activeFile?.type === "pdf" && (
									<div className="absolute inset-0 w-full h-full z-[20] bg-white rounded-[1vw] overflow-hidden">
										{activeFile.images && activeFile.images.length > 0 ? (
											<PdfImageSlider images={activeFile.images} />
										) : (
											<iframe
												className="w-full h-full"
												src={`${encodeURI(activeFile.url)}#toolbar=0&navpanes=0`}
												frameBorder="0"
											/>
										)}
									</div>
								)}
							</motion.div>
						</AnimatePresence>
					) : (
						<div className="flex items-center justify-center h-full">❌ Trống</div>
					)}
				</div>

				{/* QR + DESCRIPTION */}
				{showTitle && activeFile?.qrCode && (
					<div className="qr-overlay-dynamic shadow-2xl">
						<div className="qr-image-wrapper">
							<img
								src={getFullUrl(activeFile.qrCode)}
								className="qr-img-file"
								alt="qr"
							/>
						</div>
						<div className="qr-text-container">
							<span className="qr-description-text">
								{activeFile.description}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}