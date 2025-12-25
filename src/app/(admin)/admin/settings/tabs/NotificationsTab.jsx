import Toggle from "@/components/admin/settings/Toggle";
export default function NotificationsTab() {
    const items = [
        { title: "Cập nhật nội dung", desc: "Thông báo khi có Card mới được phê duyệt hoặc thay đổi lịch chiếu." },
        { title: "Trạng thái thiết bị", desc: "Cảnh báo khi có máy Kiosk mất kết nối (Offline) quá 5 phút." },
        { title: "Bảo mật hệ thống", desc: "Thông báo khi có yêu cầu đặt lại mật khẩu hoặc đăng nhập lạ." },
    ];

    return (
        <div className="max-w-4xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 ml-1">
                <h3 className="text-xl font-bold text-gray-900">🔔 Trung tâm thông báo</h3>
                <p className="text-sm text-gray-500">Cấu hình cách bạn nhận các cập nhật quan trọng.</p>
            </div>
            {items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-gray-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                    <div className="flex-1 pr-6">
                        <strong className="text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</strong>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-6 bg-gray-50 p-2 rounded-2xl">
                        <Toggle label="Email" />
                        <div className="w-[1px] h-8 bg-gray-200"></div>
                        <Toggle label="App" defaultOn />
                    </div>
                </div>
            ))}
        </div>
    );
}