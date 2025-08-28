"use strict";
exports.__esModule = true;
var navbar_1 = require("@/components/landingpage/navbar/navbar");
var footer_1 = require("@/components/landingpage/footer/footer");
var blog_1 = require("@/components/blog/blog");
var CommonHeroSection_1 = require("@/components/common/CommonHeroSection");
var Faq_1 = require("@/components/landingpage/faq/Faq");
function BlogPage() {
    return (React.createElement("div", { className: "min-h-screen " },
        React.createElement(navbar_1.NavbarDemo, null),
        React.createElement("section", { className: "pb-10 " },
            React.createElement(CommonHeroSection_1["default"], { className: "h-[15vh]" })),
        React.createElement("main", { className: "relative z-10" },
            React.createElement("section", { className: "w-full flex flex-col justify-center items-center text-center px-4" },
                React.createElement(blog_1["default"], null))),
        React.createElement("section", { className: "bg-gray-50 py-10 sm:py-10 sm:px-6" },
            React.createElement("div", { className: "max-w-screen-xl mx-auto relative mt-10" },
                React.createElement(Faq_1["default"], null))),
        React.createElement(footer_1["default"], null)));
}
exports["default"] = BlogPage;
