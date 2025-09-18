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
import DataPlaceholder from "@/components/common/DataPlaceholder";
import { useSession } from "next-auth/react";
import { ClinicDetailedViewSkeleton } from "@/components/skeltons/service/ClinicDetailedViewSkeleton";

interface ClinicDetailedViewProps {
  data: any,
  services: any,
  activeServiceTab: string,
  doctors: any,
  serviceId: any,
  loading?: boolean;
}

const ClinicDetailedView: React.FC<ClinicDetailedViewProps> = ({ serviceId, data, services, activeServiceTab, doctors, loading = false, }) => {
  const router = useRouter();
  const clinicInfo = data?.clinic
  const stats = data?.stats

  // user data
  const { data: session } = useSession()

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) return <ClinicDetailedViewSkeleton />;
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
                    className={`w-5 h-5 ${i < Math.floor(stats?.avg_rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-gray-900">
                {stats?.avg_rating?.toFixed(1) || 0}
              </span>
              <span className="text-gray-600">
                ({stats?.review_count || 0} reviews )
              </span>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed text-justify">
              {clinicInfo?.about_clinic}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#033C8D]" />
                <span className="text-gray-700">{clinicInfo?.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#033C8D]" />
                <span className="text-gray-700">{clinicInfo?.contact_number}</span>
              </div>
              <div className="flex items-start gap-3">
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
        {
          services?.length == 0 ? <DataPlaceholder title="No Service Available" /> : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services?.map((service: any) => (
                <Card key={service?.uuid} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={service?.image || "/clinic.png"}
                        alt={service?.service_name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 capitalize">{service?.clinic_provided_name || service?.service_name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3">{service?.description}</p>
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
                      onClick={() => { session?.accessToken ? router.push(`/service/clinic/booking/${clinicInfo?.uuid}?selectedService=${activeServiceTab}&&serviceId=${service?.service}`) : router.push('/auth') }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        }
      </div>

      {/* Offers Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Exclusive Offers</h2>

        {data?.offers.length === 0 ? (
          <DataPlaceholder title="No Offers Available" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.offers.map((offer: any, index: number) => (
              <div
                key={index}
                className="relative bg-gradient-to-br from-white to-gray-50 border border-dashed border-[#033C8D]/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Discount Badge */}
                <div className="absolute top-0 right-0 bg-[#033C8D] text-white text-sm font-semibold px-3 py-1 rounded-bl-lg">
                  {offer?.discount_percentage
                    ? `${parseFloat(offer?.discount_percentage).toFixed(0)}% OFF`
                    : `₹${offer?.flat_discount_amt} OFF`}
                </div>

                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {offer?.title}
                  </h3>

                  {/* Description */}
                  {offer?.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {offer?.description}
                    </p>
                  )}

                  {/* Validity */}
                  {(offer?.valid_from || offer?.valid_to) && (
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-dashed pt-3">
                      <span>
                        From:{" "}
                        <span className="font-medium text-gray-700">
                          {formatDate(offer?.valid_from)}
                        </span>
                      </span>
                      <span>
                        Till:{" "}
                        <span className="font-medium text-gray-700">
                          {formatDate(offer?.valid_to)}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Doctors Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6"> Our Doctors Doctors</h2>
        {doctors?.length == 0 ? <DataPlaceholder title="No Doctors Available For Now" /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors?.map((doctor: any) => (
              <Card
                key={doctor?.uuid}
                className="hover:shadow-lg transition-shadow duration-300 border border-gray-200"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <img
                      src={doctor?.profile_pic || "/clinic.png"}
                      alt={doctor?.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#033C8D]/10"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {doctor?.name}
                  </h3>
                  <p className="text-[#033C8D] font-medium mb-2">
                    {doctor?.specializaton}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {doctor?.education}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{doctor?.rating || 4.5}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {doctor?.experience} experience
                  </p>
                  <p className="text-xs text-gray-600 mb-4">
                    Available: {doctor?.status === "APPROVED" ? "Mon to Fri" : "Not Available"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicDetailedView;
