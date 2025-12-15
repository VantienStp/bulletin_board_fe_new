"use client";

import { useEffect, useState } from "react";

export default function AutoPlaceholderInput({
    texts = ["Enter your email…", "Johndoe@gmail.com", "example@domain.com"],
    typingSpeed = 100,
    pause = 500,
    className = "",
    ...props
}) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [forward, setForward] = useState(true);
    const [isFocus, setIsFocus] = useState(false);
    const [currentSpeed, setCurrentSpeed] = useState(typingSpeed);

    useEffect(() => {
        if (isFocus) {
            // setIndex(0);
            return; // dừng animation khi người dùng nhập
        }

        if (forward && subIndex === texts[index].length) {
            setTimeout(() => setForward(false), pause);
            return;
        }
        if (!forward && subIndex === 0) {
            setForward(true);
            setIndex((prev) => (prev + 1) % texts.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (forward ? 1 : -1));

            // random tốc độ giữa 100–400ms
            const min = 100;
            const max = 200;
            setCurrentSpeed(Math.floor(Math.random() * (max - min + 1)) + min);
        }, currentSpeed);

        return () => clearTimeout(timeout);
    }, [subIndex, forward, index, isFocus, texts, currentSpeed, pause]);

    return (
        <input
            {...props}
            placeholder={isFocus ? "" : texts[index].substring(0, subIndex)}

            onFocus={() => setIsFocus(true)}
            onBlur={() => {
                setIsFocus(false);
                setSubIndex(0);
                setForward(true);
            }}
            className={className}
        />
    );
}
