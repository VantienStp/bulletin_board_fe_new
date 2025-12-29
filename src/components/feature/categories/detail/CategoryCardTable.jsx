"use client";

import Link from "next/link";

export default function CategoryCardTable({ cards, onRemove }) {
    if (cards.length === 0) {
        return (
            <div className="px-6 py-10 text-center text-gray-400 border-b italic">
                Danh mục này chưa có thẻ nào.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* HEADER */}
            <div className="
          grid grid-cols-[1fr_160px_260px]
          px-6 py-3 font-semibold text-gray-600
          border-b text-sm
        ">
                <div>Tiêu đề</div>
                <div className="text-center">Số nội dung</div>
                <div className="text-center">Actions</div>
            </div>

            {/* ROWS */}
            <div className="divide-y">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className="
                grid grid-cols-[1fr_160px_260px]
                px-6 py-2 items-center
                hover:bg-gray-50 transition
                text-sm
              "
                    >
                        <div className="font-medium">{card.title}</div>

                        <div className="text-center">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {card.contentCount}
                            </span>
                        </div>

                        <div className="flex justify-center gap-2">
                            <Link
                                href={`/admin/cards/${card.id}`}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 w-20 text-center"
                            >
                                View
                            </Link>

                            <button
                                onClick={() => onRemove(card.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 w-20"
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