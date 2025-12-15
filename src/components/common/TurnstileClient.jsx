"use client";

import { useEffect, useState } from "react";
import Turnstile from "react-turnstile";

export default function TurnstileClient({ onVerify }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Inject Cloudflare API script
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!isLoaded) {
        return <div className="text-sm text-gray-400">Loading verification...</div>;
    }

    return (
        <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onVerify={onVerify}
            theme="light"
        />
    );
}
