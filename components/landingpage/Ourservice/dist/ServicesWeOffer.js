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
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var cardTwo_1 = require("@/components/ui/cardTwo");
var title_1 = require("@/components/ui/title");
var HealthAndSafety_1 = require("@mui/icons-material/HealthAndSafety");
var DataPlaceholder_1 = require("@/components/common/DataPlaceholder");
var navigation_1 = require("next/navigation");
var home_1 = require("@/service/user/home");
var HomeServiceSkelton_1 = require("@/components/skeltons/home/HomeServiceSkelton");
function ServicesWeProvide() {
    var _this = this;
    var router = navigation_1.useRouter();
    var _a = react_1.useState([]), serviceData = _a[0], setService = _a[1];
    var _b = react_1.useState(true), isLoading = _b[0], setLoading = _b[1];
    var containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };
    var itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        },
        hover: {
            scale: 1.03,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        }
    };
    var headingVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                duration: 0.6
            }
        }
    };
    var getServiceData = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, home_1.getServices()];
                case 2:
                    res = _b.sent();
                    if (res.status) {
                        setService((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _b.sent();
                    console.log(error_1, "error form the home service list part");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        getServiceData();
    }, []);
    if (isLoading)
        return React.createElement(HomeServiceSkelton_1.CardSkelton, null);
    if (serviceData.length === 0) {
        return (React.createElement(DataPlaceholder_1["default"], { title: "No Services Available", description: "There are no services to display at this time." }));
    }
    return (React.createElement("section", { className: "overflow-hidden" },
        React.createElement("div", { className: "@container mx-auto max-w-7xl px-6 " },
            React.createElement(title_1["default"], { title: "Our Top Services", subtitle: "We provide a wide range of services to keep you and your family\n            healthy, safe, and informed.", variants: headingVariants }),
            React.createElement(framer_motion_1.motion.div, { className: "@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mt-16", variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.1 } }, serviceData === null || serviceData === void 0 ? void 0 : serviceData.slice(0, 6).map(function (service, index) { return (React.createElement(framer_motion_1.motion.div, { key: index, variants: itemVariants, whileHover: "hover" },
                React.createElement(cardTwo_1["default"], { className: "", icon: React.createElement(HealthAndSafety_1["default"], { className: "45" }), title: service === null || service === void 0 ? void 0 : service.name, content: service === null || service === void 0 ? void 0 : service.description }))); })),
            React.createElement("div", { className: "flex items-center justify-center w-full  mt-8" },
                React.createElement("button", { onClick: function () { return router.push("/service"); }, className: "bg-primaryColor p-2.5 text-sm text-white rounded-full px-10" }, "See More")))));
}
exports["default"] = ServicesWeProvide;
var CardDecorator = function (_a) {
    var children = _a.children;
    return (React.createElement(framer_motion_1.motion.div, { className: "relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]", whileHover: {
            rotate: [0, -2, 0],
            transition: { repeat: 0, duration: 0.5 }
        } },
        React.createElement("div", { "aria-hidden": true, className: "absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]" }),
        React.createElement("div", { "aria-hidden": true, className: "bg-radial to-background absolute inset-0 from-transparent to-75%" }),
        React.createElement(framer_motion_1.motion.div, { className: "dark:bg-zinc-900 absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t bg-white shadow-sm", whileHover: { scale: 1.05 }, transition: { type: "spring", stiffness: 400, damping: 10 } },
            React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0.7 }, whileHover: { opacity: 1, scale: 1.1 }, transition: { type: "spring", stiffness: 400, damping: 10 } }, children))));
};
