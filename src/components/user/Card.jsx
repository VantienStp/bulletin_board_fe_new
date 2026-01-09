"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  /* ======================== DYNAMIC SIZES (OPTIMIZED) ======================== */
  useEffect(() => {
    if (!containerRef.current) return;

    // Sử dụng ResizeObserver để theo dõi thay đổi kích thước hiệu quả hơn window resize
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        const larger = Math.max(w, h);

        const container = containerRef.current;
        container.style.setProperty("--larger", `${larger}px`);

        // Tính maxLines và đẩy vào CSS
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
    setTimeout(() => setCanClick(true), 2000); // Giảm xuống 2s để trải nghiệm mượt hơn
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
                    muted loop autoPlay playsInline
                    className="absolute inset-0 w-full h-full object-cover bg-black"
                  />
                )}
                {activeFile?.type === "pdf" && (
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-[1vw] z-[20]"
                    src={`${encodeURI(activeFile.url)}#toolbar=0&navpanes=0`}
                    frameBorder="0"
                  />
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
            {/* QR WRAPPER */}
            <div className="qr-image-wrapper">
              <img
                src={getFullUrl(activeFile.qrCode)}
                className="qr-img-file"
                alt="qr"
              />
            </div>

            {/* DESCRIPTION TEXT */}
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