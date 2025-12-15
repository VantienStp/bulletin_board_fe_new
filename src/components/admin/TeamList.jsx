// src/app/(admin)/admin/components/TeamList.jsx
const defaultMembers = [
    {
        name: "Alexandra Deff",
        role: "Working on GitHub Project Repository",
        status: "Completed",
        color: "bg-green-500",
        avatar: "/avatar1.png",
    },
    {
        name: "Edwin Adenike",
        role: "Integrate User Authentication System",
        status: "In Progress",
        color: "bg-yellow-400",
        avatar: "/avatar2.png",
    },
    {
        name: "Isaac Oluwatemilorun",
        role: "Search and Filter Functionality",
        status: "In Review",
        color: "bg-blue-500",
        avatar: "/avatar3.png",
    },
];

export default function TeamList({ members = defaultMembers }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-800">Team Collaboration</h3>
                <button className="text-xs text-green-600 font-medium">+ Add Member</button>
            </div>

            <ul className="space-y-4">
                {members.map((m, i) => (
                    <li key={i} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <img
                                src={m.avatar}
                                alt={m.name}
                                className="w-9 h-9 rounded-full object-cover"
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                                <p className="text-xs text-gray-500">{m.role}</p>
                            </div>
                        </div>
                        <span
                            className={`text-[11px] text-white px-2 py-1 rounded-full ${m.color}`}
                        >
                            {m.status}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
