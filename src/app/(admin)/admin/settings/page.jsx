"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import useSWR from "swr";
import { FaDesktop } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/api";
import { authFetch } from "@/lib/auth";

// Hooks
import { useDeviceFilters } from "@/hooks/useDeviceFilters";
import usePagination from "@/hooks/usePagination";
import useArrowNavigation from "@/hooks/useArrowNavigation"; // ✅ Đừng quên import

// Components
import DeviceToolbar from "@/components/feature/settings/DeviceToolbar";
import DeviceTable from "@/components/feature/settings/DeviceTable";
import DeviceFormModal from "@/components/feature/settings/DeviceFormModal";
import Pagination from "@/components/common/Pagination";
import Toast from "@/components/ui/Toast";
import ToastContainer from "@/components/ui/ToastContainer";

const fetcher = (url) => authFetch(url).then((res) => res.json());

export default function DevicesTab() {
    // 1. Data Fetching
    const { data: devices = [], mutate, isLoading } = useSWR(
        `${API_BASE_URL}/devices`,
        fetcher,
        { refreshInterval: 30000 }
    );

    // 2. Filter Logic
    const {
        searchText, setSearchText,
        filters, setStatusFilter, clearFilters,
        filteredDevices
    } = useDeviceFilters(devices);

    // 3. Pagination Logic
    const ITEMS_PER_PAGE = 5;
    const {
        currentPage,
        paginatedData: paginatedDevices,
        goToPage
    } = usePagination(filteredDevices, ITEMS_PER_PAGE);

    // --- 🆕 LOGIC NAVIGATION ---
    const [searchFocused, setSearchFocused] = useState(false);
    const paginationRef = useRef(null);

    const totalPages = Math.ceil(filteredDevices.length / ITEMS_PER_PAGE);

    const pagesArray = useMemo(() =>
        Array.from({ length: totalPages }, (_, i) => ({ id: i + 1 })),
        [totalPages]
    );

    // Kích hoạt Hook
    useArrowNavigation({
        items: pagesArray,
        activeId: currentPage,
        setActiveId: goToPage,
        direction: "horizontal",
        enabled: !searchFocused && totalPages > 1,
    });

    // 4. Modal & Toast
    const [editingDevice, setEditingDevice] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [toasts, setToasts] = useState([]);

    const addToast = (type, message) => setToasts((prev) => [...prev, { id: Date.now(), type, message }]);
    const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

    useEffect(() => {
        goToPage(1);
    }, [searchText, filters]);

    const handleEdit = (device) => {
        setEditingDevice(device);
        setShowEditModal(true);
    };

    const handleUpdateDevice = async (id, formData) => {
        try {
            const res = await authFetch(`${API_BASE_URL}/devices/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    config: {
                        defaultCategoryId: formData.defaultCategoryId || null,
                        autoSwitch: formData.autoSwitch,
                        switchInterval: formData.switchInterval
                    }
                })
            });

            if (res.ok) {
                addToast("success", "Cập nhật thiết bị thành công!");
                mutate();
                setShowEditModal(false);
            } else {
                const err = await res.json();
                addToast("error", err.message || "Cập nhật thất bại.");
            }
        } catch (e) {
            addToast("error", "Lỗi kết nối server.");
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 px-6 pb-10">
            <ToastContainer>
                {toasts.map((t) => <Toast key={t.id} {...t} onClose={removeToast} />)}
            </ToastContainer>

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
                    toggleStatusFilter={setStatusFilter}
                    clearFilters={clearFilters}
                    onRefresh={() => mutate()}
                    loading={isLoading}
                    onSearchFocusChange={setSearchFocused}
                />
            </div>

            <div className="outline-none scroll-mt-4" ref={paginationRef}>
                <DeviceTable
                    devices={paginatedDevices}
                    onEdit={handleEdit}
                />

                <div className="flex justify-center">
                    <Pagination
                        totalItems={filteredDevices.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={(page) => {
                            goToPage(page);
                            paginationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                    />
                </div>
            </div>

            <DeviceFormModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                device={editingDevice}
                onUpdate={handleUpdateDevice}
            />
        </div>
    );
}