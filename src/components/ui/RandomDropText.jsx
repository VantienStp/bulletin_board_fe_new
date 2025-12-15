"use client";

import { useMemo } from "react";

export default function RandomPopText({
    text = "",
    className = "",
}) {
    const words = useMemo(() => text.split(" "), [text]);

    return (
        <span className={`inline-flex flex-wrap gap-[0.35em] ${className}`}>
            {words.map((word, wIndex) => (
                <span key={wIndex} className="inline-flex">
                    {word.split("").map((ch, cIndex) => {
                        const delay = Math.random() * 0.8 + 0.4;

                        return (
                            <span
                                key={cIndex}
                                className="pop-char"
                                style={{ animationDelay: `${delay}s` }}
                            >
                                {ch}
                            </span>
                        );
                    })}
                </span>
            ))}
        </span>
    );
}
