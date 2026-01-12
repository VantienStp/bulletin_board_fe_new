// components/ui/ToastContainer.jsx
export default function ToastContainer({ children }) {
    return (
        <div className="fixed top-5 right-5 z-[99999] flex flex-col items-end pointer-events-none">
            {/* pointer-events-none để click xuyên qua vùng trống */}
            <div className="pointer-events-auto">
                {children}
            </div>
        </div>
    );
}