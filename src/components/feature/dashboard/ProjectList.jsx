// src/app/(admin)/admin/components/ProjectList.jsx
const defaultProjects = [
    { title: "Develop API Endpoints", date: "Nov 26, 2024" },
    { title: "Onboarding Flow", date: "Nov 28, 2024" },
    { title: "Build Dashboard", date: "Nov 30, 2024" },
    { title: "Optimize Page Load", date: "Dec 5, 2024" },
    { title: "Cross-Browser Testing", date: "Dec 6, 2024" },
];

export default function ProjectList({ projects = defaultProjects }) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-800">Project</h3>
                <button className="text-xs text-green-600 font-medium">+ New</button>
            </div>

            <ul className="space-y-3">
                {projects.map((p, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{p.title}</p>
                            <p className="text-xs text-gray-500">Due date: {p.date}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                    </li>
                ))}
            </ul>
        </div>
    );
}
