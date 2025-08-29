"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var fi_1 = require("react-icons/fi");
var common_1 = require("@/types/common");
var ClinicCard_1 = require("./ClinicCard");
var title_1 = require("../ui/title");
var AvailableClinics = function (_a) {
    var id = _a.id;
    var router = navigation_1.useRouter();
    var _b = react_1.useState(4), visibleCards = _b[0], setVisibleCards = _b[1];
    var _c = react_1.useState(0), currentIndex = _c[0], setCurrentIndex = _c[1];
    react_1.useEffect(function () {
        var handleResize = function () {
            var width = window.innerWidth;
            var cards = 1;
            if (width >= 768)
                cards = 2;
            if (width >= 1024)
                cards = 4;
            setVisibleCards(cards);
            setCurrentIndex(0);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return function () { return window.removeEventListener("resize", handleResize); };
    }, []);
    // Calculate total slides and current slide
    var totalSlides = Math.ceil(common_1.clinicData.length / visibleCards);
    var currentSlide = Math.floor(currentIndex / visibleCards);
    var handleNext = function () {
        setCurrentIndex(function (prev) {
            var nextIndex = prev + visibleCards;
            return nextIndex >= common_1.clinicData.length ? 0 : nextIndex;
        });
    };
    var handlePrev = function () {
        setCurrentIndex(function (prev) {
            var prevIndex = prev - visibleCards;
            return prevIndex < 0 ? (totalSlides - 1) * visibleCards : prevIndex;
        });
    };
    var goToSlide = function (slideIndex) {
        setCurrentIndex(slideIndex * visibleCards);
    };
    var handleBookNow = function (clinic) {
        router.push("/service/clinic/" + clinic.id);
    };
    // Calculate the subset of clinics to display
    var visibleClinics = common_1.clinicData.slice(currentIndex, currentIndex + visibleCards);
    return (react_1["default"].createElement("div", { className: "p-4 md:p-6 font-inter max-w-7xl mx-auto" },
        react_1["default"].createElement("div", { className: "flex justify-center items-center mb-6 w-full " },
            react_1["default"].createElement(title_1["default"], { title: "Select your Clinic", description: "Available at these clinics", subtitle: "" })),
        react_1["default"].createElement("div", { className: "relative overflow-hidden" },
            react_1["default"].createElement("div", { className: "flex justify-start gap-4" }, visibleClinics.map(function (clinic) { return (react_1["default"].createElement("div", { key: clinic.id, className: "flex-shrink-0 pb-5", style: {
                    width: "calc(" + 100 / visibleCards + "% - 1rem)",
                    minWidth: "280px" // Ensures cards don't get too small
                } },
                react_1["default"].createElement(ClinicCard_1["default"], { clinic: clinic, onBookNow: handleBookNow }))); }))),
        totalSlides > 1 && (react_1["default"].createElement("div", { className: "flex gap-2 md:gap-5 items-center justify-center mt-5" },
            react_1["default"].createElement("button", { onClick: handlePrev, className: "p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors", "aria-label": "Previous clinics" },
                react_1["default"].createElement(fi_1.FiChevronLeft, { className: "text-gray-700" })),
            react_1["default"].createElement("button", { onClick: handleNext, className: "p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors", "aria-label": "Next clinics" },
                react_1["default"].createElement(fi_1.FiChevronRight, { className: "text-gray-700" }))))));
};
exports["default"] = AvailableClinics;
