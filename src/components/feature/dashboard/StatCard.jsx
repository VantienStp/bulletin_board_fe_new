// src/components/feature/dashboard/StatCard.jsx
export default function StatCard({ title, value, note, accent = "green", icon }) {
    const colors = {
        green: { bg: "bg-green-50", text: "text-green-600", iconBg: "bg-green-100" },
        blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
        orange: { bg: "bg-orange-50", text: "text-orange-600", iconBg: "bg-orange-100" },
        purple: { bg: "bg-purple-50", text: "text-purple-600", iconBg: "bg-purple-100" },
        slate: { bg: "bg-slate-50", text: "text-slate-600", iconBg: "bg-slate-100" },
    };

    const theme = colors[accent] || colors.green;

    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-shadow">

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
                    <h2 className="text-3xl font-bold text-gray-800 mt-1">{value}</h2>
                </div>

                {/* Icon Circle */}
                <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} ${theme.text} flex items-center justify-center text-xl shadow-sm`}>
                    {icon}
                </div>
            </div>

            {/* Footer / Note */}
            {note && (
                <div className="mt-auto">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${theme.bg} ${theme.text}`}>
                        {note}
                    </span>
                </div>
            )}
        </div>
    );
}