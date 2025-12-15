"use client";

import { useEffect, useState } from "react";

export default function TypingLooper({
    texts = [],
    typingSpeed = 80,
    deletingSpeed = 50,
    delay = 3000,
    color = "text-yellowPrimary"   // ← mặc định
}) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [forward, setForward] = useState(true);

    useEffect(() => {
        if (!texts.length) return;

        if (forward && subIndex === texts[index].length) {
            setTimeout(() => setForward(false), delay);
            return;
        }

        if (!forward && subIndex === 0) {
            setForward(true);
            setIndex((prev) => (prev + 1) % texts.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (forward ? 1 : -1));
        }, forward ? typingSpeed : deletingSpeed);

        return () => clearTimeout(timeout);
    }, [subIndex, forward, texts, index, typingSpeed, deletingSpeed, delay]);

    return (
        <span className={`inline-flex ${color}`}>
            {texts[index].substring(0, subIndex)}
            <span className="typing-bar ml-1">|</span>
        </span>
    );
}
