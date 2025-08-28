'use client';
"use strict";
exports.__esModule = true;
exports.BlogDetailView = void 0;
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var link_1 = require("next/link");
exports.BlogDetailView = function (_a) {
    var _b, _c;
    var post = _a.post;
    return (React.createElement("div", { className: "min-h-screen pb-10" },
        React.createElement("div", { className: "relative h-[50vh] overflow-hidden" },
            React.createElement("img", { src: (post === null || post === void 0 ? void 0 : post.image) || '/blogs.png', alt: post === null || post === void 0 ? void 0 : post.title, className: "w-full h-full object-cover", onError: function (e) {
                    e.currentTarget.src = '/blogs.png';
                } }),
            React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" }),
            React.createElement("div", { className: "container mx-auto px-4 sm:px-6 relative h-full flex flex-col justify-end pb-12" },
                React.createElement("button", { className: "absolute top-6 left-4 sm:left-6 flex items-center text-white bg-black/20 backdrop-blur-sm hover:bg-black/40 px-4 py-2 rounded-full transition-all duration-300" },
                    React.createElement(lucide_react_1.ArrowLeft, { size: 16, className: "mr-2" }),
                    "Back to Articles"),
                React.createElement("div", { className: "max-w-3xl mx-auto text-center" },
                    React.createElement("span", { className: "inline-block px-3 py-1 bg-white text-blue-600 text-sm font-medium rounded-full mb-4" }, "Blog"),
                    React.createElement("h1", { className: "text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" }, post === null || post === void 0 ? void 0 : post.title),
                    React.createElement("div", { className: "flex items-center justify-center space-x-6 text-white/90" },
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement("img", { src: (post === null || post === void 0 ? void 0 : post.image) || '/blogs.png', alt: post === null || post === void 0 ? void 0 : post.created_by, className: "w-8 h-8 rounded-full mr-2 border-2 border-white" }),
                            React.createElement("span", null, post === null || post === void 0 ? void 0 : post.created_by)),
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement(lucide_react_1.Calendar, { size: 16, className: "mr-1" }),
                            React.createElement("span", null, (_b = post === null || post === void 0 ? void 0 : post.created_at) === null || _b === void 0 ? void 0 : _b.split("T")[0])))))),
        React.createElement("div", { className: "container mx-auto px-4 sm:px-6 py-12 -mt-16 relative z-10" },
            React.createElement("div", { className: "max-w-4xl mx-auto" },
                React.createElement(framer_motion_1.motion.div, { className: "bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.6 } },
                    React.createElement("div", { className: "mb-4 " },
                        React.createElement("h1", { className: "text-2xl sm:text-2xl md:text-3xl font-bold text-black capitalize" }, post === null || post === void 0 ? void 0 :
                            post.title,
                            " ",
                            React.createElement("br", null)),
                        React.createElement("span", { className: "text-xs text-gray-600 font-semibold capitalize" },
                            "Auther : ", (_c = post === null || post === void 0 ? void 0 : post.created_by) === null || _c === void 0 ? void 0 :
                            _c.split("@")[0])),
                    React.createElement("div", { className: "prose prose-lg max-w-none", dangerouslySetInnerHTML: { __html: (post === null || post === void 0 ? void 0 : post.content) || "" } })),
                React.createElement("div", { className: "flex items-center justify-between bg-white rounded-xl shadow-md p-4 mb-12" },
                    React.createElement("div", { className: "flex items-center space-x-4" },
                        React.createElement("button", { className: "flex items-center space-x-1 text-gray-700 hover:primaryColor transition-colors" },
                            React.createElement(lucide_react_1.Bookmark, { size: 20, className: "fill-primaryColor text-primaryColor" }),
                            React.createElement("span", { className: "text-sm" })),
                        React.createElement("button", { className: "flex items-center space-x-1 text-gray-700 hover:text-primaryColor transition-colors" },
                            React.createElement(lucide_react_1.Heart, { size: 20 })),
                        React.createElement("button", { className: "flex items-center space-x-1 text-gray-700 hover:text-primaryColor transition-colors" },
                            React.createElement(lucide_react_1.Share2, { size: 20 }),
                            React.createElement("span", { className: "text-sm" }, "Share"))),
                    React.createElement(link_1["default"], { href: "/blog", className: "px-5 p-2.5 bg-primaryColor text-white rounded-full hover:bg-primaryColor transition-colors text-sm " }, "Back to Articles"))))));
};
