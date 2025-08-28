"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var react_1 = require("react");
var ServiceDetailed = function (_a) {
    var id = _a.id;
    return (react_1["default"].createElement("div", { className: "p-4 md:p-6 font-inter" },
        react_1["default"].createElement("section", { className: "flex flex-col md:flex-row gap-5 md:gap-10" },
            react_1["default"].createElement("div", { className: "w-full md:h-[400px] " },
                react_1["default"].createElement(image_1["default"], { src: "/admin.jpg", alt: "", width: 500, height: 500, className: "w-full h-full object-cover rounded-xl" })),
            react_1["default"].createElement("div", { className: "rounded-lg mb-8" },
                react_1["default"].createElement("h1", { className: "text-3xl font-bold text-[#424141] mb-2 capitalize" }, "Cardiologist Consultation"),
                react_1["default"].createElement("div", { className: "flex items-center mb-3" },
                    react_1["default"].createElement("div", { className: "text-yellow-400 text-xl mr-2" }, "\u2605\u2605\u2605\u2605\u2606"),
                    react_1["default"].createElement("span", { className: "text-gray-600 text-sm" }, "428 Reviews")),
                react_1["default"].createElement("p", { className: "italic text-gray-700 mb-4" }, "Highly rated by patients for: expert care, diagnosis accuracy, treatment results"),
                react_1["default"].createElement("div", { className: "mb-4 space-y-3 text-gray-700 leading-relaxed" },
                    react_1["default"].createElement("p", null, "A comprehensive skin examination by certified dermatologists. Our dermatology consultations include detailed analysis of skin conditions, personalized treatment plans, and follow-up recommendations. Services cover acne treatment, eczema, psoriasis, skin cancer screening, and cosmetic dermatology."),
                    react_1["default"].createElement("p", { className: "bg-blue-50 p-3 rounded italic" }, "\"The dermatologist was extremely thorough and explained everything clearly. My skin has improved significantly after just one visit.\" - Priya K.")),
                react_1["default"].createElement("div", { className: "flex flex-wrap gap-3 mt-4 capitalize" },
                    react_1["default"].createElement("span", { className: "bg-primaryColor text-blue-100 px-3 py-1.5 rounded-full text-xs" }, "\u2714\uFE0F heart"),
                    react_1["default"].createElement("span", { className: "bg-primaryColor text-blue-100 px-3 py-1.5 rounded-full text-xs" }, "\u2714\uFE0F cardiology"),
                    react_1["default"].createElement("span", { className: "bg-primaryColor text-blue-100 px-3 py-1.5 rounded-full text-xs" }, "\u2714\uFE0F blood pressure"),
                    react_1["default"].createElement("span", { className: "bg-primaryColor text-blue-100 px-3 py-1.5 rounded-full text-xs" }, "\u2714\uFE0F chest pain"))))));
};
exports["default"] = ServiceDetailed;
