'use client'
import {
  Star,
  MapPin,
  Phone,
  Clock,
  Award,
  Users,
  Stethoscope
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@mui/material";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Email } from "@mui/icons-material";

interface ClinicDetailedViewProps {
  data: any,
  services: any,
  activeServiceTab: string
}

const ClinicDetailedView: React.FC<ClinicDetailedViewProps> = ({ data, services, activeServiceTab }) => {
  const clinicInfo = data?.clinic

  // const clinicInfo = {
  //   name: "MediCare Plus Clinic",
  //   rating: 4.8,
  //   reviews: 1247,
  //   address: "123 Healthcare Avenue, Medical District, City 12345",
  //   phone: "+1 (555) 123-4567",
  //   hours: "Mon-Fri: 8:00 AM - 8:00 PM, Sat-Sun: 9:00 AM - 5:00 PM",
  //   established: "2010",
  //   patients: "50,000+",
  //   description:
  //     "MediCare Plus Clinic is a leading healthcare facility dedicated to providing comprehensive medical services with state-of-the-art technology and compassionate care. Our team of experienced professionals is committed to your health and well-being."
  // };

  const specialties = [
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

  const doctors = [
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

  // const services = [
  //   {
  //     id: 1,
  //     name: "General Consultation",
  //     price: "₹800",
  //     image: "/doctor-consultation.png",
  //     description: "Complete health checkup with experienced doctors",
  //     duration: "30 mins",
  //     availability: "Available Today",
  //     maleDoctors: 5,
  //     femaleDoctors: 3,
  //     serviceType: "consultation",
  //   },
  //   {
  //     id: 2,
  //     name: "Specialist Consultation",
  //     price: "₹1200",
  //     image: "/specialist-doctor.png",
  //     description: "Expert consultation for specific health concerns",
  //     duration: "45 mins",
  //     availability: "Available Today",
  //     maleDoctors: 3,
  //     femaleDoctors: 2,
  //     serviceType: "specialist",
  //   },
  //   {
  //     id: 3,
  //     name: "Health Checkup Package",
  //     price: "₹2500",
  //     image: "/health-checkup.png",
  //     description: "Comprehensive health screening package",
  //     duration: "2 hours",
  //     availability: "Book in Advance",
  //     maleDoctors: 4,
  //     femaleDoctors: 3,
  //     serviceType: "checkup",
  //   },
  // ]

  const router = useRouter();
  const { id } = useParams();

  console.log(services, 'clinic service data')
  console.log(clinicInfo?.uuid, 'clinic service data')
  const offers = [
    { text: "10% Off on First Visit", discount: "10%" },
    { text: "Free Health Checkup", discount: "Free" },
    { text: "Family Package Discount", discount: "20%" },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
      {/* Clinic Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border ">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {clinicInfo?.name}
              </h1>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(clinicInfo?.avg_rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-900">
                {clinicInfo?.avg_rating || 0}
              </span>
              <span className="text-gray-600">
                ({clinicInfo?.total_reviews || 0} reviews )
              </span>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed text-justify">
              {clinicInfo?.about_clinic}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#033C8D]" />
                <span className="text-gray-700">{clinicInfo?.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#033C8D]" />
                <span className="text-gray-700">{clinicInfo?.contact_number}</span>
              </div>
              <div className="flex items-center gap-3">
                <Email className="w-5 h-5 text-[#033C8D]" />
                <span className="text-gray-700">{clinicInfo?.email}</span>
              </div>
              {/* <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#033C8D]" />
                <span className="text-gray-700">{clinicInfo?.hours}</span>
              </div> */}
            </div>
          </div>

          <div className="lg:w-80">
            <div className="bg-gradient-to-br from-[#033C8D] to-blue-700 rounded-xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>Total Service</span>
                  </div>
                  <span className="font-semibold">
                    {data?.top_services?.length} +
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>Female Doctors</span>
                  </div>
                  <span className="font-semibold">{data?.female_doctors} +</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    <span>Male Doctors</span>
                  </div>
                  <span className="font-semibold">{data?.male_doctors} +</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <div className="mb-8" id="service">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services?.map((service: any) => (
            <Card key={service?.uuid} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={service?.image || "/clinic.png"}
                    alt={service?.service_name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{service?.clinic_provided_name || service?.service_name}</h3>
                    <p className="text-sm text-gray-600">{service?.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-bold text-[#033C8D]">₹ {service?.consultation_charge_physical_visit}</span>
                    <span className="text-sm text-gray-600 ml-2">( {service?.duration || "45 min"} )</span>
                  </div>
                  <Badge className={`${service?.status === "APPROVED" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"} px-2 py-1 rounded-md text-sm`}>
                    {service?.status === "APPROVED" ? "Available" : "Not Available"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Male: {data?.male_doctors || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Female: {data?.female_doctors || 0}</span>
                  </div>
                </div>
                <Button
                  className="w-full bg-[#033C8D] hover:bg-[#033C8D]/90 text-white"
                  onClick={() => router.push(`/service/clinic/booking/${clinicInfo?.uuid}?selectedService=${activeServiceTab}&&serviceId=${service?.uuid}`)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Offers Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Offers Going On</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">{offer.text}</span>
                <Badge className="bg-green-500 text-white rounded-xl px-5">{offer.discount}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctors Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6"> Our Expert Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#033C8D]/10"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-[#033C8D] font-medium mb-2">
                  {doctor.specialty}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {doctor.qualifications}
                </p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{doctor.rating}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {doctor.experience} experience
                </p>
                <p className="text-xs text-gray-600 mb-4">
                  Available: {doctor.availability}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClinicDetailedView;
