"use client";
import { FaDesktop } from "react-icons/fa6";

export default function DeviceActivityTable({ devices = [] }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaDesktop className="text-gray-400" /> Thiết bị hoạt động gần đây
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Tên thiết bị</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3">Đang chiếu</th>
                            <th className="px-4 py-3 rounded-r-lg text-right">Lần cuối online</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device, idx) => (
                            <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                <td className="px-4 py-3 font-medium text-gray-900">{device.name}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${device.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {device.status === 'online' ? 'Online' : 'Offline'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 truncate max-w-[150px]" title={device.currentContent}>
                                    {device.currentContent}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-400 whitespace-nowrap">
                                    {device.lastSeen}
                                </td>
                            </tr>
                        ))}

                        {devices.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-4 py-8 text-center text-gray-400">
                                    Chưa có dữ liệu thiết bị
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}