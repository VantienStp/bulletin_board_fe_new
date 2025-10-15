'use client';
import { FaCogs, FaSave } from 'react-icons/fa';
import { API_BASE_URL } from '@/lib/api';
export default function SettingsPage() {
  return (
    <div className="admin-page">
      <div className="page-header">
        <h2><FaCogs /> Cài đặt hệ thống</h2>
      </div>

      <div className="settings-panel">
        <h3>⚙️ Thông tin cấu hình</h3>
        <form>
          <label>Tên hệ thống</label>
          <input type="text" defaultValue="Bảng tin Tòa Án" />

          <label>API Base URL</label>
          <input type="text" defaultValue={`${API_BASE_URL}`} />

          <button className="btn-primary"><FaSave /> Lưu thay đổi</button>
        </form>
      </div>
    </div>
  );
}
