"use client";

export default function UserTable({ users, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-[2fr_1.5fr_1fr_100px] px-6 py-4 font-semibold text-gray-600 border-b gap-4 text-[14px] text-center">
                <div className="pl-5 text-left">User</div>
                <div className="text-left">Email</div>
                <div>Role</div>
                <div>Actions</div>
            </div>

            <div className="divide-y">
                {users.map((u) => (
                    <div key={u.id} className="grid grid-cols-[2fr_1.5fr_1fr_100px] px-6 py-3 items-center hover:bg-gray-50 transition gap-4 text-[13px]">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 border border-gray-300 overflow-hidden shrink-0">
                                {u.avatar ? (
                                    <img
                                        src={u.avatar}
                                        alt={u.username}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerText = u.avatarInitial;
                                        }}
                                    />
                                ) : (
                                    u.avatarInitial
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{u.username}</p>
                                <p className="text-[11px] text-gray-400 font-mono">ID: {u.id.slice(-6)}</p>
                            </div>
                        </div>

                        <div className="text-left text-gray-700 truncate">
                            {u.email}
                        </div>

                        <div className="text-center">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                    u.role === 'editor' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        'bg-gray-50 text-gray-600 border-gray-200'
                                }`}>
                                {u.roleLabel}
                            </span>
                        </div>

                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => onEdit(u)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded-md text-xs hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(u.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}