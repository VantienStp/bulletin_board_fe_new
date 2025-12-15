export default function SecurityTab() {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl space-y-6">
            <h2 className="text-lg font-semibold">Password Security</h2>

            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />

            <button className="mt-4 w-full bg-black text-white py-3 rounded-xl">
                Update Password
            </button>

            <hr className="my-6" />

            <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
            <p className="text-gray-600 text-sm">Add extra security to your account.</p>

            <button className="px-4 py-2 bg-yellow-400 rounded-lg hover:bg-yellow-500">
                Enable 2FA
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
