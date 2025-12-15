// src/app/(admin)/admin/components/StatCard.jsx
export default function StatCard({ title, value, note, accent = "green" }) {
    const accentColor =
        accent === "green"
            ? "bg-green-100 text-green-700"
            : accent === "orange"
                ? "bg-orange-100 text-orange-700"
                : "bg-slate-100 text-slate-700";

    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <p className="text-xs font-medium text-gray-500">{title}</p>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                    <i className="fa-solid fa-arrow-up-right text-gray-600" />
                </button>
            </div>
            {note && (
                <p className={`text-[11px] inline-flex items-center px-2 py-1 rounded-full ${accentColor}`}>
                    <i className="fa-solid fa-arrow-up-right mr-1 text-[10px]" />
                    {note}
                </p>
            )}
        </div>
    );
}
