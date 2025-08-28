"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var material_1 = require("@mui/material");
var button_1 = require("@/components/ui/button");
var ClinicDetailedView = function () {
    var clinicInfo = {
        name: "MediCare Plus Clinic",
        rating: 4.8,
        reviews: 1247,
        address: "123 Healthcare Avenue, Medical District, City 12345",
        phone: "+1 (555) 123-4567",
        hours: "Mon-Fri: 8:00 AM - 8:00 PM, Sat-Sun: 9:00 AM - 5:00 PM",
        established: "2010",
        patients: "50,000+",
        description: "MediCare Plus Clinic is a leading healthcare facility dedicated to providing comprehensive medical services with state-of-the-art technology and compassionate care. Our team of experienced professionals is committed to your health and well-being."
    };
    var specialties = [
        {
            name: "Cardiology",
            icon: "",
            description: "Heart and cardiovascular care"
        },
        {
            name: "Dermatology",
            icon: "",
            description: "Skin and cosmetic treatments"
        },
        {
            name: "Orthopedics",
            icon: "",
            description: "Bone and joint specialists"
        },
        { name: "Pediatrics", icon: "", description: "Children's healthcare" },
        { name: "Neurology", icon: "", description: "Brain and nervous system" },
        { name: "Gynecology", icon: "", description: "Women's health services" }
    ];
    var doctors = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            experience: "15 years",
            rating: 4.9,
            image: "/professional-female-doctor.png",
            qualifications: "MD, FACC",
            availability: "Mon, Wed, Fri"
        },
        {
            id: 2,
            name: "Dr. Michael Chen",
            specialty: "Orthopedic Surgeon",
            experience: "12 years",
            rating: 4.8,
            image: "/professional-male-doctor.png",
            qualifications: "MD, FAAOS",
            availability: "Tue, Thu, Sat"
        },
        {
            id: 3,
            name: "Dr. Emily Rodriguez",
            specialty: "Dermatologist",
            experience: "10 years",
            rating: 4.9,
            image: "/professional-female-dermatologist.png",
            qualifications: "MD, FAAD",
            availability: "Mon, Tue, Thu"
        },
        {
            id: 4,
            name: "Dr. James Wilson",
            specialty: "Pediatrician",
            experience: "18 years",
            rating: 4.7,
            image: "/professional-male-pediatrician.png",
            qualifications: "MD, FAAP",
            availability: "Wed, Fri, Sat"
        }
    ];
    var services = [
        {
            id: 1,
            name: "General Consultation",
            price: "₹800",
            image: "/doctor-consultation.png",
            description: "Complete health checkup with experienced doctors",
            duration: "30 mins",
            availability: "Available Today",
            maleDoctors: 5,
            femaleDoctors: 3,
            serviceType: "consultation"
        },
        {
            id: 2,
            name: "Specialist Consultation",
            price: "₹1200",
            image: "/specialist-doctor.png",
            description: "Expert consultation for specific health concerns",
            duration: "45 mins",
            availability: "Available Today",
            maleDoctors: 3,
            femaleDoctors: 2,
            serviceType: "specialist"
        },
        {
            id: 3,
            name: "Health Checkup Package",
            price: "₹2500",
            image: "/health-checkup.png",
            description: "Comprehensive health screening package",
            duration: "2 hours",
            availability: "Book in Advance",
            maleDoctors: 4,
            femaleDoctors: 3,
            serviceType: "checkup"
        },
    ];
    var offers = [
        { text: "10% Off on First Visit", discount: "10%" },
        { text: "Free Health Checkup", discount: "Free" },
        { text: "Family Package Discount", discount: "20%" },
    ];
    return (React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 " },
        React.createElement("div", { className: "bg-white rounded-2xl shadow-lg p-8 mb-8 border " },
            React.createElement("div", { className: "flex flex-col lg:flex-row gap-8" },
                React.createElement("div", { className: "flex-1" },
                    React.createElement("div", { className: "flex items-center gap-3 mb-4" },
                        React.createElement("h1", { className: "text-3xl font-bold text-gray-900" }, clinicInfo.name)),
                    React.createElement("div", { className: "flex items-center gap-2 mb-4" },
                        React.createElement("div", { className: "flex items-center gap-1" }, __spreadArrays(Array(5)).map(function (_, i) { return (React.createElement(lucide_react_1.Star, { key: i, className: "w-5 h-5 " + (i < Math.floor(clinicInfo.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300") })); })),
                        React.createElement("span", { className: "font-semibold text-gray-900" }, clinicInfo.rating),
                        React.createElement("span", { className: "text-gray-600" },
                            "(",
                            clinicInfo.reviews,
                            " reviews)")),
                    React.createElement("p", { className: "text-gray-700 mb-6 leading-relaxed" }, clinicInfo.description),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                        React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement(lucide_react_1.MapPin, { className: "w-5 h-5 text-[#033C8D]" }),
                            React.createElement("span", { className: "text-gray-700" }, clinicInfo.address)),
                        React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement(lucide_react_1.Phone, { className: "w-5 h-5 text-[#033C8D]" }),
                            React.createElement("span", { className: "text-gray-700" }, clinicInfo.phone)),
                        React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement(lucide_react_1.Clock, { className: "w-5 h-5 text-[#033C8D]" }),
                            React.createElement("span", { className: "text-gray-700" }, clinicInfo.hours)))),
                React.createElement("div", { className: "lg:w-80" },
                    React.createElement("div", { className: "bg-gradient-to-br from-[#033C8D] to-blue-700 rounded-xl p-6 text-white" },
                        React.createElement("h3", { className: "text-xl font-semibold mb-4" }, "Quick Stats"),
                        React.createElement("div", { className: "space-y-4" },
                            React.createElement("div", { className: "flex items-center justify-between" },
                                React.createElement("div", { className: "flex items-center gap-2" },
                                    React.createElement(lucide_react_1.Award, { className: "w-5 h-5" }),
                                    React.createElement("span", null, "Established")),
                                React.createElement("span", { className: "font-semibold" }, clinicInfo.established)),
                            React.createElement("div", { className: "flex items-center justify-between" },
                                React.createElement("div", { className: "flex items-center gap-2" },
                                    React.createElement(lucide_react_1.Users, { className: "w-5 h-5" }),
                                    React.createElement("span", null, "Patients Served")),
                                React.createElement("span", { className: "font-semibold" }, clinicInfo.patients)),
                            React.createElement("div", { className: "flex items-center justify-between" },
                                React.createElement("div", { className: "flex items-center gap-2" },
                                    React.createElement(lucide_react_1.Stethoscope, { className: "w-5 h-5" }),
                                    React.createElement("span", null, "Specialties")),
                                React.createElement("span", { className: "font-semibold" },
                                    specialties.length,
                                    "+"))))))),
        React.createElement("div", { className: "mb-8" },
            React.createElement("h2", { className: "text-xl font-bold text-gray-900 mb-6" }, "Top Services"),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6" }, services.map(function (service) { return (React.createElement(card_1.Card, { key: service.id, className: "hover:shadow-lg transition-shadow duration-300" },
                React.createElement(card_1.CardContent, { className: "p-6" },
                    React.createElement("div", { className: "flex items-center gap-4 mb-4" },
                        React.createElement("img", { src: service.image || "/placeholder.svg", alt: service.name, className: "w-16 h-16 rounded-lg object-cover" }),
                        React.createElement("div", { className: "flex-1" },
                            React.createElement("h3", { className: "font-semibold text-gray-900" }, service.name),
                            React.createElement("p", { className: "text-sm text-gray-600" }, service.description))),
                    React.createElement("div", { className: "flex items-center justify-between mb-4" },
                        React.createElement("div", null,
                            React.createElement("span", { className: "text-lg font-bold text-[#033C8D]" }, service.price),
                            React.createElement("span", { className: "text-sm text-gray-600 ml-2" },
                                "(",
                                service.duration,
                                ")")),
                        React.createElement(material_1.Badge, { className: "text-green-600 bg-green-50" }, service.availability)),
                    React.createElement("div", { className: "flex items-center gap-4 mb-4 text-sm text-gray-600" },
                        React.createElement("div", { className: "flex items-center gap-1" },
                            React.createElement(lucide_react_1.Users, { className: "w-4 h-4" }),
                            React.createElement("span", null,
                                "Male: ",
                                service.maleDoctors)),
                        React.createElement("div", { className: "flex items-center gap-1" },
                            React.createElement(lucide_react_1.Users, { className: "w-4 h-4" }),
                            React.createElement("span", null,
                                "Female: ",
                                service.femaleDoctors))),
                    React.createElement(button_1.Button, { className: "w-full bg-[#033C8D] hover:bg-[#033C8D]/90 text-white" }, "Book Now")))); }))),
        React.createElement("div", { className: "mb-8" },
            React.createElement("h2", { className: "text-xl font-bold text-gray-900 mb-6" }, "Offers Going On"),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" }, offers.map(function (offer, index) { return (React.createElement("div", { key: index, className: "bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4" },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("span", { className: "text-sm font-medium text-gray-800" }, offer.text),
                    React.createElement(material_1.Badge, { className: "bg-green-500 text-white rounded-xl px-5" }, offer.discount)))); }))),
        React.createElement("div", { className: "mb-12" },
            React.createElement("h2", { className: "text-2xl font-bold text-gray-900 mb-6" }, "Our Expert Doctors"),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" }, doctors.map(function (doctor) { return (React.createElement(card_1.Card, { key: doctor.id, className: "hover:shadow-lg transition-shadow duration-300 border border-gray-200" },
                React.createElement(card_1.CardContent, { className: "p-6 text-center" },
                    React.createElement("div", { className: "mb-4" },
                        React.createElement("img", { src: doctor.image || "/placeholder.svg", alt: doctor.name, className: "w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#033C8D]/10" })),
                    React.createElement("h3", { className: "text-lg font-semibold text-gray-900 mb-1" }, doctor.name),
                    React.createElement("p", { className: "text-[#033C8D] font-medium mb-2" }, doctor.specialty),
                    React.createElement("p", { className: "text-sm text-gray-600 mb-2" }, doctor.qualifications),
                    React.createElement("div", { className: "flex items-center justify-center gap-1 mb-2" },
                        React.createElement(lucide_react_1.Star, { className: "w-4 h-4 fill-yellow-400 text-yellow-400" }),
                        React.createElement("span", { className: "text-sm font-medium" }, doctor.rating)),
                    React.createElement("p", { className: "text-xs text-gray-500 mb-3" },
                        doctor.experience,
                        " experience"),
                    React.createElement("p", { className: "text-xs text-gray-600 mb-4" },
                        "Available: ",
                        doctor.availability)))); })))));
};
exports["default"] = ClinicDetailedView;
