'use client';
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
var button_1 = require("@/components/ui/button");
var react_1 = require("react");
var react_slick_1 = require("react-slick");
var Carousal = function () {
    var _a = react_1.useState("clinic-visit"), activeServiceTab = _a[0], setActiveServiceTab = _a[1];
    var serviceTabs = [
        { id: "home-service", label: "Home Service", icon: "🏠" },
        { id: "clinic-visit", label: "Clinic Visit", icon: "🏥" },
        { id: "online-service", label: "Online Service", icon: "💻" },
    ];
    // Slider settings
    var settings = {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    };
    return (react_1["default"].createElement("div", { className: "w-full" },
        react_1["default"].createElement(react_slick_1["default"], __assign({}, settings), serviceTabs.map(function (tab) { return (react_1["default"].createElement("div", { key: tab.id, className: "px-4" },
            react_1["default"].createElement("div", { className: "bg-white rounded-2xl shadow-sm border max-w-7xl mx-auto p-6" },
                react_1["default"].createElement("div", { className: "flex flex-col md:flex-row items-center justify-between" },
                    react_1["default"].createElement("div", { className: "flex items-center gap-4" },
                        react_1["default"].createElement("div", { className: "w-16 h-16 bg-[#033C8D] rounded-lg flex items-center justify-center text-white text-2xl" }, tab.icon),
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("h3", { className: "text-lg font-semibold text-gray-900" }, tab.label),
                            react_1["default"].createElement("p", { className: "text-gray-600" }, "Professional healthcare services"))),
                    react_1["default"].createElement(button_1.Button, { className: "bg-[#033C8D] hover:bg-[#033C8D]/90 text-white px-8 py-2", onClick: function () { return setActiveServiceTab(tab.id); } }, "Book Now"))))); }))));
};
exports["default"] = Carousal;
