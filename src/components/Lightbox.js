"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import "./lightbox.css";

export default function Lightbox() {
  const [file, setFile] = useState(null);

  useEffect(() => {
    const handleOpen = (e) => setFile(e.detail);
    const handleClose = () => setFile(null);

    window.addEventListener("openLightbox", handleOpen);
    window.addEventListener("closeLightbox", handleClose);

    return () => {
      window.removeEventListener("openLightbox", handleOpen);
      window.removeEventListener("closeLightbox", handleClose);
    };
  }, []);

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
        onClick={() => setFile(null)}
      >
        <motion.div
          className="lightbox-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Nút X */}
          <button className="lightbox-close" onClick={() => setFile(null)}>
            <FaTimes size={20} />
          </button>

          {/* Nội dung theo loại file */}
          {file.type === "image" && (
            <img src={file.url} className="lightbox-media img" alt="preview" />
          )}

          {file.type === "video" && (
            <video
              src={file.url}
              autoPlay
              loop
              controls
              className="lightbox-media video"
            />
          )}

          {file.type === "pdf" && (
            <iframe
              src={file.url}
              title="PDF"
              className="lightbox-media pdf"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
