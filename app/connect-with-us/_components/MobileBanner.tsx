"use client";

import { ChevronRight, Gift } from "lucide-react";
import Link from "next/link";

export default function MobileBanner() {
    return (
        <Link
            href="https://clinzor.com/expert-call"
            className="md:hidden sticky top-20 z-40 mx-4 mt-6 mb-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg rounded-full overflow-hidden block cursor-pointer"
        >
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-yellow-300" />
                    <span className="font-bold text-sm tracking-wide">
                        FREE Physio Online Consultation
                    </span>
                </div>
                <ChevronRight className="w-5 h-5 text-white" />
            </div>
        </Link>
    );
}
