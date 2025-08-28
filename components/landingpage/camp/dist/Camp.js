"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var image_1 = require("next/image");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var HealthAndSafety_1 = require("@mui/icons-material/HealthAndSafety");
var react_slick_1 = require("react-slick");
require("slick-carousel/slick/slick.css");
require("slick-carousel/slick/slick-theme.css");
var headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
            duration: 0.6
        }
    }
};
// Dummy images for the carousel
var carouselImages = [
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=1280",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=1280",
    "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=1280",
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=1280"
];
var Camp = function () {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false,
        pauseOnHover: true
    };
    return (react_1["default"].createElement("section", { className: "overflow-hidden" },
        react_1["default"].createElement("div", { className: "@container mx-auto max-w-7xl px-3 md:px-6 md:pb-20 flex flex-col md:flex-row gap-5 md:gap-14" },
            react_1["default"].createElement("div", { className: "md:h-[550px] rounded-2xl overflow-hidden w-full md:w-[60%]  relative shadow-lg" },
                react_1["default"].createElement(react_slick_1["default"], __assign({}, settings), carouselImages.map(function (image, index) { return (react_1["default"].createElement("div", { key: index, className: "h-[235px] md:h-[550px] relative" },
                    react_1["default"].createElement(image_1["default"], { src: image, alt: "Camp image " + (index + 1), fill: true, className: "object-cover", priority: index === 0 }))); }))),
            react_1["default"].createElement(framer_motion_1.motion.div, { className: "text-start w-full md:w-[50%] flex flex-col items-center justify-center", initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 }, variants: headingVariants },
                react_1["default"].createElement("div", { className: "text-start flex flex-col items-start justify-center" },
                    react_1["default"].createElement("h3", { className: "font-semibold text-[18px] italic " }, "Clinic Camp"),
                    react_1["default"].createElement("h2", { className: "w-full text-2xl md:text-3xl text-start font-bold text-[#424141] leading-7" }, "Lorem Ipsum is simply dummy"),
                    react_1["default"].createElement("ul", { className: "space-y-5 my-3 md:my-0 pt-5 md:pt-6" },
                        react_1["default"].createElement("li", { className: "flex gap-3 items-start" },
                            react_1["default"].createElement("span", { className: "text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5" },
                                react_1["default"].createElement(HealthAndSafety_1["default"], { className: "45" })),
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("strong", null, "1. Find Your Expert"),
                                react_1["default"].createElement("p", { className: "text-gray-500 text-sm" }, "Search for specialists based on their expertise and patient reviews."))),
                        react_1["default"].createElement("li", { className: "flex gap-3 items-start" },
                            react_1["default"].createElement("span", { className: "text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5" },
                                react_1["default"].createElement(HealthAndSafety_1["default"], { className: "45" })),
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("strong", null, "2. Select a Slot"),
                                react_1["default"].createElement("p", { className: "text-gray-500 text-sm" }, "Choose a date and time that works for you from the expert\u2019s available slots."))),
                        react_1["default"].createElement("li", { className: "flex gap-3 items-start" },
                            react_1["default"].createElement("span", { className: "text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5" },
                                react_1["default"].createElement(HealthAndSafety_1["default"], { className: "45" })),
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("strong", null, "3. Join the Call"),
                                react_1["default"].createElement("p", { className: "text-gray-500 text-sm" }, "Receive a secure link to join your video consultation at the scheduled time."))))),
                react_1["default"].createElement("button", { className: "w-full bg-primaryColor text-white p-2.5 text-sm rounded-full mt-8" }, "Register Now")))));
};
exports["default"] = Camp;
