"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Card({ title, contents = [], style = {} }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(true);
  const [canClick, setCanClick] = useState(true);

  const wrapperRef = useRef(null);
  const contentBottomRef = useRef(null);
  const qrImgRef = useRef(null);
  const qrTextRef = useRef(null);
  const timerRef = useRef(null);

  const activeFile = contents[activeIndex];

  /* ======================== AUTO SWITCH ======================== */
  useEffect(() => {
    if (!contents.length) return;

    const current = contents[activeIndex];
    let intervalTime = 10000;

    if (current.type === "video") intervalTime = 60000;
    else if (current.type === "pdf") intervalTime = 60000 + Math.random() * 30000;
    else intervalTime = 5000 + Math.random() * 5000;

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % contents.length);
    }, intervalTime);

    return () => clearTimeout(timerRef.current);
  }, [activeIndex, contents]);


  /* ======================== DYNAMIC SIZES ======================== */
  useEffect(() => {
    setDynamicSizes();
    window.addEventListener("resize", setDynamicSizes);
    return () => window.removeEventListener("resize", setDynamicSizes);
  }, [activeFile]);


  function setDynamicSizes() {
    const wrapper = wrapperRef.current;
    const bottom = contentBottomRef.current;
    const qrImg = qrImgRef.current;
    const qrText = qrTextRef.current;

    if (!wrapper || !bottom || !qrImg || !qrText) return;

    const w = wrapper.offsetWidth;
    const h = wrapper.offsetHeight;
    const larger = Math.max(w, h);

    // const bottomH = larger * 0.15;
    // const qrSize = larger * 0.15;
    // const fontSize = larger * 0.025;
    const padmin = Math.min(Math.max(8000 / larger, 8), 12);
    const padmax = Math.min(Math.max(larger * 0.029, 8), 16);

    bottom.style.padding = `${padmax}px`;
    bottom.style.gap = `${padmax}px`;


    const bottomH = Math.min(Math.max(larger * 0.2, 80), 500);
    const qrSize = Math.min(Math.max(larger * 0.2, 60), 360);
    const fontSize = Math.min(Math.max(larger * 0.029, 12), 100);


    bottom.style.height = `${bottomH}px`;
    qrImg.style.width = `${qrSize}px`;
    qrImg.style.height = `${qrSize}px`;
    qrText.style.fontSize = `${fontSize}px`;

    const lineH = fontSize * 1.4;
    const maxLines = Math.floor(bottomH / lineH) - 1;

    qrText.style.display = "-webkit-box";
    qrText.style.webkitBoxOrient = "vertical";
    qrText.style.overflow = "hidden";
    qrText.style.webkitLineClamp = maxLines;
  }


  function handleClick() {
    if (!canClick) return;

    clearTimeout(timerRef.current);
    setActiveIndex((prev) => (prev + 1) % contents.length);

    setCanClick(false);
    setTimeout(() => setCanClick(true), 3000);
  }


  const getFullUrl = (p) => (!p ? null : p.startsWith("http") ? p : p.replace(/^\/+/, ""));


  return (
    <div className="flex flex-col relative" style={style}>
      {/* TITLE */}
      <div className="title">
        <span>{title}</span>
      </div>

      {/* IMAGE + QR */}
      <div className="relative flex flex-col flex-1" ref={wrapperRef}>

        {/* IMAGE CONTAINER */}
        <div
          className="relative flex-1 overflow-hidden cursor-pointer rounded-[1vw]"
          onClick={handleClick}
        >
          {contents.length ? (
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={activeIndex}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.45, 0, 0.55, 1] }}
                className="absolute inset-0 w-full h-full z-[1]"
              >
                {/* IMAGE */}
                {activeFile?.type === "image" && (
                  <img
                    src={getFullUrl(activeFile.url)}
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                )}

                {/* VIDEO */}
                {activeFile?.type === "video" && (
                  <video
                    src={getFullUrl(activeFile.url)}
                    muted loop autoPlay controls playsInline
                    className="absolute inset-0 w-full h-full object-cover bg-black"
                  />
                )}

                {/* PDF */}
                {activeFile?.type === "pdf" && (
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-[1vw] object-contain z-[20]"
                    src={encodeURI(activeFile.url)}
                    frameBorder="0"
                  ></iframe>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <span>❌ Không có dữ liệu</span>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="absolute top-[2%] right-[2%] z-[1] pointer-events-none">
          <i
            className="text-white opacity-70 text-[1vw] p-[0.5vw] cursor-pointer pointer-events-auto [text-shadow:0_0_0.5vw_rgba(0,0,0,0.5)] hover:scale-110"
            onClick={() => setShowTitle(!showTitle)}
          ></i>
        </div>

        {/* QR + DESCRIPTION */}
        {showTitle && activeFile?.qrCode && (
          <div
            ref={contentBottomRef}
            className="absolute bottom-0 left-0 w-full flex items-start box-border rounded-b-[1vw] z-[10] "
            style={{
              background: "var(--overlay-bg)",
              height: "12%",
              minHeight: "10vh",
              maxHeight: "18vh",
            }}
          >
            {/* QR */}
            <div className="flex items-center h-full aspect-square">
              <img
                ref={qrImgRef}
                src={getFullUrl(activeFile.qrCode)}
                className="w-auto h-full max-w-full max-h-full min-h-full mt-auto rounded-[0.5vw] opacity-90"
              />
            </div>

            {/* TEXT */}
            <div className="w-full h-full overflow-hidden text-left [direction:ltr]">
              <span ref={qrTextRef} className="font-semibold text-white block leading-[1.4] text-[0.8vw]">
                {activeFile.description}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
