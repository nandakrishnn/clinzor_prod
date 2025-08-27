"use strict";
exports.__esModule = true;
exports.USER_SERVICE = exports.USER_HOME = exports.login = exports.baseUrl = void 0;
exports.baseUrl = "https://bkd.clinzor.com/";
// export const baseUrl = "http://13.235.72.88:8000/"
exports.login = "user/login/";
// User Endpoint
exports.USER_HOME = {
    GET_SERVICE: 'clinic/service-lc/',
    GET_ALL_OFFERS: "clinic/offer-lc/",
    GET_ALL_BLOGS: "user/blog-list-create/",
    GET_ALL_FAQ: "clinic/faq-lc/"
};
exports.USER_SERVICE = {
    GET_ALL_SERVICE: "clinic/service-lc/"
};
