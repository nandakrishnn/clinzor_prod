"use client";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.NavbarButton = exports.MobileNavToggle = exports.MobileNavMenu = exports.MobileNavHeader = exports.MobileNav = exports.NavbarLogo = exports.NavItems = exports.NavBody = exports.Navbar = void 0;
var utils_1 = require("@/lib/utils");
var icons_react_1 = require("@tabler/icons-react");
var framer_motion_1 = require("framer-motion");
var react_1 = require("react");
var image_1 = require("next/image");
var link_1 = require("next/link");
// Main Navbar wrapper
exports.Navbar = function (_a) {
    var children = _a.children, className = _a.className;
    var ref = react_1.useRef(null);
    var scrollY = framer_motion_1.useScroll({
        target: ref,
        offset: ["start start", "end start"]
    }).scrollY;
    var _b = react_1.useState(false), visible = _b[0], setVisible = _b[1];
    var _c = react_1.useState(0), scrollProgress = _c[0], setScrollProgress = _c[1];
    framer_motion_1.useMotionValueEvent(scrollY, "change", function (latest) {
        setVisible(latest > 50);
        var maxScroll = document.body.scrollHeight - window.innerHeight;
        setScrollProgress(Math.min(latest / (maxScroll || 1), 1));
    });
    return (react_1["default"].createElement(framer_motion_1.motion.div, { ref: ref, className: utils_1.cn("fixed inset-x-0 top-5 z-50 w-full", className), initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 } }, react_1["default"].Children.map(children, function (child) {
        return react_1["default"].isValidElement(child)
            ? react_1["default"].cloneElement(child, {
                visible: visible,
                scrollProgress: scrollProgress
            })
            : child;
    })));
};
// Main Nav for desktop
exports.NavBody = function (_a) {
    var children = _a.children, className = _a.className, visible = _a.visible, _b = _a.scrollProgress, scrollProgress = _b === void 0 ? 0 : _b;
    return (react_1["default"].createElement(framer_motion_1.motion.div, { initial: {
            width: "100%",
            height: "85px",
            backgroundColor: "rgba(255,255,255,0)",
            backdropFilter: "none",
            boxShadow: "none",
            y: 0,
            borderColor: "rgba(0,0,0,0.05)"
        }, animate: {
            width: visible ? "80%" : "85%",
            height: visible ? "70px" : "85px",
            backgroundColor: visible
                ? "rgba(255,255,255,0.7)"
                : "rgba(255,255,255,0)",
            backdropFilter: visible ? "blur(12px)" : "blur(0px)",
            boxShadow: visible
                ? "0 10px 30px -10px rgba(0,0,0,0.06), 0 0 10px rgba(0,0,0,0.03)"
                : "none",
            y: visible ? 10 : 0,
            borderColor: visible ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.05)"
        }, transition: { type: "spring", stiffness: 200, damping: 30 }, className: utils_1.cn("relative z-50 mx-auto hidden flex-row items-center justify-between rounded-xl border px-6 lg:flex", className), style: {
            borderWidth: "1px",
            color: visible ? "black" : "white",
            backgroundImage: visible
                ? "linear-gradient(135deg, rgba(255,255,255," + (0.6 + scrollProgress * 0.3) + ") " + scrollProgress * 100 + "%, rgba(240,242,245," + (0.6 + scrollProgress * 0.3) + ") 100%)"
                : undefined
        } },
        react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(link_1["default"], { href: "/", className: "inline-block" },
                react_1["default"].createElement(exports.NavbarLogo, { visible: visible || false })),
            children)));
};
// Desktop navigation links
exports.NavItems = function (_a) {
    var items = _a.items, className = _a.className, _b = _a.visible, visible = _b === void 0 ? false : _b, onItemClick = _a.onItemClick;
    var _c = react_1.useState(null), hovered = _c[0], setHovered = _c[1];
    return (react_1["default"].createElement(framer_motion_1.motion.div, { onMouseLeave: function () { return setHovered(null); }, className: utils_1.cn("absolute inset-0 z-50 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-bold  lg:flex", className) }, items.map(function (item, idx) { return (react_1["default"].createElement(framer_motion_1.motion.a, { key: idx, href: item.link, onClick: onItemClick, onMouseEnter: function () { return setHovered(idx); }, className: "relative px-4 py-2 group", initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: { delay: idx * 0.05, duration: 0.3 }, whileHover: { scale: 1.05 } },
        hovered === idx && (react_1["default"].createElement(framer_motion_1.motion.div, { layoutId: "hovered", className: "absolute inset-0 rounded-full  bg-gradient-to-r from-slate-100 to-slate-200 ", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.2 } })),
        react_1["default"].createElement("span", { className: utils_1.cn("relative z-10 font-medium group-hover:text-black") }, item.name))); })));
};
exports.NavbarLogo = function (_a) {
    var visible = _a.visible;
    return (react_1["default"].createElement(image_1["default"], { src: visible ? "/assets/logo/logo.png" : "/assets/logo/logo-white.png", alt: "Logo", width: 100, height: 100, className: "rounded-full z-50" }));
};
// Mobile Nav
exports.MobileNav = function (_a) {
    var children = _a.children, className = _a.className, visible = _a.visible, _b = _a.scrollProgress, scrollProgress = _b === void 0 ? 0 : _b;
    return (react_1["default"].createElement(framer_motion_1.motion.div, { initial: {
            width: "85%",
            height: "70px",
            backgroundColor: "rgba(255,255,255,0)",
            borderRadius: "1.5rem",
            backdropFilter: "none",
            boxShadow: "none",
            y: 0,
            borderColor: "rgba(0,0,0,0.05)"
        }, animate: {
            width: visible ? "85%" : "100%",
            height: visible ? "55px" : "70px",
            backgroundColor: visible
                ? "rgba(255,255,255,0.7)"
                : "rgba(255,255,255,0)",
            borderRadius: visible ? "1rem" : "1.5rem",
            backdropFilter: visible ? "blur(12px)" : "blur(0px)",
            boxShadow: visible
                ? "0 10px 30px -10px rgba(0,0,0,0.06), 0 0 10px rgba(0,0,0,0.03)"
                : "none",
            y: visible ? 10 : 0,
            borderColor: visible ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.05)"
        }, transition: { type: "spring", stiffness: 200, damping: 30 }, className: utils_1.cn("relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between border px-4 py-2 lg:hidden", className), style: {
            borderWidth: "1px",
            backgroundImage: visible
                ? "linear-gradient(135deg, rgba(255,255,255," + (0.6 + scrollProgress * 0.3) + ") " + scrollProgress * 100 + "%, rgba(240,242,245," + (0.6 + scrollProgress * 0.3) + ") 100%)"
                : undefined
        } },
        react_1["default"].createElement("div", { className: "flex justify-between w-full" },
            react_1["default"].createElement(exports.NavbarLogo, { visible: visible || false }),
            children)));
};
exports.MobileNavHeader = function (_a) {
    var children = _a.children, className = _a.className;
    return (react_1["default"].createElement("div", { className: utils_1.cn("flex w-full flex-row items-end justify-end z-50", className) }, children));
};
exports.MobileNavMenu = function (_a) {
    var children = _a.children, className = _a.className, isOpen = _a.isOpen, onClose = _a.onClose;
    return (react_1["default"].createElement(framer_motion_1.AnimatePresence, null, isOpen && (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 0.3 }, exit: { opacity: 0 }, className: "fixed inset-0 z-50 bg-slate-900", onClick: onClose }),
        react_1["default"].createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { type: "spring", damping: 25, stiffness: 300 }, className: utils_1.cn("absolute inset-x-0 top-20 z-50 mx-4 flex flex-col text-black items-start gap-4 rounded-xl border border-slate-200 bg-white/90 p-8 backdrop-blur-md shadow-xl", className) }, children)))));
};
exports.MobileNavToggle = function (_a) {
    var isOpen = _a.isOpen, onClick = _a.onClick;
    return (react_1["default"].createElement(framer_motion_1.motion.div, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, className: "z-50 cursor-pointer rounded-full border border-slate-200 bg-white/80 p-2 backdrop-blur-sm", onClick: onClick }, isOpen ? (react_1["default"].createElement(icons_react_1.IconX, { className: "h-5 w-5 text-slate-800" })) : (react_1["default"].createElement(icons_react_1.IconMenu2, { className: "h-5 w-5 text-slate-800" }))));
};
exports.NavbarButton = function (_a) {
    var href = _a.href, _b = _a.as, Tag = _b === void 0 ? "a" : _b, children = _a.children, className = _a.className, _c = _a.variant, variant = _c === void 0 ? "primary" : _c, props = __rest(_a, ["href", "as", "children", "className", "variant"]);
    var baseStyles = "px-4 py-2 rounded-lg text-sm font-medium relative cursor-pointer transition duration-300 inline-block text-center overflow-hidden z-50";
    var variantStyles = {
        primary: "bg-white/80 text-slate-800 shadow-lg shadow-slate-200/50 backdrop-blur-md border border-slate-200 hover:border-slate-300 cursor-pointer",
        secondary: "bg-transparent border border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/50 ",
        gradient: "bg-gradient-to-r from-slate-800 to-slate-600 text-white shadow-lg shadow-slate-300/30 hover:shadow-slate-300/40 hover:from-slate-700 hover:to-slate-500 "
    };
    return (react_1["default"].createElement(framer_motion_1.motion.div, null,
        react_1["default"].createElement(Tag, __assign({ href: href || '/', className: utils_1.cn(baseStyles, variantStyles[variant], className) }, props),
            react_1["default"].createElement("span", { className: "relative z-10" }, children))));
};
