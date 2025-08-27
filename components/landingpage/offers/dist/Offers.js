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
var title_1 = require("@/components/ui/title");
var react_1 = require("react");
var OfferCard_1 = require("./OfferCard");
var home_1 = require("@/service/user/home");
var DataPlaceholder_1 = require("@/components/common/DataPlaceholder");
var HomeOfferSkelton_1 = require("@/components/skeltons/home/HomeOfferSkelton");
var Offers = function () {
    var _a = react_1.useState([]), offerData = _a[0], setOfferData = _a[1];
    var _b = react_1.useState(true), isLoading = _b[0], setIsLoading = _b[1];
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
    var getOffers = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, today_1, validOffers, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, home_1.getAllOffers()];
                case 2:
                    res = _b.sent();
                    if (res.status === 200) {
                        today_1 = new Date();
                        validOffers = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.data.filter(function (offer) {
                            var validFrom = offer.valid_from ? new Date(offer.valid_from) : null;
                            var validTo = offer.valid_to ? new Date(offer.valid_to) : null;
                            return ((!validFrom || today_1 >= validFrom) && // starts already
                                (!validTo || today_1 <= validTo) // not expired
                            );
                        });
                        setOfferData(validOffers);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _b.sent();
                    console.log(error_1, "error from the get offer component");
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        getOffers();
    }, []);
    if (isLoading) {
        return (react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 md:mt-16" }, Array.from({ length: 3 }).map(function (_, index) { return (react_1["default"].createElement(HomeOfferSkelton_1["default"], { key: index })); })));
    }
    if (offerData.length === 0) {
        return (react_1["default"].createElement(DataPlaceholder_1["default"], { title: "Currently No Offers Are Available", description: "There's no offers to display at the moment." }));
    }
    return (react_1["default"].createElement("section", { className: "overflow-hidden" },
        react_1["default"].createElement("div", { className: "@container mx-auto max-w-7xl px-3 md:px-6 md:pb-10" },
            react_1["default"].createElement(title_1["default"], { title: "Special Offers & Packages", subtitle: "Exclusive healthcare packages designed for your wellness needs. Save on comprehensive care.", variants: headingVariants }),
            react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 md:mt-16" }, 
            // Show actual offer cards when data is available
            offerData.map(function (offer, index) {
                var _a, _b, _c;
                return (react_1["default"].createElement(OfferCard_1["default"], { key: index, title: offer === null || offer === void 0 ? void 0 : offer.title, description: offer === null || offer === void 0 ? void 0 : offer.description, image: offer === null || offer === void 0 ? void 0 : offer.image, discount_percentage: offer === null || offer === void 0 ? void 0 : offer.discount_percentage, valid_from: (_a = offer === null || offer === void 0 ? void 0 : offer.valid_from) !== null && _a !== void 0 ? _a : "", valid_to: (_b = offer === null || offer === void 0 ? void 0 : offer.valid_to) !== null && _b !== void 0 ? _b : "", offer_type: (_c = offer === null || offer === void 0 ? void 0 : offer.offer_type) !== null && _c !== void 0 ? _c : "" }));
            })))));
};
exports["default"] = Offers;
