// src/components/ui/NumberInput.jsx
"use client";

export default function NumberInput({
    label,
    value,
    onChange,
    min = 1,
    max = 100,
    step = 1,
    className = ""
}) {
    const handleChange = (e) => {
        let val = Number(e.target.value);
        // Logic bảo vệ: Đảm bảo giá trị luôn nằm trong khoảng cho phép
        if (val < min) val = min;
        if (val > max) val = max;
        onChange(val);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {label && (
                <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">
                    {label}
                </label>
            )}
            <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                className="w-16 p-1.5 border border-gray-200 rounded text-center font-medium 
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           outline-none transition-all hover:border-gray-300"
            />
        </div>
    );
}