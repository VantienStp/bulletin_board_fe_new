"use client";

import { useState, useEffect } from "react";
import { FaDesktop } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";

// Hook & Components
import { useDeviceFilters } from "@/hooks/useDeviceFilters";
import DeviceToolbar from "@/components/feature/settings/DeviceToolbar";
import DeviceTable from "@/components/feature/settings/DeviceTable";
import Pagination from "@/components/common/Pagination";
import DeviceFormModal from "@/components/feature/settings/DeviceFormModal";

export default function DevicesTab() {
    // 1. Data State
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Editing State
    const [editingDevice, setEditingDevice] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // 3. Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // 4. Fetch Data
    const fetchDevices = async () => {
        try {
            const res = await authFetch(`${API_BASE_URL}/devices`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) setDevices(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchDevices();
        const interval = setInterval(fetchDevices, 30000);
        return () => clearInterval(interval);
    }, []);

    // 5. Use Hook for Filtering (Logic tách biệt)
    const { 
        searchText, setSearchText, 
        filters, 
        setStatusFilter, // Lấy hàm mới tên setStatusFilter
        clearFilters,    // Lấy hàm clearFilters
        filteredDevices 
    } = useDeviceFilters(devices);

    // 6. Pagination Logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDevices = filteredDevices.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1); // Reset về trang 1 khi search/filter thay đổi
    }, [searchText, filters]);

    // 7. Handlers
    const handleEdit = (device) => {
        setEditingDevice(device);
        setShowEditModal(true);
    };

    const handleUpdateDevice = async (id, data) => {
        try {
            const res = await authFetch(`${API_BASE_URL}/devices/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    config: { defaultCategoryId: data.defaultCategoryId || null }
                })
            });

            if (res.ok) {
                alert("✅ Cập nhật thành công!");
                fetchDevices();
                setShowEditModal(false);
            } else {
                alert("❌ Cập nhật thất bại.");
            }
        } catch (e) {
            alert("❌ Lỗi kết nối.");
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 px-6">
            
            {/* HEADER + TOOLBAR */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 ml-1">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaDesktop className="text-gray-400" /> Quản lý Kiosk
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Giám sát trạng thái và cấu hình hiển thị cho {filteredDevices.length} thiết bị.
                    </p>
                </div>

                <DeviceToolbar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    filters={filters}
                    toggleStatusFilter={setStatusFilter} // Truyền vào đây
                    clearFilters={clearFilters}          // ✅ Truyền prop này xuống
                    onRefresh={() => { setLoading(true); fetchDevices(); }}
                    loading={loading}
                />
            </div>

            {/* TABLE */}
            <DeviceTable 
                devices={paginatedDevices} 
                onEdit={handleEdit} 
            />

            {/* PAGINATION */}
            {filteredDevices.length > itemsPerPage && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        totalItems={filteredDevices.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* EDIT MODAL */}
            <DeviceFormModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                device={editingDevice}
                onUpdate={handleUpdateDevice}
            />
        </div>
    );
}