"use client";
import { useState } from "react";
import { FaCogs, FaSave } from "react-icons/fa";
import "./settings.css";
import { API_BASE_URL, BASE_URL } from "@/lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="show-header">
          <span className="icon"><FaCogs /></span>
          <span>Danh mục</span>
        </div>
      </div>

      {/* ==== Tabs ==== */}
      <div className="settings-tabs">
        {["system", "appearance", "notifications", "account"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "system" && "Thông tin hệ thống"}
            {tab === "appearance" && "Giao diện"}
            {tab === "notifications" && "Thông báo"}
            {tab === "account" && "Tài khoản"}
          </button>
        ))}
      </div>

      {/* ==== Tab content ==== */}
      <div className="settings-content">
        {activeTab === "system" && (
          <section>
            <h3>⚙️ Thông tin cấu hình</h3>
            <form className="settings-form">
              <label>Tên hệ thống</label>
              <input type="text" defaultValue="Bảng tin Tòa Án" />

              <label>API Base URL</label>
              <input type="text" defaultValue={API_BASE_URL} />

              <button className="btn-primary">
                <FaSave /> Lưu thay đổi
              </button>
            </form>
          </section>
        )}

        {activeTab === "notifications" && (
          <section >
            <h3>🔔 Cài đặt thông báo</h3>
            <p className="note">
              Bạn có thể bật / tắt các hình thức nhận thông báo hệ thống.
            </p>

            {[
              {
                title: "Cập nhật dữ liệu",
                desc: "Khi có dữ liệu mới được cập nhật hoặc đăng tải.",
              },
              {
                title: "Phân quyền người dùng",
                desc: "Khi có thay đổi về quyền hoặc thêm người quản trị.",
              },
              {
                title: "Hệ thống & bảo mật",
                desc: "Thông báo khi có thay đổi liên quan đến bảo mật hệ thống.",
              },
            ].map((item, i) => (
              <div key={i} className="notify-row">
                <div className="notify-info">
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
                <div className="notify-switches">
                  <Toggle label="Email" />
                  <Toggle label="Push" defaultOn />
                  <Toggle label="SMS" />
                </div>
              </div>
            ))}
          </section>
        )}

        {activeTab === "appearance" && (
          <section>
            <h3>🎨 Tùy chỉnh giao diện</h3>
            <p className="note">Chọn màu nền, font chữ và bố cục hiển thị cho trang công khai.</p>
          </section>
        )}

        {activeTab === "account" && (
          <section>
            <h3>👤 Tài khoản quản trị</h3>
            <p className="note">Xem hoặc thay đổi thông tin đăng nhập của bạn.</p>
          </section>
        )}
      </div>
    </div>
  );
}

/* === Component toggle nhỏ gọn === */
function Toggle({ label, defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={on}
        onChange={() => setOn(!on)}
      />
      <span className="slider" />
      <span className="toggle-label">{label}</span>
    </label>
  );
}
