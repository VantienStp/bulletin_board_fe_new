"use client";

export default function SearchInput({
    value,
    onChange,
    onFocusChange,
    placeholder = "Search...",
    className = "w-80" // Cho phép tùy chỉnh độ rộng nếu cần
}) {
    return (
        <div className={`flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 focus-within:border-gray-300 transition-all ${className}`}>
            {/* ICON SEARCH */}
            <span className="material-symbols-outlined text-gray-400 text-base mr-2">
                search
            </span>

            {/* INPUT CHÍNH */}
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => onFocusChange?.(true)}
                onBlur={() => onFocusChange?.(false)}
                className="flex-1 text-sm outline-none bg-transparent placeholder:text-gray-400"
                placeholder={placeholder}
            />

            {/* NÚT XÓA NHANH (Chỉ hiện khi có chữ) */}
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition"
                >
                    <span className="material-symbols-outlined text-base">
                        close
                    </span>
                </button>
            )}
        </div>
    );
}