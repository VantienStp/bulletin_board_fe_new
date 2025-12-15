import Link from "next/link";

export default function ProjectCard({ p, variant = "small" }) {
    const isList = variant === "list";

    return (
        <div
            className={`
                bg-white rounded-xl shadow p-4 m-2 overflow-hidden
                transition-all duration-300 transform
                hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md
                ${isList ? "grid grid-cols-1 md:grid-cols-3 gap-6" : ""}
            `}
        >
            {/* IMAGE */}
            <img
                src={p.image}
                alt={p.title}
                className={`
                    rounded-xl w-full object-cover
                    ${isList ? "h-full max-h-56" : "h-40"}
                `}
            />

            {/* CONTENT */}
            <div className={`${isList ? "col-span-2" : ""} space-y-3 mt-4`}>
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="text-gray-600">{p.desc}</p>

                {/* BASIC INFO */}
                <div className="flex gap-6 text-sm text-gray-500">
                    <span>📍 {p.location}</span>
                    <span>🗓 {p.start} → {p.end}</span>
                </div>

                {/* EXTRA INFO FOR LIST */}
                {isList && (
                    <div className="space-y-2 text-sm text-gray-600">

                        {p.techStack && (
                            <div className="flex flex-wrap gap-2">
                                {p.techStack.map((tech, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-gray-100 rounded-md text-xs"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {p.role && <p><strong>Role:</strong> {p.role}</p>}
                            {p.type && <p><strong>Type:</strong> {p.type}</p>}
                            {p.status && <p><strong>Status:</strong> {p.status}</p>}
                        </div>
                    </div>
                )}

                {/* VIEW MORE */}
                <Link href={`/projects/${p.slug}`}>
                    <div className="cursor-pointer text-yellow-500 font-semibold hover:underline block pt-4">
                        View more →
                    </div>
                </Link>
            </div>
        </div>
    );
}
