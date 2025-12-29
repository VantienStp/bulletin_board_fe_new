// src/app/(admin)/admin/loading.jsx
export default function Loading() {
    return (
        <div className="w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50">
            {/* Spinner xoay */}
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4 shadow-sm"></div>

            {/* Text nhấp nháy */}
            <p className="text-gray-500 text-sm font-medium animate-pulse">
                Đang tải dữ liệu...
            </p>
        </div>
    );
}