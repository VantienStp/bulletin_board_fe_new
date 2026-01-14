"use client";

import Link from "next/link";

export default function CategoryTable({ categories, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="
                grid grid-cols-[1fr_60px_100px_2fr_1.2fr_200px] 
                px-6 py-4 font-semibold text-gray-600
                border-b text-sm
            ">
                <div>Tên danh mục</div>
                <div className="text-center">Thứ tự</div>
                <div className="text-center">Icon</div>
                <div>Mô tả</div>
                <div>Layout</div>
                <div className="text-center">Actions</div>
            </div>

            <div className="divide-y">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="
                            grid grid-cols-[1fr_60px_100px_2fr_1.2fr_200px] 
                            px-6 py-2 items-center
                            hover:bg-gray-50 transition
                            text-sm
                        "
                    >
                        <div className="font-medium">{cat.title}</div>

                        <div className="text-center font-bold text-blue-600 bg-blue-50 py-1 rounded">
                            {cat.order}
                        </div>

                        <div className="text-center text-xl">
                            {cat.icon ? <i className={cat.icon} /> : "—"}
                        </div>

                        <div className="text-gray-700">
                            {cat.description || "—"}
                        </div>

                        <div>
                            {cat.layoutTitle}
                        </div>

                        <div className="flex justify-center gap-2">
                            <Link
                                href={`/admin/categories/${cat.id}`}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 w-20 text-center"
                            >
                                View
                            </Link>

                            <button
                                onClick={() => onEdit(cat)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 w-20"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => onDelete(cat.id)}
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