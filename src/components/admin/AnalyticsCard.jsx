// src/app/(admin)/admin/components/AnalyticsCard.jsx
export default function AnalyticsCard() {
    const bars = [40, 65, 90, 70, 50, 30, 20];
    const days = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-gray-800 text-sm">Project Analytics</p>
                <span className="text-xs text-gray-400">This week</span>
            </div>

            <div className="flex items-end justify-between h-32 mb-4">
                {bars.map((h, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                        <div
                            className="w-6 rounded-full bg-gradient-to-t from-green-600 to-green-400"
                            style={{ height: `${h}%` }}
                        />
                        <span className="text-[11px] text-gray-500">{days[idx]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
