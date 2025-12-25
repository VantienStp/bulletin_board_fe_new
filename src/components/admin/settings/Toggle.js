"use client";
import { useState } from "react";

export default function Toggle({ label, defaultOn = false }) {
    const [on, setOn] = useState(defaultOn);
    return (
        <div className="flex flex-col items-center gap-2">
            <button
                type="button"
                onClick={() => setOn(!on)}
                className={`relative w-12 h-6 transition-all duration-300 rounded-full outline-none p-1 ${on ? "bg-gray-900" : "bg-gray-300"
                    }`}
            >
                <div
                    className={`w-4 h-4 transition-all duration-300 bg-white rounded-full shadow-sm transform ${on ? "translate-x-6" : "translate-x-0"
                        }`}
                />
            </button>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
    );
}