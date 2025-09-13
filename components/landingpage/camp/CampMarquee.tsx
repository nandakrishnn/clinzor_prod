"use client";

import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { X } from "lucide-react";

interface MarqueeProps {
    text?: string;
    speed?: number; // Pixels per second
    className?: string;
    showDismiss?: boolean;
    showButton?: boolean;
    buttonLabel?: string;
    buttonHref?: string;
}

const CampMarquee: React.FC<MarqueeProps> = ({
    text = "Register now for our exclusive camping experience! Limited spots available. Don't miss out!",
    speed = 50, // pixels per second
    className = "",
    showDismiss = true,
    showButton = true,
    buttonLabel = "Register Now",
    buttonHref = "#camp-registration",
}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("marqueeDismissed", "true");
    };

    useEffect(() => {
        const dismissed = localStorage.getItem("marqueeDismissed");
        if (dismissed === "true") setIsVisible(false);
    }, []);

    //   if (!isVisible) return null;

    return (
        <section
            className={`bg-[#031124] text-[#e7e5e5] py-3 relative overflow-hidden ${className}`}
        >
            {/* Dismiss button */}
            {/* {showDismiss && (
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
        >
          <X size={16} />
        </button>
      )} */}

            <Marquee
                gradient={false}
                speed={speed}
                pauseOnHover
                className="text-xs sm:text-sm"
            >
                <span className="mx-5 flex items-center">
                    <h3 className="text-[12px] font-semibold">{text}</h3>
                    {showButton && (
                        <a
                            href={buttonHref}
                            className="ml-4 bg-white text-[10px] sm:text-xs text-[#1C3455] px-3 py-1 rounded-full font-semibold hover:bg-gray-100 transition-colors shrink-0"
                        >
                            {buttonLabel}
                        </a>
                    )}
                </span>
            </Marquee>
        </section>
    );
};

export default CampMarquee;
