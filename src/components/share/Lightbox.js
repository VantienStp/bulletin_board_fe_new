"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

export default function Lightbox() {
  const [file, setFile] = useState(null);

  // Lắng nghe sự kiện mở Lightbox
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

  // ESC để đóng
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && setFile(null);
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (!file) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="
          fixed inset-0 z-[99999]
          bg-black/75 backdrop-blur-md
          flex items-center justify-center
        "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setFile(null)}
      >
        {/* Content Box */}
        <motion.div
          className="
            relative bg-black 
            max-w-[90vw] max-h-[100vh] 
            rounded-xl overflow-hidden 
            flex items-center justify-center
          "
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {/* Nút X */}
          <button
            onClick={() => setFile(null)}
            className="
              absolute top-3 right-3
              bg-white/20 hover:bg-black/60
              text-white p-2 rounded-full
              transition flex items-center justify-center
            "
          >
            <FaTimes size={20} />
          </button>

          {/* Ảnh */}
          {file.type === "image" && (
            <img
              src={file.url}
              alt="preview"
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
          )}

          {/* Video */}
          {file.type === "video" && (
            <video
              src={file.url}
              autoPlay
              loop
              controls
              className="w-[80vw] max-h-[90vh] object-contain bg-black"
            />
          )}

          {/* PDF */}
          {file.type === "pdf" && (
            <iframe
              src={file.url}
              title="PDF"
              className="w-[90vw] h-[100vh] border-none"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
