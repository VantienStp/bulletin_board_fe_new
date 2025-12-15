"use client";

export default function BackButton({ children }) {
    return (
        <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-900"
        >
            {children}
        </button>
    );
}
