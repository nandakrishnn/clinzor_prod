
export const baseUrl = "https://bkd.clinzor.com/"
// export const baseUrl = "http://13.235.72.88:8000/"

export const login = "user/login/"

// User Endpoint
export const USER_HOME = {
    GET_SERVICE: 'clinic/service-lc/',
    GET_ALL_OFFERS: "clinic/offer-lc/",
    GET_ALL_BLOGS: "user/blog-list-create/",
    GET_ALL_FAQ: "clinic/faq-lc/",
    GET_USER: "user/me/",
}

export const USER_SERVICE = {
    GET_ALL_SERVICE: "clinic/service-lc/",
    GET_A_SERVICE: "clinic/service-rud/",
    GET_CLINIC_SERVICE_RELATED: "clinic/top-clinics-by-service/",
    GET_CLINIC_SERVICES: "clinic/clinic-service-lc/",
    GET_SERVICE_RELATED_CLINIC: "clinic/search/",
    GET_SERVICE_CHARGES: "clinic/service-card-based/",
    GET_SERVICE_SLOT: "customer/slots/",
    GET_COUPON: "clinic/offer-lc/",
    CREATE_BOOKING: "customer/booking-lc/",
    CREATE_RAYZOR_PAY: "customer/create-payment/",
    VERIFY_STATUS: "customer/create-payment/",
    CREATE_CAMP: "clinic/camp-lc/",
    LIST_REVIEW: "customer/list-review/",
    CREATE_REVIEW: "customer/create-review/",
    GET_UUID_BY_SERVICE_NAME :'clinic/service-rud'

}

export const USER_CLINIC = {
    GET_A_CLINIC: 'clinic/clinic-detail/',
    GET_CLINIC_RELATED_SERVICE: 'clinic/clinic-service-lc/',
    GET_CLINIC_RELATED_DOCTORS: 'clinic/doctor-lc/', //clinic id need to pass for
}

export const USER_BLOGS = {
    GET_ALL_BLOGS: "user/blog-list-create/",
    GET_A_BLOG: "user/blog-rud/"
}

export const USER_PROFILE = {
    GET_BOOKINGS: 'customer/booking-lc/',
    CANCEL_BOOKING: 'customer/booking-cancel/',
    GET_LOGOUT: 'user/logout/',
    GET_UPDATE_USER_DETAILS: 'customer/update-customer-detail/',
}

export const USER_EXPERT = {
    GET_EXPERT: 'clinic/list-experts/',
    GET_EXPERT_SLOT: 'customer/expert-slots/',
    GET_EXPERT_SLOT_BOOKING: 'customer/expert-booking-lc/',
    GET_EXPERT_SLOT_ALL_BOOKING: 'customer/expert-booking-lc/',
    CANCEL_EXPERT_BOOKING: 'customer/expert-booking-cancel/',
    EXPERT_BOOKING_SUGGESTION: 'customer/list-suggestion/',
}
export const EXPERT = {
    EXPERT_PATCH_SUGGESTION: 'clinic/expert-suggestion-create/',
}


// CLINIC ENDPOINTS
export const CLINIC_DASHBOARD = {
    GETALL_DASH_STATIC: 'clinic/clinic-portal-dashboard-analytics/',
    GETALL_DASH_BOOKING: 'clinic/booking-weekly-trend/',
    GETALL_DASH_REVENUE: 'clinic/revenue-trend/',
    GETALL_DASH_SERVICE: 'clinic/clinic-service-usage-analytics/',
    GET_CLINIC_BY_USER: 'clinic/get-clinic-by-user/',
    GET_CLINIC_DUE_DASHBOARD: 'clinic/get-clinic-by-user/'
}