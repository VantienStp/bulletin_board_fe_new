"use client";

import { FaCircle, FaEdit, FaWifi } from "react-icons/fa";

export default function DeviceTable({ devices, onEdit }) {
    
    // Helper check status để hiển thị UI (giống logic trong hook)
    const checkStatus = (lastSeen) => {
        if (!lastSeen) return "offline";
        const diff = (new Date() - new Date(lastSeen)) / 1000 / 60;
        return diff < 3 ? "online" : "offline";
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/80 text-gray-500 text-[11px] uppercase tracking-wider font-bold border-b border-gray-100">
                        <th className="px-6 py-4">Thiết bị</th>
                        <th className="px-6 py-4 text-center">Trạng thái</th>
                        <th className="px-6 py-4">Khởi động</th>
                        <th className="px-6 py-4">Ping cuối</th>
                        <th className="px-6 py-4 text-right">Tác vụ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {devices.length > 0 ? (
                        devices.map((device) => {
                            const status = checkStatus(device.lastSeen);
                            const isOnline = status === "online";

                            return (
                                <tr key={device._id} className="hover:bg-blue-50/30 transition-colors group">
                                    {/* Cột 1: Info */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOnline ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                <FaWifi />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800 text-sm">{device.name}</div>
                                                <div className="text-[10px] font-mono text-gray-400">{device.deviceId}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Cột 2: Status Badge */}
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${isOnline
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-gray-50 text-gray-500 border-gray-200'
                                            }`}>
                                            <FaCircle className="text-[6px]" />
                                            {isOnline ? 'Online' : 'Offline'}
                                        </span>
                                    </td>

                                    {/* Cột 3: Config */}
                                    <td className="px-6 py-4">
                                        <span className="inline-block max-w-[150px] truncate text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                                            {device.config?.defaultCategoryId?.title || "Mặc định hệ thống"}
                                        </span>
                                    </td>

                                    {/* Cột 4: Time */}
                                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                        {device.lastSeen ? new Date(device.lastSeen).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "Chưa từng online"}
                                    </td>

                                    {/* Cột 5: Action */}
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => onEdit(device)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="Chỉnh sửa cấu hình"
                                        >
                                            <FaEdit />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                                Không tìm thấy thiết bị phù hợp.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}