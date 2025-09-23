import React, { useEffect, useState } from "react";
import { Star, MapPin, Phone, Clock, ChevronRight, Calendar, Users, Shield, Camera, Heart, Award, CheckCircle } from "lucide-react";
import { getAClinic, getAClinicService, GetAllDoctor, GetAllSpecialties, getClinicDoctors, getClinicServiceData, getClinicTimingServiceData } from "@/service/admin/clinicManagentService";


interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  education: string;
  experience: string;
  availability: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Clinic {
  uuid: string;
  created_by: string;
  name: string;
  address: string;
  pincode: number;
  map_link: string;
  coordinates: string;
  is_active: boolean;
  status: string;
  city: string;
  about_clinic?: string;
  contact_number?: string;
  images: string[];
}

interface ApiDoctor {
  uuid: string;
  name: string;
  specialty: string;
  profile_picture?: string;
  education?: string;
  experience?: string;
  availability?: string;
  // Add other fields as per your API response
}

interface ApiService {
  uuid: string;
  name: string;
  description: string;
  category: string;
  clinic_provided_name: string;
  service_name: string;
  // Add other fields as per your API response
}

export default function AdminClinicDetail({ clinicId }: { clinicId: string }) {
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [clinicRating, setClinicRating] = useState<any | null>(null);
  const [clinicTime, setClinicTime] = useState<any | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Static data for sections not provided by API
  const staticData = {
    rating: 4.9,
    openHours: "",
    phone: "123-456-7890",
    description: "Welcome to our healthcare facility—your premier healthcare destination. We deliver exceptional patient-centered care with innovative technology and a compassionate approach.",
    insurance: ["Apple Health", "Medicare", "Blue Cross", "Aetna"],
    gallery: [
      { imageUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop", caption: "Modern Reception Area" },
      { imageUrl: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&h=300&fit=crop", caption: "State-of-the-Art Examination Room" },
      { imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop", caption: "Comfortable Waiting Lounge" }
    ],
    availableSlots: {
      "2025-05-02": ["09:00", "11:30", "14:00", "16:30"],
      "2025-05-03": ["08:30", "10:00", "13:30", "15:00"]
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch clinic data
        const clinicData = await getAClinicService(clinicId);
        setClinic(clinicData?.data?.data?.clinic);
        setClinicRating(clinicData?.data?.data?.stats)

        // Fetch doctors for this clinic with query parameters
        const doctorsResponse = await getClinicDoctors(clinicId);
        setDoctors(doctorsResponse?.data?.data);

        // Fetch services for this clinic with query parameters
        const servicesResponse = await getClinicServiceData(clinicId);
        const clinicServices = servicesResponse?.data?.map((service: ApiService) => ({
          id: service?.uuid,
          name: service?.clinic_provided_name,
          description: service?.description,
          category: service?.service_name
        }));
        setServices(clinicServices);

        // const clinicStatics = await getClinicIndStaticData()
        const clinicTimingData = await getClinicTimingServiceData(clinicId)
        setClinicTime(clinicTimingData?.data)

        console.log(clinicData.data.data, "clinicData");
        console.log(clinicTimingData, "Clinic timing");
        console.log(doctorsResponse?.data, "Doctor data");
        console.log(servicesResponse, "Service daa");

      } catch (err) {
        console.error("Failed to fetch clinic data", err);
        setError("Failed to load clinic details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clinicId]);

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Clinic not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Admin Banner */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center py-4 shadow-lg rounded-t-xl overflow-hidden">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-5 h-5" />
          <span className="font-semibold text-lg">Admin View • Read-Only Mode</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="h-[50vh] lg:h-[60vh] relative ">
          <img
            src={clinic?.images?.[0] || '/clinic.png'}
            alt={clinic.name}
            className="w-full h-full object-cover "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        </div>

        {/* Floating Hero Card */}
        <div className="absolute -bottom-12 left-4 right-4 max-w-6xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="text-xl font-bold text-gray-900">{clinicRating?.avg_rating || 0}</span>
                    <span className="text-gray-600">Excellence Rating</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{doctors?.length} Doctors</span>
                  </div>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
                  {clinic.name}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{clinic.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="font-medium">{clinicTime[0]?.opening_time || 'Not Available'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <div className="bg-blue-100 p-4 rounded-2xl">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-16 px-4 lg:px-8 max-w-6xl mx-auto">

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Operating Hours</h3>
                <p className="text-gray-600">{clinicTime[0]?.opening_time || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Expert Doctors</h3>
                <p className="text-gray-600">{doctors?.length} Specialists</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Services</h3>
                <p className="text-gray-600">{services.length} Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">About Our Clinic</h2>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-lg">
            <p className="text-gray-700 leading-relaxed text-lg">
              {clinic.about_clinic || staticData.description}
            </p>
            <div className="mt-4">
              <h3 className="font-bold text-gray-900 mb-2">Address:</h3>
              <p className="text-gray-600">{clinic.address}</p>
              <p className="text-gray-600">{clinic.city}, PIN: {clinic.pincode}</p>
              <a
                href={clinic.map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View on Map
              </a>
            </div>
          </div>
        </section>

        {/* Specialties */}
        {services.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Our Services</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
                  {service.category && (
                    <div className="mt-3">
                      <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                        {service.category}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Doctors Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Meet Our Doctors</h2>
          </div>

          {doctors?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {doctors.map((doctor: any) => (
                <div key={doctor?.uuid} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <img
                        src={doctor?.profile_pic || '/clinic.png'}
                        alt={doctor?.name}
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-xl mb-1">{doctor?.name}</h3>
                      <p className="text-gray-600 mb-1 text-xs">{doctor?.email}, {doctor?.gender}</p>
                      <p className="text-blue-600 font-semibold mb-2">{doctor?.specializaton} , {doctor?.education}</p>
                      <p className="text-gray-500 mb-2">{doctor?.experience}+ years of experience</p>
                      <p className="text-gray-600 mb-1 capitalize line-clamp-2 text-sm text-justify">{doctor?.extra_info}</p>
                      {/* <div className="bg-green-50 px-3 py-2 rounded-xl inline-block">
                        <span className="text-green-700 font-medium text-sm">
                          Available: {doctor?.availability}
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Doctors Available</h3>
              <p className="text-gray-500">There are currently no doctors associated with this clinic.</p>
            </div>
          )}
        </section>


        {/* Gallery Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Facility Gallery</h2>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-lg">
            <div className="mb-8">
              {clinic?.images?.length !== 0 &&
                <img
                  src={clinic?.images?.[selectedGalleryIndex]}
                  alt={clinic?.images?.[selectedGalleryIndex]}
                  className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-lg"
                />
              }
            </div>
            <div className="grid grid-cols-3 gap-3">
              {clinic?.images?.length !== 0 && clinic?.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedGalleryIndex(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all duration-200 ${selectedGalleryIndex === index
                    ? 'border-blue-500 scale-95 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                    }`}
                >
                  <img
                    src={image}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Contact & Location</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">Visit Us</h3>
                  <p className="text-gray-600">{clinic?.address}</p>
                  <p className="text-gray-600">{clinic?.city}, {clinic?.pincode}</p>
                  <a
                    href={clinic?.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    View on Map
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl">Contact Us</h3>
                  <p className="text-gray-600">{clinic?.contact_number}</p>
                  <p className="text-gray-600 mt-2">Email: {clinic?.created_by}</p>
                  <p className="text-gray-600 mt-1">Status: <span className="font-medium capitalize">{clinic?.status?.toLowerCase()}</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}