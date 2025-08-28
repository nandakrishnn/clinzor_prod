"use client";
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
var ServiceCard_1 = require("./ServiceCard");
var ServiceSkelton_1 = require("./ServiceSkelton");
var sevicePage_1 = require("@/service/user/sevicePage");
var ServiceListSection = function () {
    var _a = react_1.useState(false), isLoading = _a[0], setIsLoading = _a[1];
    var _b = react_1.useState([]), services = _b[0], setServices = _b[1];
    var _c = react_1.useState(1), page = _c[0], setPage = _c[1];
    var _d = react_1.useState(1), totalPage = _d[0], setTotalPage = _d[1];
    var _e = react_1.useState(true), hasMore = _e[0], setHasMore = _e[1];
    var fetchServices = function (pageNum) { return __awaiter(void 0, void 0, void 0, function () {
        var res, totalPages, pageData_1, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    return [4 /*yield*/, sevicePage_1.getAllService(pageNum)];
                case 1:
                    res = _c.sent();
                    console.log(res, "from the service listing part");
                    totalPages = ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.total_pages) || 1;
                    setTotalPage(totalPages);
                    // Check if there are more pages
                    setHasMore(pageNum < totalPages);
                    pageData_1 = ((_b = res === null || res === void 0 ? void 0 : res.data) === null || _b === void 0 ? void 0 : _b.data) || [];
                    console.log(pageData_1, "from the data");
                    // ✅ For page 1, replace the data. For other pages, append to existing data
                    if (pageNum === 1) {
                        setServices(pageData_1);
                    }
                    else {
                        setServices(function (prev) { return __spreadArrays(prev, pageData_1); });
                    }
                    console.log("Fetched services count:", pageData_1.length);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _c.sent();
                    console.error("Error fetching services:", error_1);
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // initial load (page 1)
    react_1.useEffect(function () {
        fetchServices(1);
    }, []);
    var handleLoadMore = function () {
        if (page < totalPage) {
            var nextPage = page + 1;
            setPage(nextPage);
            fetchServices(nextPage);
        }
    };
    return (react_1["default"].createElement("div", { className: "space-y-8" },
        react_1["default"].createElement("section", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-9" }, services.map(function (service) { return (react_1["default"].createElement(ServiceCard_1["default"], { key: service.uuid, uuid: service.uuid, name: service.name, description: service.description, tags: service.tags, image: service.image })); })),
        isLoading && (react_1["default"].createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-9" }, Array.from({ length: 3 }).map(function (_, i) { return (react_1["default"].createElement(ServiceSkelton_1["default"], { key: "skeleton-" + i })); }))),
        hasMore && !isLoading && services.length > 0 && (react_1["default"].createElement("div", { className: "flex justify-center mt-8" },
            react_1["default"].createElement("button", { onClick: handleLoadMore, disabled: isLoading, className: "p-2.5 px-5 bg-primaryColor text-white rounded-full text-sm hover:bg-primaryColor/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" }, "Load More"))),
        !hasMore && services.length > 0 && (react_1["default"].createElement("div", { className: "text-center text-gray-500 mt-8" }, "No more services to load"))));
};
exports["default"] = ServiceListSection;
