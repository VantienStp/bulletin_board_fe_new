"use client";

import Link from "next/link";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

export default function CardTable({ cards, onEdit, onDelete }) {

    const renderStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-semibold">Chờ</span>;
            case "expired":
                return <span className="text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold">Hết hạn</span>;
            case "active":
            default:
                return <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold">Live</span>;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-[1.5fr_100px_100px_200px_120px_240px] px-6 py-4 font-semibold text-gray-600 border-b text-sm">
                <div>Tiêu đề</div>
                <div className="text-center">Nội dung</div>
                <div className="text-center">Status</div>
                <div className="text-center">Thời gian</div>
                <div className="text-center">Chế độ</div>
                <div className="text-center">Actions</div>
            </div>

            <div className="divide-y">
                {cards.map((card) => (
                    <div key={card.id} className="grid grid-cols-[1.5fr_100px_100px_200px_120px_240px] px-6 py-3 items-center hover:bg-gray-50 transition text-sm">
                        <div className="font-medium truncate pr-4">{card.title}</div>

                        <div className="text-center">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{card.contentCount}</span>
                        </div>

                        <div className="text-center">{renderStatusBadge(card.status)}</div>

                        <div className="text-center text-xs text-gray-500">
                            <div className="flex flex-col">
                                <span>S: {card.startDateDisplay}</span>
                                <span>E: {card.endDateDisplay}</span>
                            </div>
                        </div>

                        <div className="text-center">
                            {card.isWorkDaysOnly ? (
                                <span className="text-blue-500 text-xs flex items-center justify-center gap-1">
                                    <FaClock /> {card.typeLabel}
                                </span>
                            ) : (
                                <span className="text-gray-400 text-xs flex items-center justify-center gap-1">
                                    <FaCalendarAlt /> {card.typeLabel}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-center gap-2">
                            <Link href={`/admin/cards/${card.id}`} className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600">
                                View
                            </Link>
                            <button onClick={() => onEdit(card)} className="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600">
                                Edit
                            </button>
                            <button onClick={() => onDelete(card.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}