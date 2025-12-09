"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./card.css";

export default function Card({ title, contents = [], style = {} }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [canClick, setCanClick] = useState(true);

  const hideTimer = useRef(null);


  const [pdfPage, setPdfPage] = useState(0);


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
      console.log(activeFile);

      intervalTime = 60000 + Math.floor(Math.random() * 30000);
    } else {

      intervalTime = 15000 + Math.floor(Math.random() * 15000);
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % contents.length);
    }, intervalTime);

    return () => clearTimeout(timerRef.current);
  }, [activeIndex, contents]);

  useEffect(() => {
    if (activeFile?.type === "pdf") {
      setPdfPage(0);
    }
  }, [activeIndex]);

  useEffect(() => {
    if (activeFile?.type !== "pdf") return;
    if (!activeFile.images || activeFile.images.length === 0) return;

    const timer = setTimeout(() => {
      setPdfPage((prev) => (prev + 1) % activeFile.images.length);
    }, 15000); // lật trang PDF sau moi 15s

    return () => clearTimeout(timer);
  }, [pdfPage, activeFile]);



  useEffect(() => {
    if (!showTitle) return;
    setDynamicSizes();
    window.addEventListener("resize", setDynamicSizes);

    return () => window.removeEventListener("resize", setDynamicSizes);
  }, [activeFile, showTitle]);


  useEffect(() => {
    if (activeFile?.type === "pdf" && activeFile?.url) {
      // 🧾 Gửi request để lấy header response của PDF
      fetch(activeFile.url, { method: "HEAD" })
        .then((res) => {
          // console.log("📄 PDF Headers for:", activeFile.url);
          for (const [key, value] of res.headers.entries()) {
            console.log(`   ${key}: ${value}`);
          }
        })
        .catch((err) => console.error("❌ Error fetching PDF headers:", err));
    }
  }, [activeFile]);

  const showOverlay = () => {
    clearTimeout(hideTimer.current);
    setShowTitle(true);
  };

  const hideOverlay = () => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setShowTitle(false);
    }, 5000); // 5 giây
  };


  function getFullUrl(path) {
    if (!path) return null; // tránh cảnh báo khi path rỗng
    if (path.startsWith("http")) return path;
    // return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
    return `${path.replace(/^\/+/, "")}`;
  }

  const setDynamicSizes = () => {
    const imageAndQRWrapper = wrapperRef.current;
    const contentInBottom = contentBottomRef.current;
    const qrCodeImg = qrImgRef.current;
    const qrText = qrTextRef.current;

    if (!imageAndQRWrapper || !contentInBottom || !qrCodeImg || !qrText) return;

    const wrapperWidth = imageAndQRWrapper.offsetWidth;
    const wrapperHeight = imageAndQRWrapper.offsetHeight;

    // ⭐ Tính kích thước cân bằng theo diện tích
    const area = wrapperWidth * wrapperHeight;
    const normalized = Math.sqrt(area); // kích thước đại diện cho khung
    let fontSize = normalized * 0.04;   // scale ổn hơn largerDimension

    // Giới hạn trên và dưới
    fontSize = Math.min(fontSize, 32);
    fontSize = Math.max(fontSize, 12);

    // ⭐ Các giá trị dựa trên dimension lớn nhất vẫn giữ như em
    const largerDimension = Math.max(wrapperWidth, wrapperHeight);
    const contentBottomHeight = largerDimension * 0.15;
    const qrSize = largerDimension * 0.15;

    // Apply vào UI
    contentInBottom.style.height = `${contentBottomHeight}px`;
    qrCodeImg.style.width = `${qrSize}px`;
    qrCodeImg.style.height = `${qrSize}px`;
    qrText.style.fontSize = `${fontSize}px`;

    // ⭐ Tính số dòng hiển thị
    const lineHeight = fontSize * 1.4;
    const maxLines = Math.floor(contentBottomHeight / lineHeight) - 1;

    // ⭐ Apply line-clamp
    qrText.style.display = "-webkit-box";
    qrText.style.webkitBoxOrient = "vertical";
    qrText.style.overflow = "hidden";
    qrText.style.webkitLineClamp = maxLines;
  };



  const handleClick = () => {
    if (!canClick) return;
    clearTimeout(timerRef.current);
    setActiveIndex((prev) => (prev + 1) % contents.length);
    setCanClick(false);
    setTimeout(() => setCanClick(true), 3000);
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
                key={activeIndex + "-" + pdfPage}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{
                  duration: 0.9,
                  ease: [0.45, 0, 0.55, 1],
                }}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, }}
              >
                {activeFile?.type === "image" && (
                  <img src={getFullUrl(activeFile.url)} alt={title} className="media-image"
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                    }}
                  />
                )}

                {activeFile?.type === "video" && (
                  <video src={getFullUrl(activeFile.url)} muted loop autoPlay playsInline controls className="media-video"
                    style={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "#000", }}
                  />
                )}

                {activeFile?.type === "pdf" && activeFile.images?.length > 0 && (
                  <img
                    src={getFullUrl(activeFile.images[pdfPage])}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <span>❌ Không có dữ liệu</span>
          )}
        </div>

        <div className="card-actions hidden-actions">
          <i className="fas fa-eye toggle-title-icon" onClick={() => setShowTitle(!showTitle)}></i>
          <i className="fas fa-redo reload-icon" onClick={() => setActiveIndex(0)}></i>
          <i className="fas fa-expand expand-icon"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("openLightbox", {
                  detail: {
                    ...activeFile,
                    url: getFullUrl(activeFile?.url),
                  },
                })
              );

              console.log("📢 Lightbox event dispatched!");
            }}
          ></i>

        </div>

        {showTitle && activeFile?.qrCode && (
          <div className="content-in-bottom" ref={contentBottomRef}>
            <div className="qr-overlay">
              <img ref={qrImgRef} src={getFullUrl(activeFile.qrCode)} alt="QR Code" className="qr-code-img" />
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
