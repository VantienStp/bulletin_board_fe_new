export default function NotificationsTab() {
    const settings = [
        { label: "Email me when I receive a message" },
        { label: "Notify me about updates" },
        { label: "Weekly summary notifications" },
    ];

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl space-y-4">
            <h2 className="text-lg font-semibold">Notification Settings</h2>

            {settings.map((s, i) => (
                <label key={i} className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4" />
                    {s.label}
                </label>
            ))}

            <button className="mt-4 px-4 py-2 bg-black text-white rounded-lg">
                Save Preferences
            </button>
        </div>
    );
}
