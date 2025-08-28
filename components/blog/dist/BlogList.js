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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var SearchSkeleton_1 = require("./skeltons/SearchSkeleton");
var FeaturedPostSkeleton_1 = require("./skeltons/FeaturedPostSkeleton");
var blogPage_1 = require("@/service/user/blogPage");
var DataPlaceholder_1 = require("../common/DataPlaceholder");
var SearchBar_1 = require("../common/SearchBar");
var lucide_react_1 = require("lucide-react");
var link_1 = require("next/link");
var BlogList = function () {
    var _a = react_1.useState([]), blogData = _a[0], setBlogData = _a[1];
    var _b = react_1.useState(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = react_1.useState(1), page = _c[0], setPage = _c[1];
    var _d = react_1.useState(1), totalPage = _d[0], setTotalPage = _d[1];
    var _e = react_1.useState(true), hasMore = _e[0], setHasMore = _e[1];
    var getBlogData = function (pageNum) { return __awaiter(void 0, void 0, void 0, function () {
        var res, totalPages, pageData_1, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, blogPage_1.getAllBlogs(pageNum)];
                case 1:
                    res = _c.sent();
                    totalPages = ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.total_pages) || 1;
                    setTotalPage(totalPages);
                    setHasMore(pageNum < totalPages);
                    pageData_1 = ((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.data) || [];
                    if (pageNum === 1) {
                        setBlogData(pageData_1);
                    }
                    else {
                        setBlogData(function (prev) { return __spreadArrays(prev, pageData_1); });
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _c.sent();
                    console.log(error_1, 'error message');
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        getBlogData(1);
    }, []);
    var handleLoadMore = function () {
        if (page < totalPage) {
            var nextPage = page + 1;
            setPage(nextPage);
            getBlogData(nextPage);
        }
    };
    if (isLoading) {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(SearchSkeleton_1.SearchSkeleton, null),
            react_1["default"].createElement("div", { className: "mb-16" },
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" }, Array.from({ length: 4 }).map(function (_, i) { return (react_1["default"].createElement(FeaturedPostSkeleton_1.FeaturedPostSkeleton, { key: i })); })))));
    }
    if (blogData.length === 0) {
        return (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement(SearchBar_1["default"], { placeHolder: 'Search Bogs....' }),
            react_1["default"].createElement(DataPlaceholder_1["default"], { title: 'Blog Data Not Available!' })));
    }
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(SearchBar_1["default"], { placeHolder: 'Search Bogs....' }),
        blogData.length > 0 && (react_1["default"].createElement("div", { className: "mb-16" },
            react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" }, blogData.slice(0, 4).map(function (post, index) { return (react_1["default"].createElement(link_1["default"], { href: "/blog/" + (post === null || post === void 0 ? void 0 : post.uuid), key: index, className: "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" },
                react_1["default"].createElement("img", { src: (post === null || post === void 0 ? void 0 : post.image) || '/blogs.png', alt: post === null || post === void 0 ? void 0 : post.title, className: "w-full h-48 object-cover", onError: function (e) {
                        e.currentTarget.src = '/blogs.png';
                    } }),
                react_1["default"].createElement("div", { className: "p-6 text-start capitalize" },
                    react_1["default"].createElement("span", { className: "inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full mb-2" }, "Blogs"),
                    react_1["default"].createElement("h3", { className: "text-xl font-semibold text-gray-900 mb-2 line-clamp-2" }, post === null || post === void 0 ? void 0 : post.title),
                    react_1["default"].createElement("p", { className: "text-gray-600 text-sm line-clamp-2" }, post === null || post === void 0 ? void 0 : post.content)))); })))),
        hasMore && !isLoading && blogData.length > 0 && (react_1["default"].createElement("div", { className: "flex justify-center mt-8" },
            react_1["default"].createElement("button", { onClick: handleLoadMore, disabled: isLoading, className: "p-2.5 px-5 bg-primaryColor flex items-center justify-center text-white rounded-full text-sm hover:bg-primaryColor/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" }, isLoading ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                react_1["default"].createElement(lucide_react_1.Loader, { size: 18, className: "animate-spin mr-2" }),
                "Loading...")) : (react_1["default"].createElement(react_1["default"].Fragment, null,
                "Load More",
                react_1["default"].createElement(lucide_react_1.ChevronRight, { size: 18, className: "ml-2" })))))),
        !hasMore && blogData.length > 0 && (react_1["default"].createElement("div", { className: "text-center text-gray-500 mt-8" }, "No more Blogs to load"))));
};
exports["default"] = BlogList;
