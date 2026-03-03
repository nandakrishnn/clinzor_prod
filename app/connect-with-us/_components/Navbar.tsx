"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        const handleHashChange = () => {
            setActiveSection(window.location.hash);
        };
        window.addEventListener("hashchange", handleHashChange);
        setActiveSection(window.location.hash);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const isActive = (path: string, hash?: string) => {
        if (hash) {
            return pathname === "/connect-with-us" && activeSection === hash;
        }
        return pathname === path;
    };

    const navLinks = [
        { name: "Services", href: "/connect-with-us#services", hash: "#services" },
        { name: "About", href: "/connect-with-us#about", hash: "#about" },
        { name: "Corporate", href: "/connect-with-us/corporate", hash: "" },
        { name: "Contact", href: "/connect-with-us#contact", hash: "#contact" },
    ];

    return (
        <nav className="bg-white shadow-md md:shadow-none sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/connect-with-us" className="flex items-center" onClick={() => setActiveSection("")}>
                            <div className="relative h-10 w-32 md:h-12 md:w-40">
                                <Image
                                    src="/logo.png"
                                    alt="Clinzor Logo"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                    sizes="(max-width: 768px) 128px, 160px"
                                />
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => link.hash && setActiveSection(link.hash)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive(link.href, link.hash) ||
                                    (link.href === "/connect-with-us/corporate" && pathname === "/connect-with-us/corporate")
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link href="/connect-with-us#book" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium ml-4">
                            Book Now
                        </Link>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => {
                                    if (link.hash) setActiveSection(link.hash);
                                    setIsOpen(false);
                                }}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${
                                    isActive(link.href, link.hash) ||
                                    (link.href === "/connect-with-us/corporate" && pathname === "/connect-with-us/corporate")
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/connect-with-us#book"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium mt-4"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
