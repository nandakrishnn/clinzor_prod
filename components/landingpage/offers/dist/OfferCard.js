"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var offer_png_1 = require("../../../public/offer.png");
var OfferCard = function (_a) {
    var title = _a.title, description = _a.description, image = _a.image, discount_percentage = _a.discount_percentage, valid_from = _a.valid_from, valid_to = _a.valid_to, offer_type = _a.offer_type;
    return (react_1["default"].createElement(framer_motion_1.motion.div, { className: "relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col border border-gray-100", whileHover: { y: -8, scale: 1.02 }, initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, type: "spring" } },
        offer_type &&
            react_1["default"].createElement("div", { className: "absolute top-0 right-4 bg-primaryColor text-white font-bold px-3 py-1 rounded-b-lg z-10 text-xs uppercase tracking-wide" }, offer_type),
        react_1["default"].createElement("div", { className: "h-48 w-full relative overflow-hidden" },
            react_1["default"].createElement(image_1["default"], { src: offer_png_1["default"], alt: title, fill: true, className: "object-cover transition-transform duration-500 group-hover:scale-105", quality: 90 }),
            react_1["default"].createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" }),
            react_1["default"].createElement("div", { className: "z-40 absolute bottom-4 left-4 bg-white  text-primaryColor font-bold w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 border-primaryColor/80" },
                react_1["default"].createElement("div", { className: "text-xs text-center tracking-wide " }, discount_percentage && !isNaN(Number(discount_percentage))
                    ? Math.round(Number(discount_percentage)) + " % offer"
                    : "No offer"))),
        react_1["default"].createElement("div", { className: "bg-white p-5 flex-1 flex flex-col z-40" },
            react_1["default"].createElement("div", { className: "mb-3" },
                react_1["default"].createElement("h2", { className: "text-xl font-bold text-gray-800 line-clamp-2 leading-tight" }, title),
                react_1["default"].createElement("div", { className: "w-10 h-1 bg-primaryColor my-2 rounded-full" })),
            react_1["default"].createElement("p", { className: "capitalize text-gray-600 text-sm mb-4 line-clamp-3 flex-1" },
                description,
                " Valid From ", valid_from === null || valid_from === void 0 ? void 0 :
                valid_from.split("T")[0],
                " to",
                " ", valid_to === null || valid_to === void 0 ? void 0 :
                valid_to.split("T")[0])),
        react_1["default"].createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-primaryColor/90 to-primaryColorDark/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-5" })));
};
exports["default"] = OfferCard;
