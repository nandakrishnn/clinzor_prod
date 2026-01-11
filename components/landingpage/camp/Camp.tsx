import Image from "next/image";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";

import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupsIcon from "@mui/icons-material/Groups";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CampaignIcon from "@mui/icons-material/Campaign";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { createCampRegistration } from "@/service/user/sevicePage";

// Types for form data
interface CampRegistrationData {
  org_name: string;
  hear_about_us: string;
  association_type: string;
  expected_participants: number;
  preferred_date: string;
  contact_person: string;
  email: string;
  additional_info?: string;
}

const headingVariants = {
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

// Dummy images for the carousel
const carouselImages = [
  "/banner1.jpg",
  "/clinic.png",
];

// Side image for the modal
const modalSideImage = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80";

const Camp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [formData, setFormData] = useState<CampRegistrationData>({
    org_name: "",
    hear_about_us: "",
    association_type: "",
    expected_participants: 0,
    preferred_date: "",
    contact_person: "",
    email: "",
    additional_info: ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CampRegistrationData, string>>>({});

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CampRegistrationData, string>> = {};

    if (!formData.org_name.trim()) newErrors.org_name = "Organization name is required";
    if (!formData.hear_about_us) newErrors.hear_about_us = "This field is required";
    if (!formData.association_type) newErrors.association_type = "Association type is required";
    if (!formData.expected_participants || formData.expected_participants < 1)
      newErrors.expected_participants = "Must be at least 1";
    if (!formData.preferred_date) newErrors.preferred_date = "Preferred date is required";
    if (!formData.contact_person.trim()) newErrors.contact_person = "Contact person is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expected_participants' ? parseInt(value) || 0 : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof CampRegistrationData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof CampRegistrationData];
        return newErrors;
      });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setSubmitStatus(null);
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      org_name: "",
      hear_about_us: "",
      association_type: "",
      expected_participants: 0,
      preferred_date: "",
      contact_person: "",
      email: "",
      additional_info: ""
    });
    setSubmitStatus(null);
    setErrors({});
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await createCampRegistration(formData);


      console.log(response)
      if (response.status === 200) {
        console.log('Registration successful:', response);
        setSubmitStatus('success');
        // Auto-close modal after 3 seconds on success
        setTimeout(() => {
          closeModal();
        }, 3000);
      } else {
        console.error('Registration failed:', response.statusText);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="overflow-hidden">
        <div className="@container mx-auto max-w-7xl px-3 md:px-6 flex flex-col md:flex-row gap-5 md:gap-14">
          <div className="md:h-[400px] rounded-2xl overflow-hidden w-full md:w-[40%]  relative shadow-lg ">
            <Slider {...settings}>
              {carouselImages.map((image, index) => (
                <div key={index} className="h-[235px] md:h-[400px] relative">
                  <img
                    src={image}
                    alt={`Camp image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </Slider>
          </div>

          <motion.div
            className="text-start w-full md:w-[60%] flex flex-col items-center justify-center "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={headingVariants}
          >
            <div className="text-start flex flex-col items-start justify-center ">
              <h3 className="font-semibold text-[18px] italic ">
                {"Clinzor Physiotherapy Health Camps"}
              </h3>
              <h2 className="w-full text-2xl md:text-3xl text-start font-bold text-[#424141] leading-7">
                {"Expert-Led Physiotherapy & Wellness Camps for Corporates, Societies & Communities"}
              </h2>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Clinzor Health Camps deliver professionally managed physiotherapy health camps designed to identify pain issues early, improve posture, and promote long-term musculoskeletal wellness. Our camps are ideal for corporates, residential societies, institutions, and community groups looking for preventive and rehabilitative physiotherapy care.
              </p>
              <ul className="space-y-5 my-3 md:my-0 pt-5 md:pt-6">
                <li className="flex gap-3 items-start">
                  <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
                    <HealthAndSafetyIcon className="45" />
                  </span>
                  <div>
                    <strong>1. Comprehensive Physiotherapy Wellness Screening</strong>
                    <p className="text-gray-500 text-sm">
                      Our physiotherapy health camps include in-depth posture assessment, flexibility testing, movement analysis, and vital signs monitoring. These screenings help detect common issues such as back pain, neck pain, joint stiffness, and posture-related disorders at an early stage.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
                    <HealthAndSafetyIcon className="45" />
                  </span>
                  <div>
                    <strong>2. Specialized Physiotherapy Consultations</strong>
                    <p className="text-gray-500 text-sm">
                      Participants receive one-on-one consultations with certified physiotherapists, offering personalized recovery plans, posture correction guidance, pain management strategies, and injury prevention advice tailored to individual needs.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
                    <HealthAndSafetyIcon className="45" />
                  </span>
                  <div>
                    <strong>3. Follow-up Care & Digital Physiotherapy Support</strong>
                    <p className="text-gray-500 text-sm">
                      Clinzor ensures continuity of care beyond the camp. Participants can seamlessly book online physiotherapy consultations, access telehealth support, or schedule appointments with nearby Clinzor partner clinics for ongoing treatment and rehabilitation.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-8">
                <h4 className="font-bold text-lg text-[#424141]">Why Choose Clinzor Health Camps?</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc ml-5">
                  <li>Certified & experienced physiotherapists</li>
                  <li>Ideal for corporate wellness programs and community initiatives</li>
                  <li>Focus on preventive physiotherapy & long-term recovery</li>
                  <li>Easy transition from camp to clinic or online care</li>
                </ul>
              </div>

              <div className="mt-8">
                <h4 className="font-bold text-lg text-[#424141]">Book a Physiotherapy Health Camp with Clinzor</h4>
                <p className="text-gray-600 text-sm mt-2">
                  Empower your workplace or community with expert-led physiotherapy health camps focused on pain relief, posture correction, and preventive healthcare.
                </p>
              </div>

              <div className="w-full flex justify-start">
                <button
                  onClick={openModal}
                  className="w-fit bg-primaryColor text-white px-24 py-2 text-sm rounded-full mt-8 hover:bg-primaryColor transition-colors shadow-md hover:shadow-lg"
                >
                  Register Now
                </button>
              </div>
            </div>


          </motion.div>
        </div>
      </section>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
            {/* Left side with image */}
            <div className="hidden md:block md:w-2/5 relative">
              <Image
                src={modalSideImage}
                alt="Camp registration"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primaryColor/70 flex items-center justify-center p-6">
                <div className="text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">Organize a Health Camp</h3>
                  <p className="text-lg">Bring healthcare expertise to your organization with our specialized health camps.</p>
                  <div className="mt-6 flex justify-center">
                    <div className="bg-white/20 p-3 rounded-full">
                      <HealthAndSafetyIcon className="text-4xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side with form */}
            <div className="w-full md:w-3/5">
              <div className="flex justify-between items-center px-5 pt-5  text-black">
                <h3 className="text-xl font-bold">Camp Registration</h3>
                <button
                  onClick={closeModal}
                  className="text-black hover:text-gray-200 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={onSubmit} className="p-5 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Organization Name *
                    </label>
                    <div className="relative flex ">
                      <BusinessIcon className="absolute left-3 top-3 text-gray-400 text-lg" />
                      <input
                        type="text"
                        name="org_name"
                        value={formData.org_name}
                        onChange={handleInputChange}
                        className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                        placeholder="Enter organization name"
                      />
                    </div>
                    {errors.org_name && (
                      <p className="text-red-500 text-xs mt-1">{errors.org_name}</p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      How did you hear about us? *
                    </label>
                    <div className="relative">
                      <CampaignIcon className="absolute left-3 top-3 text-gray-400 text-lg" />
                      <select
                        name="hear_about_us"
                        value={formData.hear_about_us}
                        onChange={handleInputChange}
                        className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-primaryColor focus:border-transparent appearance-none"
                      >
                        <option value="">Select an option</option>
                        <option value="through a friend">Through a friend</option>
                        <option value="social media">Social Media</option>
                        <option value="search engine">Search Engine</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-3 top-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                    {errors.hear_about_us && (
                      <p className="text-red-500 text-xs mt-1">{errors.hear_about_us}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Association Type *
                      </label>
                      <div className="relative">
                        <GroupsIcon className="absolute left-3 top-3 text-gray-400 text-lg" />
                        <select
                          name="association_type"
                          value={formData.association_type}
                          onChange={handleInputChange}
                          className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-primaryColor focus:border-transparent appearance-none"
                        >
                          <option value="">Select type</option>
                          <option value="Coaching Institute">Coaching Institute</option>
                          <option value="School">School</option>
                          <option value="College">College</option>
                          <option value="Corporate">Corporate</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                      {errors.association_type && (
                        <p className="text-red-500 text-xs mt-1">{errors.association_type}</p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Expected Participants *
                      </label>
                      <div className="relative">
                        <GroupsIcon className="absolute left-3 top-3 text-gray-400 text-lg" />
                        <input
                          type="number"
                          name="expected_participants"
                          min="1"
                          value={formData.expected_participants || ''}
                          onChange={handleInputChange}
                          className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                          placeholder="Number of participants"
                        />
                      </div>
                      {errors.expected_participants && (
                        <p className="text-red-500 text-xs mt-1">{errors.expected_participants}</p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <CalendarTodayIcon className="absolute left-3 top-3 text-gray-400 text-lg" />
                      <input
                        type="date"
                        name="preferred_date"
                        value={formData.preferred_date}
                        onChange={handleInputChange}
                        className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                      />
                    </div>
                    {errors.preferred_date && (
                      <p className="text-red-500 text-xs mt-1">{errors.preferred_date}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Contact Person *
                      </label>
                      <div className="relative">
                        <PersonIcon className="absolute left-3 top-3 text-gray-400 text-lg" />
                        <input
                          type="text"
                          name="contact_person"
                          value={formData.contact_person}
                          onChange={handleInputChange}
                          className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                          placeholder="Full name"
                        />
                      </div>
                      {errors.contact_person && (
                        <p className="text-red-500 text-xs mt-1">{errors.contact_person}</p>
                      )}
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Email *
                      </label>
                      <div className="relative">
                        <EmailIcon className="absolute left-3 top-3 text-gray-400 text-lg" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                          placeholder="email@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Additional Information
                    </label>
                    <textarea
                      name="additional_info"
                      value={formData.additional_info}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primaryColor focus:border-transparent"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>
                </div>

                {submitStatus === 'success' && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Registration successful! We'll be in touch soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    There was an error submitting your registration. Please try again.
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primaryColor text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Registration'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Camp;