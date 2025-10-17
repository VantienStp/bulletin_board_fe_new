"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LightboxViewer() {
  const [file, setFile] = useState(null);

  // 🧭 Lắng nghe sự kiện từ window
  useEffect(() => {
    const handleOpen = (e) => setFile(e.detail);
    const handleClose = (e) => setFile(null);
    window.addEventListener("openLightbox", handleOpen);
    window.addEventListener("closeLightbox", handleClose);
    return () => {
      window.removeEventListener("openLightbox", handleOpen);
      window.removeEventListener("closeLightbox", handleClose);
    };
  }, []);

  // 🚪 Đóng khi nhấn ESC
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && setFile(null);
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!file) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => setFile(null)}
      >
        <motion.div
          className="lightbox-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {file.type === "image" && (
            <img src={file.url} alt="Lightbox" className="lightbox-media" />
          )}

          {file.type === "video" && (
            <video
              src={file.url}
              controls
              autoPlay
              loop
              playsInline
              className="lightbox-media"
            />
          )}

          {file.type === "pdf" && (
            <iframe
              src={file.url}
              title="PDF Viewer"
              className="lightbox-media"
              frameBorder="0"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
