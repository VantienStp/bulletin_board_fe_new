"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Card({ title, contents = [], style = {} }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(true);

  const wrapperRef = useRef(null);
  const contentBottomRef = useRef(null);
  const qrImgRef = useRef(null);
  const qrTextRef = useRef(null);

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

  // Auto slideshow
  useEffect(() => {
    if (!contents || contents.length === 0) return;

    const intervalTime =
      contents[activeIndex]?.type === "video" ? 60000 : 10000;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % contents.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [activeIndex, contents]);



  const activeFile = contents[activeIndex];

  useEffect(() => {
    setDynamicSizes(); 

    window.addEventListener("resize", setDynamicSizes);
    return () => window.removeEventListener("resize", setDynamicSizes);
  }, [activeFile]);

  return (
    <div className="card" style={style}>
      <div className="title">
        <span>{title}</span>
      </div>

      <div className="image-and-qr-wrapper" ref={wrapperRef}>
        <div className="image-container">
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
        <div className="card-actions">
          <i className="fas fa-eye toggle-title-icon" onClick={() => setShowTitle(!showTitle)}></i>
          <i className="fas fa-redo reload-icon" onClick={() => setActiveIndex(0)}></i>
          <i className="fas fa-expand expand-icon" onClick={() => window.dispatchEvent(new CustomEvent("openLightbox", { detail: activeFile }))}></i>
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
