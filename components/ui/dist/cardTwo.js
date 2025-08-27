"use strict";
exports.__esModule = true;
var utils_1 = require("@/lib/utils");
var react_1 = require("react");
var CardTwo = function (_a) {
    var className = _a.className, icon = _a.icon, title = _a.title, content = _a.content;
    return (react_1["default"].createElement("div", { className: utils_1.cn("rounded-[8px] p-6 pb-10 flex flex-col items-center justify-center ", className) },
        react_1["default"].createElement("div", { className: "bg-[#DBEAFE] p-3 rounded-full text-[#033C8D] " }, icon),
        react_1["default"].createElement("div", { className: "text-center" },
            react_1["default"].createElement("h2", { className: "font-semibold text-[18px] md:text-[20px] mt-5" }, title),
            react_1["default"].createElement("p", { className: "mt-3 text-[#4B5563] text-sm md:text-[16px] line-clamp-2 capitalize" }, content))));
};
exports["default"] = CardTwo;
