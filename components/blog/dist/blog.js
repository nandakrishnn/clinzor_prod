"use client";
"use strict";
exports.__esModule = true;
var framer_motion_1 = require("framer-motion");
var BlogList_1 = require("./BlogList");
var BlogApp = function () {
    return (React.createElement(framer_motion_1.AnimatePresence, { mode: "wait" },
        React.createElement("section", { className: "max-w-7xl w-full mx-auto px-4 py-8" },
            React.createElement(BlogList_1["default"], null))));
};
exports["default"] = BlogApp;
