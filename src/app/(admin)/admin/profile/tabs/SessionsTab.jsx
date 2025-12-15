export default function SessionsTab() {
    const sessions = [
        { device: "Chrome on Windows", ip: "113.23.44.12", last: "2 hours ago" },
        { device: "iPhone 12", ip: "113.23.44.12", last: "Yesterday" },
    ];

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl">
            <h2 className="text-lg font-semibold mb-4">Active Sessions</h2>

            <div className="space-y-4">
                {sessions.map((s, i) => (
                    <div key={i} className="p-4 border rounded-lg flex justify-between">
                        <div>
                            <p className="font-semibold">{s.device}</p>
                            <p className="text-sm text-gray-500">{s.ip}</p>
                        </div>
                        <p className="text-sm text-gray-400">{s.last}</p>
                    </div>
                ))}
            </div>

            <button className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg">
                Logout All Devices
            </button>
        </div>
    );
}
