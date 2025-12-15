"use client";

import { useRef, useState } from "react";

export default function ProfileTab() {
    const fileInputRef = useRef(null);
    const [avatar, setAvatar] = useState("/avatar1.png");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setAvatar(preview);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl">
            {/* Avatar section */}
            <div className="flex items-center gap-6 mb-6 justify-center">
                <img
                    src={avatar}
                    className="w-20 h-20 rounded-full object-cover"
                />

                <button
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    onClick={() => fileInputRef.current.click()}
                >
                    Change Avatar
                </button>

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>

            {/* Form fields */}
            <div className="space-y-4">
                <Input label="Full Name" defaultValue="Nguyễn Văn Tiến" />
                <Input label="Email" defaultValue="vantien@gmail.com" />
                <Input label="Role" defaultValue="Administrator" disabled />
                <Input label="Phone Number" placeholder="Enter phone..." />
                <Textarea label="Bio" placeholder="Short description..." />
            </div>

            <button className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800">
                Save Changes
            </button>
        </div>
    );
}

function Input({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                {...props}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
            />
        </div>
    );
}

function Textarea({ label, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <textarea
                {...props}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50 h-28"
            />
        </div>
    );
}
