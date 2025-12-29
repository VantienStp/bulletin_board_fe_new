"use client";

import Link from "next/link";

export default function ContentTable({ contents, onEdit, onDelete }) {
    // Helper render preview dựa trên loại file
    const renderPreview = (c) => {
        if (c.isImage) {
            return <img src={c.fullUrl} className="w-full h-full object-cover" alt="preview" />;
        }
        if (c.isVideo) {
            return <video src={c.fullUrl} className="w-full h-full object-cover" controls />;
        }
        if (c.isPdf) {
            return <iframe src={c.fullUrl} className="w-full h-full" title="pdf preview" />;
        }
        return <div className="text-gray-400 text-xs">Unsupported type</div>;
    };

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* HEADER */}
            <div className="grid grid-cols-[0.5fr_1fr_0.5fr_0.5fr_120px] px-6 py-4 font-semibold text-gray-600 text-center border-b text-sm">
                <div>File</div>
                <div>Mô tả</div>
                <div>Loại</div>
                <div>QR</div>
                <div>Actions</div>
            </div>

            {/* ROWS */}
            <div className="divide-y">
                {contents.map((c, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-[0.5fr_1fr_0.5fr_0.5fr_120px] px-6 py-2 items-center text-sm hover:bg-gray-50"
                    >
                        {/* 1. Preview File */}
                        <div className="h-24 w-48 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 border">
                            {renderPreview(c)}
                        </div>

                        {/* 2. Description */}
                        <div className="text-gray-700 px-2 line-clamp-3">
                            {c.description || "—"}
                        </div>

                        {/* 3. Type */}
                        <div className="text-center font-medium uppercase text-xs tracking-wider text-gray-500">
                            {c.type}
                        </div>

                        {/* 4. QR Code */}
                        <div className="flex justify-center">
                            {c.qrCodeUrl ? (
                                <img src={c.qrCodeUrl} className="w-20 h-20 object-contain border p-1 bg-white" alt="qr" />
                            ) : (
                                "—"
                            )}
                        </div>

                        {/* 5. Actions */}
                        <div className="flex flex-col gap-2 justify-center items-center">
                            {c.fullUrl && (
                                <Link
                                    href={c.fullUrl}
                                    target="_blank"
                                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs text-center hover:bg-blue-600 w-20"
                                >
                                    View
                                </Link>
                            )}

                            <button
                                onClick={() => onEdit(c, i)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600 w-20"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => onDelete(i)}
                                className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 w-20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}