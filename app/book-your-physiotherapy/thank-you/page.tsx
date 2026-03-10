"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Linkedin, Facebook, Instagram } from "lucide-react";

export default function ThankYouPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/book-your-physiotherapy');
        }, 10000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Thank You!
                </h1>
                <p className="text-gray-600 mb-2">
                    Your booking request has been received successfully.
                </p>
                <p className="text-gray-600 mb-8">
                    We&apos;ll contact you as soon as possible to confirm your appointment.
                </p>

                {/* Divider */}
                <div className="border-t border-gray-200 my-8"></div>

                {/* Social Media Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        Explore More About Us
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Follow us on social media for health tips, updates, and more!
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        <a
                            href="https://www.linkedin.com/company/clinzor/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                        </a>

                        <a
                            href="https://www.facebook.com/profile.php?id=61571894753942"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
                        </a>

                        <a
                            href="https://www.instagram.com/clinzorofficial/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                        </a>

                        <a
                            href="https://www.x.com/clinzorofficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 sm:w-14 sm:h-14 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg"
                            aria-label="X (Twitter)"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Return Home Button */}
                <button
                    onClick={() => router.push('/book-your-physiotherapy')}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Return to Home
                </button>

                {/* Clinzor Main Website CTA */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-600 mb-3">
                        Looking to schedule more sessions or explore the best physiotherapy clinics near you?
                    </p>
                    <a
                        href="https://clinzor.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full bg-white text-blue-600 font-bold py-2.5 px-6 rounded-lg border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors text-sm"
                    >
                        Visit Clinzor.com →
                    </a>
                </div>

                <p className="text-xs text-gray-400 mt-4">
                    Redirecting to home in 10 seconds...
                </p>
            </div>
        </div>
    );
}
