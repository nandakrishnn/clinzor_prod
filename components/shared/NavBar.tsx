"use client";
import React, { useState } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiPhone,
  FiHome,
  FiGrid,
  FiBook,
  FiInfo
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(true)
  const { data: session, status } = useSession();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              <Image
                src={"/assets/logo/logo.png"}
                alt="Clinzor"
                width={80}
                height={80}
                className="rounded-full z-50"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors ease-in-out duration-500"
            >
              Home
            </Link>
            <Link
              href="/service"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors ease-in-out duration-500"
            >
              Services
            </Link>
            <Link
              href="/blog"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors ease-in-out duration-500"
            >
              Blog
            </Link>
            <Link
              href="/aboutus"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors ease-in-out duration-500"
            >
              About Us
            </Link>
            <Link
              href="/contact-us"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors ease-in-out duration-500"
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {
              session?.user ?
                <Link
                  href="/user#bookings"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="mr-2" /> My Bookings
                </Link> :
                <Link
                  href="/auth"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="mr-2" /> Login
                </Link>
            }
            <Link
              href="/expert-call"
              className="px-4 py-2 bg-primaryColor text-white rounded-full text-sm hover:primaryColor transition-colors flex items-center justify-center"
            >
              <FiPhone className="inline mr-1" /> Book a Call
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:primaryColor focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            href="/"
            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <FiHome className="mr-2" /> Home
          </Link>
          <Link
            href="/service"
            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <FiGrid className="mr-2" /> Services
          </Link>
          <Link
            href="/blog"
            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <FiBook className="mr-2" /> Blog
          </Link>
          <Link
            href="/aboutus"
            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <FiInfo className="mr-2" /> About Us
          </Link>
          <Link
            href="/contact-us"
            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <FiPhone className="mr-2" /> Contact
          </Link>

          <div className="border-t border-gray-200 pt-2 mt-2">
            {
              session?.user ?
                <Link
                  href="/user"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="mr-2" /> My Bookings
                </Link> :
                <Link
                  href="/auth"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="mr-2" /> Login
                </Link>
            }

            <Link
              href="/expert-call"
              className="flex items-center px-3 py-2 mt-2 bg-primaryColor text-white rounded-md hover:bg-blue-900"
              onClick={() => setIsOpen(false)}
            >
              <FiPhone className="mr-2" /> Book a Call
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
