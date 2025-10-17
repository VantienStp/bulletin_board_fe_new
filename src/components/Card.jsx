"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./card.css";

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

  useEffect(() => {
    if (!contents || contents.length === 0) return;

    const current = contents[activeIndex];
    let intervalTime = 10000; // mặc định 10s

    if (current.type === "video") {
      intervalTime = 60000; // video 60s
    } else if (current.type === "pdf") {
      // PDF 60–90s
      intervalTime = 60000 + Math.floor(Math.random() * 30000);
    } else {
      // Ảnh 30–60s
      intervalTime = 30000 + Math.floor(Math.random() * 30000);
    }

    // Nếu đang có timer cũ thì clear đi
    clearTimeout(timerRef.current);

    // Tạo timer mới cho nội dung hiện tại
    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % contents.length);
    }, intervalTime);

    return () => clearTimeout(timerRef.current);
  }, [activeIndex, contents]);

  useEffect(() => {
    setDynamicSizes(); 

    window.addEventListener("resize", setDynamicSizes);
    return () => window.removeEventListener("resize", setDynamicSizes);
  }, [activeFile]);

  const setDynamicSizes = () => {
    const imageAndQRWrapper = wrapperRef.current;
    const contentInBottom = contentBottomRef.current;
    const qrCodeImg = qrImgRef.current;
    const qrText = qrTextRef.current;

    if (!imageAndQRWrapper || !contentInBottom || !qrCodeImg || !qrText) return;

    const wrapperWidth = imageAndQRWrapper.offsetWidth;
    const wrapperHeight = imageAndQRWrapper.offsetHeight;

    const largerDimension = Math.max(wrapperWidth, wrapperHeight);

    const contentBottomHeight = largerDimension * 0.15;
    const qrSize = largerDimension * 0.15;
    const fontSize = largerDimension * 0.025;

    contentInBottom.style.height = `${contentBottomHeight}px`;
    qrCodeImg.style.width = `${qrSize}px`;
    qrCodeImg.style.height = `${qrSize}px`;
    qrText.style.fontSize = `${fontSize}px`;
  };

  const handleClick = () => {
    if (!canClick) return; // 🚫 nếu đang trong thời gian chờ, bỏ qua click

    setActiveIndex((prev) => (prev + 1) % contents.length);
    setCanClick(false); // 🔒 khóa click

    // ⏱️ Mở lại sau 7 giây
    setTimeout(() => setCanClick(true), 7000);
  };
 
  return (
    <div className="card" style={style}>
      <div className="title">
        <span>{title}</span>
      </div>

      <div className="image-and-qr-wrapper" ref={wrapperRef}>
        <div
          className="image-container"
          onClick={handleClick}
          style={{ cursor: "pointer" }} // không đổi icon khi bị khóa
>
          {activeFile ? (
            <>
              {activeFile.type === "image" && (
                <img src={activeFile.url} alt={title} className="active media-image" />
              )}
              {activeFile.type === "video" && (
                <video
                  src={activeFile.url}
                  muted
                  loop
                  autoPlay
                  playsInline
                  controls
                  className="active media-video"
                />
              )}
              {activeFile.type === "pdf" && (
                <iframe
                  src={activeFile.url}
                  title="PDF Viewer"
                  className="active media-pdf"
                  frameBorder="0"
                />
              )}
            </>
          ) : (
            <span>❌ Không có dữ liệu</span>
          )}
        </div>
        <div className="card-actions" 
          style={activeFile?.type === "pdf" ? { paddingRight: "7.4vw", paddingTop: "0.3vw" } : {}}>
          <i className="fas fa-eye toggle-title-icon" onClick={() => setShowTitle(!showTitle)}></i>
          {activeFile?.type !== "video" && activeFile?.type !== "pdf" && (
            <>
              <i className="fas fa-redo reload-icon" onClick={() => setActiveIndex(0)}></i>
              <i className="fas fa-expand expand-icon" onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("openLightbox", { detail: activeFile })
                  )
                }
              ></i>
            </>
          )}
        </div>


        {showTitle && activeFile?.qrCode && (
          <div className="content-in-bottom" ref={contentBottomRef}>
            <div className="qr-overlay">
              <img ref={qrImgRef} src={activeFile.qrCode} alt="QR Code" className="qr-code-img" />
            </div>
            <div className="text-right">
              <span className="qr-text" ref={qrTextRef}>
                {activeFile.description || "Không có mô tả"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}
