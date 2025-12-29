// src/app/(admin)/admin/components/TimeTracker.jsx
export default function TimeTracker() {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <p className="text-sm font-semibold text-gray-800 mb-3">Time Tracker</p>
            <div className="w-full aspect-[5/2] rounded-2xl bg-gradient-to-br from-green-700 to-green-500 flex flex-col items-center justify-center text-white mb-4">
                <span className="text-xs uppercase tracking-wide opacity-80 mb-1">
                    Working Time
                </span>
                <span className="text-2xl font-bold">01:24:08</span>
            </div>
            <div className="flex gap-3 justify-center">
                <button className="px-4 py-1.5 rounded-full bg-green-600 text-white text-sm">
                    ▶ Start
                </button>
                <button className="px-4 py-1.5 rounded-full bg-red-500 text-white text-sm">
                    ⏸ Pause
                </button>
            </div>
        </div>
    );
}
