export default function BillingTab() {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl">
            <h2 className="text-lg font-semibold mb-4">Billing</h2>

            <p className="text-sm text-gray-600 mb-6">
                You're currently on the <strong>Free Plan</strong>.
            </p>

            <button className="px-4 py-2 bg-yellow-400 rounded-lg">
                Upgrade Plan
            </button>
        </div>
    );
}
