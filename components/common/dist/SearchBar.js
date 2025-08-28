"use strict";
exports.__esModule = true;
var react_1 = require("react");
var SearchBar = function (_a) {
    var placeHolder = _a.placeHolder;
    return (react_1["default"].createElement("div", { className: "mb-12 max-w-2xl mx-auto" },
        react_1["default"].createElement("div", { className: "relative" },
            react_1["default"].createElement("input", { type: "text", placeholder: placeHolder, className: "w-full px-6 py-3 border border-gray-300 rounded-full focus:outline-none" }),
            react_1["default"].createElement("button", { className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" },
                react_1["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                    react_1["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }))))));
};
exports["default"] = SearchBar;
