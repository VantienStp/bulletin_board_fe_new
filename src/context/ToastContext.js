"use client";
import { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "@/components/ui/ToastContainer"; // 
import Toast from "@/components/ui/Toast"; // 

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={removeToast}
                    />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};