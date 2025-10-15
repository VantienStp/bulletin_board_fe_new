// src/components/Loader.jsx
"use client";

import React from 'react';

// Component Loader đơn giản sử dụng CSS để tạo hiệu ứng xoay
const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full my-10">
      {/* Icon spinner */}
      <div 
        className="w-12 h-12 border-4 border-t-4 border-blue-500 border-opacity-25 rounded-full animate-spin"
        style={{ borderTopColor: 'rgb(59, 130, 246)' }} // Màu xanh đậm hơn cho phần xoay
        role="status"
      >
        <span className="sr-only">Đang tải...</span>
      </div>
    </div>
  );
};

export default Loader;