
export const baseUrl = "https://bkd.clinzor.com/"
// export const baseUrl = "http://13.235.72.88:8000/"

export const login = "user/login/"


// User Endpoint
export const USER_HOME = {
    GET_SERVICE: 'clinic/service-lc/',
    GET_ALL_OFFERS: "clinic/offer-lc/",
    GET_ALL_BLOGS: "user/blog-list-create/",
    GET_ALL_FAQ: "clinic/faq-lc/",
}

export const USER_SERVICE = {
    GET_ALL_SERVICE: "clinic/service-lc/",
    GET_A_SERVICE: "clinic/service-rud/",
    GET_CLINIC_SERVICE_RELATED: "clinic/top-clinics-by-service/",
    GET_SERVICE_RELATED_CLINIC: "clinic/search/",
}

export const USER_CLINIC = {
    GET_A_CLINIC : 'clinic/clinic-detail/',
    GET_CLINIC_RELATED_SERVICE : 'clinic/clinic-service-lc/',
    GET_CLINIC_RELATED_DOCTORS : 'clinic/doctor-lc/', //clinic id need to pass for
}

export const USER_BLOGS = {
    GET_ALL_BLOGS: "user/blog-list-create/",
    GET_A_BLOG: "user/blog-rud/"
}