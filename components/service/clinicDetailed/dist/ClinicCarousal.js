'use client';
"use strict";
exports.__esModule = true;
var button_1 = require("@/components/ui/button");
var react_1 = require("react");
var ClinicCarousal = function () {
    var _a, _b;
    var _c = react_1.useState("clinic-visit"), activeServiceTab = _c[0], setActiveServiceTab = _c[1];
    var _d = react_1.useState(null), selectedService = _d[0], setSelectedService = _d[1];
    var serviceTabs = [
        { id: "home-service", label: "Home Service", icon: "🏠" },
        { id: "clinic-visit", label: "Clinic Visit", icon: "🏥" },
        { id: "online-service", label: "Online Service", icon: "💻" },
    ];
    var handleServiceSelect = function (service) {
        setSelectedService(service);
    };
    return (react_1["default"].createElement("div", { className: ' className="max-w-7xl mx-auto px-4 sm:px-6 ' },
        react_1["default"].createElement("div", { className: "bg-white rounded-2xl shadow-sm border" },
            react_1["default"].createElement("div", { className: "p-6" },
                react_1["default"].createElement("div", { className: "flex flex-col md:flex-row gap-4 mb-6" }, serviceTabs.map(function (tab) { return (react_1["default"].createElement("button", { key: tab.id, onClick: function () { return setActiveServiceTab(tab.id); }, className: "px-6 py-3 rounded-full border-2 transition-all duration-200 " + (activeServiceTab === tab.id
                        ? "bg-[#033C8D] text-white border-[#033C8D]"
                        : "bg-white text-gray-700 border-gray-300 hover:border-[#033C8D]") },
                    react_1["default"].createElement("span", { className: "mr-2" }, tab.icon),
                    tab.label)); })),
                react_1["default"].createElement("div", { className: "bg-gray-50 rounded-xl p-6" },
                    react_1["default"].createElement("div", { className: "flex flex-col md:flex-row items-center justify-between" },
                        react_1["default"].createElement("div", { className: "flex items-center gap-4" },
                            react_1["default"].createElement("div", { className: "w-16 h-16 bg-[#033C8D] rounded-lg flex items-center justify-center text-white text-2xl" }, (_a = serviceTabs.find(function (tab) { return tab.id === activeServiceTab; })) === null || _a === void 0 ? void 0 : _a.icon),
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("h3", { className: "text-lg font-semibold text-gray-900" }, (_b = serviceTabs.find(function (tab) { return tab.id === activeServiceTab; })) === null || _b === void 0 ? void 0 : _b.label),
                                react_1["default"].createElement("p", { className: "text-gray-600" }, "Professional healthcare services"))),
                        react_1["default"].createElement(button_1.Button, { className: "bg-[#033C8D] hover:bg-[#033C8D]/90 text-white px-8 py-2", onClick: function () { return handleServiceSelect(serviceTabs.find(function (tab) { return tab.id === activeServiceTab; })); } }, "Book Now")))))));
};
exports["default"] = ClinicCarousal;
