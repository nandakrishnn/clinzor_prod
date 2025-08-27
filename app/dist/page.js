"use client";
"use strict";
exports.__esModule = true;
var navbar_1 = require("@/components/landingpage/navbar/navbar");
var ServicesWeOffer_1 = require("@/components/landingpage/Ourservice/ServicesWeOffer");
var footer_1 = require("@/components/landingpage/footer/footer");
var Hero_1 = require("@/components/landingpage/hero/Hero");
var searchbar_1 = require("@/components/landingpage/searchbar/searchbar");
var testimonals_1 = require("@/components/landingpage/testimonials/testimonals");
var Faq_1 = require("@/components/landingpage/faq/Faq");
var Booking_1 = require("@/components/landingpage/booking/Booking");
var Offers_1 = require("@/components/landingpage/offers/Offers");
var Camp_1 = require("@/components/landingpage/camp/Camp");
var BlogComponent_1 = require("@/components/blog/BlogComponent");
function Home() {
    return (React.createElement("div", { className: "min-h-screen bg-gradient-to-b  to-white overflow-hidden" },
        React.createElement(navbar_1.NavbarDemo, null),
        React.createElement("main", { className: "z-10" },
            React.createElement("section", { className: "sm:min-h-[120vh] relative flex flex-col items-center " },
                React.createElement("div", { className: "min-h-[70vh] sm:min-h-[95vh] w-full flex flex-col justify-center items-center px-4 pt-20 pb-4 bg-gradient-to-t from-[#3A68AA] to-[#1C3455]" },
                    React.createElement(Hero_1["default"], null)),
                React.createElement("div", { className: "md:max-w-screen-6xl mx-auto md:absolute md:bottom-10 bg-white md:p-5 pt-5 md:pt-8 rounded-2xl" },
                    React.createElement(searchbar_1["default"], null))),
            React.createElement("section", { className: "bg-white py-10 sm:py-14 mb-20 sm:px-6" },
                React.createElement("div", { className: "max-w-screen-[1480px] mx-auto relative mt-16 md:mt-8" },
                    React.createElement(ServicesWeOffer_1["default"], null))),
            React.createElement("section", { className: "bg-gray-50 py-5 sm:py-14 pb-28 px-4 sm:px-6" },
                React.createElement("div", { className: "max-w-screen-xl mx-auto relative mt-16 md:mt-10 overflow-hidden" },
                    React.createElement(Offers_1["default"], null))),
            React.createElement("section", { className: "bg-white py-5 sm:py-14 pb-28 px-4 sm:px-6" },
                React.createElement("div", { className: "max-w-screen-xl mx-auto relative mt-16 md:mt-10 overflow-hidden" },
                    React.createElement(Camp_1["default"], null))),
            React.createElement("section", { className: "bg-gray-50 py-5 sm:py-14 pb-28 px-4 sm:px-6" },
                React.createElement("div", { className: "max-w-screen-xl mx-auto relative mt-16 md:mt-10 overflow-hidden" },
                    React.createElement(Booking_1["default"], null))),
            React.createElement("section", { className: "bg-white py-10 sm:py-14  sm:px-6" },
                React.createElement("div", { className: "max-w-screen-[1480px] mx-auto relative my-20" },
                    React.createElement(testimonals_1["default"], null))),
            React.createElement("section", { className: "bg-gray-50 py-10 sm:py-14 sm:px-6" },
                React.createElement("div", { className: "max-w-screen-xl mx-auto relative my-10" },
                    React.createElement(BlogComponent_1["default"], null))),
            React.createElement("section", { className: "bg-white py-10 sm:py-14 sm:px-6" },
                React.createElement("div", { className: "max-w-screen-xl mx-auto relative mt-20" },
                    React.createElement(Faq_1["default"], null))),
            React.createElement("section", null,
                React.createElement(footer_1["default"], null)))));
}
exports["default"] = Home;
