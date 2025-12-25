"use client";
import { useState, useEffect } from "react";
import { FaDesktop, FaCircle, FaEdit, FaSyncAlt } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth"; // ✅ Import authFetch bạn đã có

export default function DevicesTab() {
    const [devices, setDevices] = useState([]); // Khởi tạo mảng rỗng
    const [loading, setLoading] = useState(true);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            // ✅ Phải dùng authFetch vì Route này yêu cầu đăng nhập Admin
            const res = await authFetch(`${API_BASE_URL}/devices`);

            if (!res.ok) {
                setDevices([]);
                return;
            }

            const data = await res.json();

            // ✅ Kiểm tra "phòng thủ": Chỉ set nếu là mảng
            if (data && Array.isArray(data)) {
                setDevices(data);
            } else {
                setDevices([]);
            }
        } catch (err) {
            console.error("Lỗi fetch devices:", err);
            setDevices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
        const interval = setInterval(fetchDevices, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatus = (lastSeen) => {
        const diff = (new Date() - new Date(lastSeen)) / 1000 / 60;
        return diff < 3;
    };

    return (
        <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6 ml-1">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaDesktop className="text-gray-400" /> Quản lý thiết bị Kiosk
                    </h3>
                    <p className="text-sm text-gray-500">Theo dõi trạng thái các máy đang kết nối.</p>
                </div>
                <button
                    onClick={fetchDevices}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all active:rotate-180 duration-500"
                >
                    <FaSyncAlt className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.15em] font-black border-b">
                            <th className="px-8 py-5">Tên & ID Thiết bị</th>
                            <th className="px-6 py-5 text-center">Trạng thái</th>
                            <th className="px-6 py-5">Cấu hình hiển thị</th>
                            <th className="px-6 py-5">Lần cuối thấy</th>
                            <th className="px-8 py-5 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {/* ✅ Dùng Guard Clause để an toàn tuyệt đối */}
                        {Array.isArray(devices) && devices.length > 0 ? (
                            devices.map((device) => {
                                const online = getStatus(device.lastSeen);
                                return (
                                    <tr key={device._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-gray-800">{device.name}</div>
                                            <div className="text-[10px] font-mono text-gray-400 mt-0.5">{device.deviceId}</div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${online ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                <FaCircle className="text-[6px]" />
                                                {online ? 'Live' : 'Offline'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 font-medium">
                                                {device.config?.defaultCategoryId?.title || "Mặc định"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-xs text-gray-400 font-medium italic">
                                            {device.lastSeen ? new Date(device.lastSeen).toLocaleTimeString('vi-VN') : "---"}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 text-gray-400 hover:text-black hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-gray-100 active:scale-90">
                                                <FaEdit />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : null}
                    </tbody>
                </table>

                {!loading && (!devices || devices.length === 0) && (
                    <div className="p-20 text-center text-gray-400 text-sm italic font-medium">
                        Hiện tại chưa có thiết bị nào được ghi nhận.
                    </div>
                )}
            </div>
        </div>
    );
}