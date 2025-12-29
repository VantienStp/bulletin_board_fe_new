// src/app/(admin)/admin/components/ReminderCard.jsx
export default function ReminderCard() {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-2">Reminders</p>
            <h3 className="text-sm font-semibold text-gray-900">
                Meeting with Arc Company
            </h3>
            <p className="text-xs text-gray-500 mb-4">Time: 02:00 pm – 04:00 pm</p>
            <button className="w-full py-2 text-sm rounded-full bg-green-600 text-white font-medium hover:bg-green-700">
                Start Meeting
            </button>
        </div>
    );
}
