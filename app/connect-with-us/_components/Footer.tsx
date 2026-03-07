import Image from "next/image";

export default function Footer() {
    return (
        <footer id="contact" className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
                    {/* Logo and Description */}
                    <div className="text-center md:text-left">
                        <div className="mb-4 flex justify-center md:justify-start">
                            <Image
                                src="/logo.png"
                                alt="Clinzor Logo"
                                width={120}
                                height={40}
                                className="brightness-0 invert"
                            />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Providing expert physiotherapy care at your doorstep. Professional, personalized, and effective.
                        </p>
                    </div>
                    {/* Quick Links */}
                    <div className="text-center md:text-left">
                        <h4 className="font-semibold mb-4 text-base">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/connect-with-us#services" className="hover:text-white transition-colors">Services</a></li>
                            <li><a href="/aboutus" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="/contact-us" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="/connect-with-us#book" className="hover:text-white transition-colors">Book Appointment</a></li>
                        </ul>
                    </div>
                    {/* Contact */}
                    <div className="text-center md:text-left">
                        <h4 className="font-semibold mb-4 text-base">Contact</h4>
                        <p className="text-gray-400 text-sm mb-2">Bangalore, Karnataka, India</p>
                        <a href="mailto:contact@clinzor.com" className="text-gray-400 text-sm hover:text-white transition-colors">
                            contact@clinzor.com
                        </a>
                    </div>
                </div>
                {/* Copyright */}
                <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Clinzor. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
