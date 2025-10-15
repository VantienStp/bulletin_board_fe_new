"use client";

import { useEffect, useState } from "react";

export default function Lightbox({ file, onClose }) {
  const [currentPage, setCurrentPage] = useState(file?.page || 1);

  useEffect(() => {
    setCurrentPage(file?.page || 1);
  }, [file]);

  if (!file) return null;

  const renderContent = () => {
    if (file.type === "image") {
      return <img src={file.src} alt="Lightbox" className="lightbox-media" />;
    } else if (file.type === "video") {
      return (
        <video
          src={file.src}
          controls
          autoPlay
          loop
          muted
          className="lightbox-media"
        />
      );
    } else if (file.type === "pdf") {
      const pages = Array.from({ length: file.totalPages }, (_, i) => i + 1);

      return (
        <div className="lightbox-pdf-container">
          {pages.map((p) => (
            <img
              key={p}
              src={`${file.folder}/page_${p}.jpg`}
              alt={`Page ${p}`}
              style={{
                display: p === currentPage ? "block" : "none",
                maxHeight: "80vh",
                borderRadius: "1vw",
              }}
            />
          ))}
          {/* Controls */}
          <button
            className="pdf-prev"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ◀
          </button>
          <span className="pdf-indicator">
            {currentPage} / {file.totalPages}
          </span>
          <button
            className="pdf-next"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, file.totalPages))
            }
            disabled={currentPage === file.totalPages}
          >
            ▶
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()} // không đóng khi click vào trong
      >
        {renderContent()}
        <button className="lightbox-close" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
}
