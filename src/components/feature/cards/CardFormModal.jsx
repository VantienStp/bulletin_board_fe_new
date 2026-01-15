"use client";

import { useState, useEffect, forwardRef } from "react";
import Modal from "@/components/common/Modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

export default function CardFormModal({ isOpen, onClose, initialData, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        startDate: new Date(),
        endDate: null,
        isWorkDaysOnly: false
    });

    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
                    endDate: initialData.endDate ? new Date(initialData.endDate) : null,
                    isWorkDaysOnly: initialData.isWorkDaysOnly || false
                });
            } else {
                // 🔥 Mặc định mới vào: Ngày bắt đầu là hôm nay, kết thúc là sau 1 tuần
                const today = new Date();
                const nextWeek = new Date();
                nextWeek.setDate(today.getDate() + 7);

                setFormData({
                    title: "",
                    startDate: today,
                    endDate: nextWeek,
                    isWorkDaysOnly: false
                });
            }
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const CustomDateInput = forwardRef(({ value, onClick, placeholder, isOpenState, setIsOpenState, canClear, onClear }, ref) => (
        <div
            className="w-full border border-gray-300 rounded-lg px-4 h-11 flex justify-between items-center cursor-pointer hover:border-black transition-all bg-white overflow-hidden"
            ref={ref}
            onClick={() => setIsOpenState(!isOpenState)}
        >
            <span className={`text-sm truncate ${value ? "text-gray-900" : "text-gray-400"}`}>
                {value || placeholder}
            </span>
            <div className="flex items-center gap-2 shrink-0">
                {canClear && value && (
                    <div
                        className="w-6 h-6 flex items-center justify-center hover:bg-red-50 rounded-full transition-colors group/clear"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClear();
                        }}
                    >
                        <span className="text-gray-400 group-hover/clear:text-red-500 text-[10px] font-bold">✕</span>
                    </div>
                )}
                <FaCalendarAlt className={`text-sm transition-colors ${isOpenState ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
        </div>
    ));
    CustomDateInput.displayName = "CustomDateInput";

    if (!isOpen) return null;

    return (
        <Modal title={initialData ? "Sửa thẻ nội dung" : "Thêm thẻ mới"} onClose={onClose}>
            <style jsx global>{`
                .react-datepicker-wrapper { display: block; width: 100%; }
                .react-datepicker__day--disabled { color: #ccc !important; cursor: not-allowed; }
            `}</style>

            <form onSubmit={handleSubmit} className="space-y-6 py-2">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                        className="w-full border border-gray-300 rounded-lg px-4 h-11 text-sm outline-none focus:border-black transition-all"
                        placeholder="Nhập tiêu đề thông báo..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        autoFocus
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            selected={formData.startDate}
                            onChange={(date) => {
                                setFormData({ ...formData, startDate: date });
                                setOpenStart(false);
                                // Nếu ngày bắt đầu mới lớn hơn ngày kết thúc hiện tại -> đẩy ngày kết thúc đi cùng
                                if (formData.endDate && date > formData.endDate) {
                                    setFormData(prev => ({ ...prev, endDate: date }));
                                }
                            }}
                            minDate={new Date()}
                            open={openStart}
                            onClickOutside={() => setOpenStart(false)}
                            customInput={
                                <CustomDateInput
                                    placeholder="Chọn ngày bắt đầu"
                                    isOpenState={openStart}
                                    setIsOpenState={setOpenStart}
                                />
                            }
                            dateFormat="dd/MM/yyyy"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Ngày kết thúc
                        </label>
                        <DatePicker
                            selected={formData.endDate}
                            onChange={(date) => {
                                setFormData({ ...formData, endDate: date });
                                setOpenEnd(false);
                            }}
                            minDate={formData.startDate}
                            open={openEnd}
                            onClickOutside={() => setOpenEnd(false)}
                            customInput={
                                <CustomDateInput
                                    placeholder="Vĩnh viễn"
                                    isOpenState={openEnd}
                                    setIsOpenState={setOpenEnd}
                                    canClear={true}
                                    onClear={() => {
                                        setFormData(prev => ({ ...prev, endDate: null }));
                                        setOpenEnd(false);
                                    }}
                                />
                            }
                            dateFormat="dd/MM/yyyy"
                        />
                        <p className="text-[11px] text-gray-400 mt-2 pl-1 italic">
                            Xóa ngày nếu muốn hiển thị vĩnh viễn.
                        </p>
                    </div>
                </div>

                <div
                    className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group select-none"
                    onClick={() => setFormData(prev => ({ ...prev, isWorkDaysOnly: !prev.isWorkDaysOnly }))}
                >
                    <div className="flex-1 pr-4">
                        <label className="font-bold text-gray-900 text-sm cursor-pointer block">Chế độ ngày làm việc</label>
                        <p className="text-gray-500 text-[11px] mt-1">Chỉ hiển thị vào Thứ 2 - Thứ 6.</p>
                    </div>
                    <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.isWorkDaysOnly ? 'bg-black' : 'bg-gray-300'}`}>
                        <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.isWorkDaysOnly ? 'translate-x-6' : ''}`} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Hủy bỏ</button>
                    <button type="submit" className="px-8 py-2 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 shadow-lg active:scale-95 transition-all">
                        {initialData ? "Cập nhật" : "Tạo thẻ"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}