"use client";
import { useEffect, useState } from "react";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-20 right-6 p-3.5 rounded-full bg-yellowPrimary 
        text-blackPrimary shadow-lg transition-all duration-300 
        flex items-center justify-center text-lg
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
        >
            <i className="fa-solid fa-arrow-up"></i>
        </button>

    );
}
