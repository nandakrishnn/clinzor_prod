"use strict";
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var OfferCardSkeleton = function () {
    return (react_1["default"].createElement(framer_motion_1.motion.div, { className: "relative rounded-2xl overflow-hidden shadow-md h-full flex flex-col border border-gray-100 bg-gray-100", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, type: "spring" } },
        react_1["default"].createElement("div", { className: "absolute top-0 right-4 bg-gray-300 h-6 w-16 rounded-b-lg z-10 animate-pulse" }),
        react_1["default"].createElement("div", { className: "h-48 w-full relative overflow-hidden bg-gray-300 animate-pulse" }),
        react_1["default"].createElement("div", { className: "bg-white p-5 flex-1 flex flex-col z-40" },
            react_1["default"].createElement("div", { className: "mb-3" },
                react_1["default"].createElement("div", { className: "h-6 bg-gray-300 rounded-md mb-2 animate-pulse" }),
                react_1["default"].createElement("div", { className: "w-10 h-1 bg-gray-300 my-2 rounded-full animate-pulse" })),
            react_1["default"].createElement("div", { className: "space-y-2 mb-4 flex-1" },
                react_1["default"].createElement("div", { className: "h-4 bg-gray-300 rounded animate-pulse" }),
                react_1["default"].createElement("div", { className: "h-4 bg-gray-300 rounded animate-pulse w-3/4" }),
                react_1["default"].createElement("div", { className: "h-4 bg-gray-300 rounded animate-pulse w-1/2" })),
            react_1["default"].createElement("div", { className: "mt-auto w-full py-2 bg-gray-300 rounded-lg animate-pulse h-10" }))));
};
exports["default"] = OfferCardSkeleton;
