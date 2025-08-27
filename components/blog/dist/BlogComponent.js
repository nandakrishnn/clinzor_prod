'use client';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var title_1 = require("../ui/title");
var navigation_1 = require("next/navigation");
var home_1 = require("@/service/user/home");
var blogs_png_1 = require("../../public/blogs.png");
var BlogComponent = function () {
    var navigate = navigation_1.useRouter();
    var _a = react_1.useState([]), blogData = _a[0], setBlogData = _a[1];
    var _b = react_1.useState(true), isLoading = _b[0], setIsLoading = _b[1];
    var getBlogData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, home_1.getAllBlogData()];
                case 1:
                    res = _b.sent();
                    console.log(res);
                    if (res.status === 200) {
                        setBlogData((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _b.sent();
                    console.log(error_1, 'from the blog listing component');
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        getBlogData();
    }, []);
    // Example blog data (you can replace this with API data)
    var blogs = [
        {
            id: 1,
            title: "10 Tips for a Healthy Smile",
            excerpt: "Discover the best dental hygiene tips for a brighter, healthier smile...",
            image: "https://picsum.photos/800/600?random=1",
            date: "Aug 10, 2025"
        },
        {
            id: 2,
            title: "The Future of Telemedicine",
            excerpt: "Telemedicine is reshaping healthcare. Learn how to access doctors from anywhere...",
            image: "https://picsum.photos/800/600?random=1",
            date: "Aug 8, 2025"
        },
        {
            id: 3,
            title: "Top 5 Nutrition Myths Debunked",
            excerpt: "Not everything you hear about dieting is true. Here’s what science says...",
            image: "https://picsum.photos/800/600?random=1",
            date: "Aug 5, 2025"
        },
        {
            id: 4,
            title: "How to Choose the Right Clinic",
            excerpt: "Finding the best clinic can be tricky. Here’s a guide to help you decide...",
            image: "https://picsum.photos/800/600?random=1",
            date: "Aug 1, 2025"
        }
    ];
    return (react_1["default"].createElement("section", null,
        react_1["default"].createElement("div", { className: "mx-auto max-w-7xl px-6" },
            react_1["default"].createElement("div", { className: "text-center" },
                react_1["default"].createElement(title_1["default"], { title: "Our Blogs", subtitle: "Real stories from users who\u2019ve discovered, booked, and visited\r\n            clinics through our platform." })),
            react_1["default"].createElement("div", { className: "mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" }, blogData === null || blogData === void 0 ? void 0 : blogData.map(function (blog) { return (react_1["default"].createElement("div", { key: blog === null || blog === void 0 ? void 0 : blog.uuid, className: "bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer", onClick: function () { return navigate.push("/blog/" + (blog === null || blog === void 0 ? void 0 : blog.uuid)); } },
                react_1["default"].createElement("img", { src: (blog === null || blog === void 0 ? void 0 : blog.image) || blogs_png_1["default"].src, alt: blog === null || blog === void 0 ? void 0 : blog.title, className: "w-full h-48 object-cover" }),
                react_1["default"].createElement("div", { className: "p-5" },
                    react_1["default"].createElement("p", { className: "text-xs text-gray-500 mb-2" }, blog === null || blog === void 0 ? void 0 : blog.created_at.split('T')[0]),
                    react_1["default"].createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-2 line-clamp-2 capitalize" }, blog === null || blog === void 0 ? void 0 : blog.title),
                    react_1["default"].createElement("p", { className: "text-sm text-gray-600 line-clamp-3" }, blog.excerpt)))); })),
            react_1["default"].createElement("div", { className: "flex items-center justify-center w-full mt-8" },
                react_1["default"].createElement("button", { onClick: function () { return navigate.push("/blog"); }, className: "bg-primaryColor p-2.5 text-sm text-white rounded-full px-10 hover:bg-primaryColor/90 transition" }, "See More")))));
};
exports["default"] = BlogComponent;
