"use client";
import React from "react";
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
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ width, height, maxWidth, maxHeight, minHeight, minWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span style={{
            // color: title === "Sửa nội dung" ? "var(--clr-accent-yellow)" : "var(--clr-accent-blue)"
          }}>{title}</span>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
