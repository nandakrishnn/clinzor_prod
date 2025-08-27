"use strict";
exports.__esModule = true;
var react_1 = require("react");
var image_1 = require("next/image");
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var ServiceCard = function (_a) {
    var uuid = _a.uuid, name = _a.name, description = _a.description, tags = _a.tags, created_by = _a.created_by, image = _a.image;
    // Convert tags string into an array (max 2 tags to keep UI clean)
    var tagList = tags ? tags.split(",").slice(0, 2) : [];
    return (react_1["default"].createElement("div", { className: "rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100 hover:border-primary/20 bg-white hover:bg-gradient-to-br from-white to-primary/5" },
        react_1["default"].createElement("div", { className: "relative h-48 overflow-hidden" },
            react_1["default"].createElement(image_1["default"], { src: image && image.trim() !== "" ? image : "/service.png", alt: name, width: 500, height: 500, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }),
            (created_by === null || created_by === void 0 ? void 0 : created_by.includes("admin")) && (react_1["default"].createElement("div", { className: "absolute top-3 left-3 bg-blue-50 text-primaryColor text-xs font-semibold px-2 py-1 rounded-full" }, "Admin Service"))),
        react_1["default"].createElement("div", { className: "p-4 md:p-5" },
            react_1["default"].createElement("div", { className: "flex justify-between items-start mb-2" },
                react_1["default"].createElement("h3", { className: "font-bold text-lg text-gray-900 group-hover:text-primary line-clamp-1" }, name)),
            react_1["default"].createElement("p", { className: "text-gray-600 text-sm mb-4 line-clamp-2" }, description),
            tagList.length > 0 && (react_1["default"].createElement("div", { className: "flex gap-2 mb-3 flex-wrap" }, tagList.map(function (tag, idx) { return (react_1["default"].createElement("span", { key: idx, className: "bg-blue-50 text-primaryColor text-xs px-2 py-1 rounded" }, tag.trim())); }))),
            react_1["default"].createElement("div", { className: "flex gap-2 w-full" },
                react_1["default"].createElement(link_1["default"], { href: "/service/" + uuid, className: "flex-1 bg-primaryColor hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg text-sm text-center transition-colors flex items-center justify-center gap-1" },
                    "View clinic",
                    react_1["default"].createElement(lucide_react_1.ArrowRight, { className: "w-4 h-4" }))))));
};
exports["default"] = ServiceCard;
