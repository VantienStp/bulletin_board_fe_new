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
    let intervalTime = 10000;

    if (current.type === "video") {
      intervalTime = 60000;
    } else if (current.type === "pdf") {
      intervalTime = 60000 + Math.floor(Math.random() * 30000);
    } else {
      intervalTime = 5000 + Math.floor(Math.random() * 5000);
    }

    clearTimeout(timerRef.current);
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

  useEffect(() => {
  if (activeFile?.type === "pdf" && activeFile?.url) {
    // 🧾 Gửi request để lấy header response của PDF
    fetch(activeFile.url, { method: "HEAD" })
      .then((res) => {
        console.log("📄 PDF Headers for:", activeFile.url);
        for (const [key, value] of res.headers.entries()) {
          console.log(`   ${key}: ${value}`);
        }
      })
      .catch((err) => console.error("❌ Error fetching PDF headers:", err));
  }
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
    if (!canClick) return;
    setActiveIndex((prev) => (prev + 1) % contents.length);
    setCanClick(false);
    setTimeout(() => setCanClick(true), 7000);
  };

  return (
    <div className="card" style={style}>
      <div className="title">
        <span>{title}</span>
      </div>

      <div className="image-and-qr-wrapper" ref={wrapperRef}>
        <div className="image-container" onClick={handleClick}>
          {contents.length > 0 ? (
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={activeIndex}
                initial={{ y: 100, opacity: 0 }}       // ảnh mới từ dưới đi lên
                animate={{ y: 0, opacity: 1 }}         // ảnh mới vào giữa
                exit={{ y: -100, opacity: 0 }}         // ảnh cũ đi lên và biến mất
                transition={{
                  duration: 0.9,
                  ease: [0.45, 0, 0.55, 1], // ease mượt hơn cubic-bezier
                }}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1,}}
              >
                {activeFile?.type === "image" && (
                  <img src={encodeURI(`${BASE_URL}/${activeFile.url}`)} alt={title} className="media-image"
                    style={{ width: "100%", height: "100%", objectFit: "cover",
                    }}
                  />
                )}

                {activeFile?.type === "video" && (
                  <video src={encodeURI(`${BASE_URL}/${activeFile.url}`)} muted loop autoPlay playsInline controls className="media-video"
                    style={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "#000",}}
                  />
                )}

                {activeFile?.type === "pdf" && (
                  <iframe src={encodeURI(`${BASE_URL}/${activeFile.url}`)} title="PDF Viewer" className="media-pdf" frameBorder="0"
                    style={{ width: "100%", height: "100%", border: "none"}}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <span>❌ Không có dữ liệu</span>
          )}
        </div>

        <div className="card-actions" style={ activeFile?.type === "pdf" ? { paddingRight: "7.4vw", paddingTop: "0.3vw" }: {}}>
          <i className="fas fa-eye toggle-title-icon" onClick={() => setShowTitle(!showTitle)}></i>
          {activeFile?.type !== "video" && activeFile?.type !== "pdf" && (
            <>
              <i className="fas fa-redo reload-icon" onClick={() => setActiveIndex(0)}></i>
              <i className="fas fa-expand expand-icon"
                onClick={() => window.dispatchEvent( new CustomEvent("openLightbox", { detail: activeFile }) )}
              ></i>
            </>
          )}
        </div>

        {showTitle && activeFile?.qrCode && (
          <div className="content-in-bottom" ref={contentBottomRef}>
            <div className="qr-overlay">
              <img ref={qrImgRef} src={activeFile.qrCode} alt="QR Code" className="qr-code-img"/>
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
