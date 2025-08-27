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
exports.__esModule = true;
var DataPlaceholder_1 = require("@/components/common/DataPlaceholder");
var accordion_1 = require("@/components/ui/accordion");
var title_1 = require("@/components/ui/title");
var home_1 = require("@/service/user/home");
var react_1 = require("react");
function FAQsTwo() {
    var _this = this;
    var _a = react_1.useState([]), faq = _a[0], setFaq = _a[1];
    var _b = react_1.useState(true), isLoading = _b[0], setIsLoading = _b[1];
    var getAllFaq = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, home_1.getFaq()];
                case 1:
                    res = _b.sent();
                    if (res.status === 200) {
                        setFaq((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _b.sent();
                    console.log(error_1, 'error from faq part');
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        getAllFaq();
    }, []);
    if (faq.length === 0) {
        return React.createElement(DataPlaceholder_1["default"], null);
    }
    return (React.createElement("section", { className: "pb-16" },
        React.createElement("div", { className: "mx-auto max-w-5xl px-4 md:px-6 " },
            React.createElement(title_1["default"], { title: "Frequently Asked Questions", subtitle: "Find answers to common questions about using our clinic platform.", description: "Frequently Asked Questions" }),
            React.createElement("div", { className: "mx-auto mt-12 max-w-3xl " },
                React.createElement(accordion_1.Accordion, { type: "single", collapsible: true, className: "bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0 bg-white" }, faq.map(function (item) { return (React.createElement(accordion_1.AccordionItem, { key: item === null || item === void 0 ? void 0 : item.uuid, value: item === null || item === void 0 ? void 0 : item.uuid, className: "border-dashed" },
                    React.createElement(accordion_1.AccordionTrigger, { className: "cursor-pointer text-base hover:no-underline" }, item === null || item === void 0 ? void 0 : item.question),
                    React.createElement(accordion_1.AccordionContent, null,
                        React.createElement("p", { className: "text-base" }, item === null || item === void 0 ? void 0 : item.answer)))); })),
                React.createElement("p", { className: "text-muted-foreground mt-6 px-8 text-center" },
                    "Still have questions? Reach out to our",
                    " ",
                    React.createElement("a", { href: "#", className: "text-primary font-medium hover:underline" }, "support team"),
                    " ",
                    "\u2014 we're here to help.")))));
}
exports["default"] = FAQsTwo;
