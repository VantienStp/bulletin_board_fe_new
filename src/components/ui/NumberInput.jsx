"use client";

import { useState, useEffect } from "react";

export default function NumberInput({
    label,
    value,
    onChange,
    min = 1,
    max = 100,
    step = 1,
    className = ""
}) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (e) => {
        const val = e.target.value;

        if (val === "") {
            setLocalValue("");
            return;
        }

        const num = parseInt(val);
        if (!isNaN(num)) {
            setLocalValue(num);
            onChange(num);
        }
    };

    const handleCommit = () => {
        let finalVal = Number(localValue);

        if (localValue === "" || isNaN(finalVal)) {
            finalVal = min;
        }
        else if (finalVal < min) {
            finalVal = min;
        }
        else if (finalVal > max) {
            finalVal = max;
        }

        setLocalValue(finalVal);
        onChange(finalVal);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.target.blur();
        }
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
                value={localValue}
                onChange={handleChange}
                onBlur={handleCommit}
                onKeyDown={handleKeyDown}
                className="w-16 p-1.5 border border-gray-200 rounded text-center font-medium 
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           outline-none transition-all hover:border-gray-300 placeholder-gray-300"
                placeholder={min.toString()}
            />
        </div>
    );
}