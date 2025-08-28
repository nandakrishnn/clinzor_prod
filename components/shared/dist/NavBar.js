"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var fi_1 = require("react-icons/fi");
var link_1 = require("next/link");
var image_1 = require("next/image");
var Navbar = function () {
    var _a = react_1.useState(false), isOpen = _a[0], setIsOpen = _a[1];
    var toggleMenu = function () {
        setIsOpen(!isOpen);
    };
    return (react_1["default"].createElement("nav", { className: "bg-white shadow-md w-full fixed top-0 z-50" },
        react_1["default"].createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
            react_1["default"].createElement("div", { className: "flex justify-between h-20" },
                react_1["default"].createElement("div", { className: "flex items-center" },
                    react_1["default"].createElement(link_1["default"], { href: "/", className: "text-xl font-bold text-blue-600" },
                        react_1["default"].createElement(image_1["default"], { src: "/assets/logo/logo.png", alt: "Logo", width: 80, height: 80, className: "rounded-full z-50" }))),
                react_1["default"].createElement("div", { className: "hidden md:flex items-center space-x-8" },
                    react_1["default"].createElement(link_1["default"], { href: "/", className: "flex items-center text-gray-700 hover:text-gray-900 transition-colors ease-in-out duration-500" }, "Home"),
                    react_1["default"].createElement(link_1["default"], { href: "/service", className: "flex items-center text-gray-700 hover:text-gray-900 transition-colors ease-in-out duration-500" }, "Services"),
                    react_1["default"].createElement(link_1["default"], { href: "/blog", className: "flex items-center text-gray-700 hover:text-gray-900 transition-colors ease-in-out duration-500" }, "Blog"),
                    react_1["default"].createElement(link_1["default"], { href: "/aboutus", className: "flex items-center text-gray-700 hover:text-gray-900 transition-colors ease-in-out duration-500" }, "About Us"),
                    react_1["default"].createElement(link_1["default"], { href: "/contact-us", className: "flex items-center text-gray-700 hover:text-gray-900 transition-colors ease-in-out duration-500" }, "Contact")),
                react_1["default"].createElement("div", { className: "hidden md:flex items-center space-x-4" },
                    react_1["default"].createElement(link_1["default"], { href: "/auth", className: "px-3 py-2 text-gray-700 rounded-full text-sm  hover:text-white hover:bg-primaryColor ease-in-out duration-500 transition-colors flex items-center justify-center" },
                        react_1["default"].createElement(fi_1.FiUser, { className: "inline mr-1" }),
                        " Login"),
                    react_1["default"].createElement(link_1["default"], { href: "/expert-call", className: "px-4 py-2 bg-primaryColor text-white rounded-full text-sm hover:primaryColor transition-colors flex items-center justify-center" },
                        react_1["default"].createElement(fi_1.FiPhone, { className: "inline mr-1" }),
                        " Book a Call")),
                react_1["default"].createElement("div", { className: "md:hidden flex items-center" },
                    react_1["default"].createElement("button", { onClick: toggleMenu, className: "text-gray-700 hover:primaryColor focus:outline-none" }, isOpen ? react_1["default"].createElement(fi_1.FiX, { size: 24 }) : react_1["default"].createElement(fi_1.FiMenu, { size: 24 }))))),
        react_1["default"].createElement("div", { className: "md:hidden " + (isOpen ? "block" : "hidden") },
            react_1["default"].createElement("div", { className: "px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg" },
                react_1["default"].createElement(link_1["default"], { href: "/", className: "flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md", onClick: function () { return setIsOpen(false); } },
                    react_1["default"].createElement(fi_1.FiHome, { className: "mr-2" }),
                    " Home"),
                react_1["default"].createElement(link_1["default"], { href: "/service", className: "flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md", onClick: function () { return setIsOpen(false); } },
                    react_1["default"].createElement(fi_1.FiGrid, { className: "mr-2" }),
                    " Services"),
                react_1["default"].createElement(link_1["default"], { href: "/blog", className: "flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md", onClick: function () { return setIsOpen(false); } },
                    react_1["default"].createElement(fi_1.FiBook, { className: "mr-2" }),
                    " Blog"),
                react_1["default"].createElement(link_1["default"], { href: "/aboutus", className: "flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md", onClick: function () { return setIsOpen(false); } },
                    react_1["default"].createElement(fi_1.FiInfo, { className: "mr-2" }),
                    " About Us"),
                react_1["default"].createElement(link_1["default"], { href: "/contact-us", className: "flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md", onClick: function () { return setIsOpen(false); } },
                    react_1["default"].createElement(fi_1.FiPhone, { className: "mr-2" }),
                    " Contact"),
                react_1["default"].createElement("div", { className: "border-t border-gray-200 pt-2 mt-2" },
                    react_1["default"].createElement(link_1["default"], { href: "/auth", className: "flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md", onClick: function () { return setIsOpen(false); } },
                        react_1["default"].createElement(fi_1.FiUser, { className: "mr-2" }),
                        " Login"),
                    react_1["default"].createElement(link_1["default"], { href: "/expert-call", className: "flex items-center px-3 py-2 mt-2 bg-primaryColor text-white rounded-md hover:bg-blue-900", onClick: function () { return setIsOpen(false); } },
                        react_1["default"].createElement(fi_1.FiPhone, { className: "mr-2" }),
                        " Book a Call"))))));
};
exports["default"] = Navbar;
