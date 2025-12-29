"use client";

import Link from "next/link";

export default function LayoutTable({ layouts, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* HEADER */}
            <div className="
          grid grid-cols-[1fr_0.8fr_0.6fr_1.2fr_100px]
          px-6 py-4 font-semibold text-gray-600
          border-b gap-4 text-[14px] text-center
        ">
                <div className="text-left">Tên bố cục</div>
                <div>Slug</div>
                <div>Số card</div>
                <div>Xem nhanh</div>
                <div>Actions</div>
            </div>

            {/* ROWS */}
            <div className="divide-y">
                {layouts.map((l) => (
                    <div
                        key={l.id}
                        className="
                grid grid-cols-[1fr_0.8fr_0.6fr_1.2fr_100px]
                px-6 py-2 items-center
                hover:bg-gray-50 transition
                gap-4 text-[13px]
              "
                    >
                        {/* Title & Slug */}
                        <div className="font-medium">{l.title}</div>
                        <div className="text-center text-gray-600">{l.slug}</div>

                        {/* Card Count (Đã tính ở Adapter) */}
                        <div className="text-center font-medium">
                            {l.cardCount}
                        </div>

                        {/* PREVIEW GRID - Dùng CSS từ Adapter */}
                        <div className="flex justify-center">
                            <div
                                className="inline-grid bg-gray-100 p-2 rounded-md gap-1"
                                style={{
                                    gridTemplateColumns: l.gridTemplateColumns,
                                    gridTemplateRows: l.gridTemplateRows,
                                }}
                            >
                                {l.config.positions.map((pos, i) => (
                                    <div
                                        key={i}
                                        className="bg-blue-500/80 rounded-sm"
                                        style={{
                                            gridColumn: `${pos.x + 1} / span ${pos.w}`,
                                            gridRow: `${pos.y + 1} / span ${pos.h}`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1 text-center">
                            <Link
                                href={`/admin/layouts/${l.id}`}
                                className="px-3 py-0.5 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => onDelete(l.id)}
                                className="px-3 py-0.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
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