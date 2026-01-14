"use client";
import { useEffect, memo } from "react";

function Sidebar({ categories, selectedCategory, onSelect }) {
    useEffect(() => {
        if (!categories.length || !selectedCategory) return;

        // Sửa _id thành id
        const index = categories.findIndex((cat) => cat.id === selectedCategory);
        if (index < 0) return;

        const highlight = document.getElementById("sidebar-highlight");
        const items = document.querySelectorAll(".sidebar ul li a");

        if (highlight && items[index]) {
            const item = items[index];
            const vhTop = (item.offsetTop / window.innerHeight) * 100;
            const vhHeight = (item.offsetHeight / window.innerHeight) * 100;
            highlight.style.transform = `translateY(${vhTop}vh)`;
            highlight.style.height = `${vhHeight}vh`;
        }
    }, [selectedCategory, categories]);

    return (
        <nav className="sidebar">
            <a href="#" className="flex max-w-[7vw] max-h-[7vw] mb-[3vh] box-border z">
                <img src={`/logo.png`} alt="Logo" className="w-[5vw] mt-[var(--margin-medium)]" />
            </a>
            <div id="sidebar-highlight">
                <div className="corner-bottom"></div>
            </div>
            <ul>
                {categories.map((cat) => (
                    // Sửa _id thành id ở key
                    <li key={cat.id}>
                        <a
                            onClick={() => onSelect(cat)}
                            // Sửa _id thành id ở điều kiện so sánh
                            className={selectedCategory === cat.id ? "active" : ""}
                        >
                            <i className={cat.icon || "fas fa-folder"}></i>
                            <span className="nav-text">{cat.title}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default memo(Sidebar);