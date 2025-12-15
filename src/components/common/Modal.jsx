"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import "@/styles/modal.css";
import { FaTimes } from "react-icons/fa";

export default function Modal({
  title,
  onClose,
  children,
  width = "50%",
  height = "auto",
  maxWidth = "80%",
  maxHeight = "90%",
  minHeight = "50%",
  minWidth = "50%",
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ width, height, maxWidth, maxHeight, minHeight, minWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span>{title}</span>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
