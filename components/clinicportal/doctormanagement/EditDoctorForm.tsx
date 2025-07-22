"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Plus, Loader2, ImagePlus, Calendar, Star, Save, ArrowLeft } from "lucide-react";

export default function EditDoctorForm({ doctorId, onBack }: { doctorId: string, onBack: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [formData, setFormData] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    specialization: string;
    qualification: string;
    experience_years: string;
    bio: string;
    consultation_fee: string;
    is_active: boolean;
    is_accepting_new_patients: boolean;
    profile_image: string;
    languages: string[];
    available_days: string[];
    rating: number;
  }>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience_years: "",
    bio: "",
    consultation_fee: "",
    is_active: true,
    is_accepting_new_patients: true,
    profile_image: "",
    languages: [],
    available_days: [],
    rating: 0,
  });

  type FormErrors = {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    specialization?: string;
    qualification?: string;
    experience_years?: string;
    bio?: string;
    consultation_fee?: string;
    [key: string]: string | undefined;
  };

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentLanguage, setCurrentLanguage] = useState("");
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);

  // Mock fetch doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      setIsFetching(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock doctor data
        const doctorData = {
          first_name: "Sarah",
          last_name: "Johnson",
          email: "sarah.johnson@example.com",
          phone: "1234567890",
          specialization: "Cardiologist",
          qualification: "MD",
          experience_years: "15",
          bio: "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and heart failure management.",
          consultation_fee: "150",
          is_active: true,
          is_accepting_new_patients: true,
          profile_image: "/images/doctors/doctor-sarah.jpg",
          languages: ["English", "Spanish", "French"],
          available_days: ["Monday", "Wednesday", "Friday"],
          rating: 4,
        };
        
        setFormData(doctorData);
        setInitialData(JSON.parse(JSON.stringify(doctorData))); // Deep copy for comparison
        
        // Set preview image if available
        if (doctorData.profile_image) {
          setPreviewImage(doctorData.profile_image);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchDoctorData();
  }, [doctorId]);

  // Check for changes to enable/disable save button
  useEffect(() => {
    if (initialData) {
      const isChanged = JSON.stringify(initialData) !== JSON.stringify(formData);
      setHasChanges(isChanged);
    }
  }, [formData, initialData]);

  const specializations = [
    "General Practitioner",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Gynecologist",
    "Orthopedic Surgeon",
    "Psychiatrist",
    "Ophthalmologist",
    "Dentist",
  ];

  const qualifications = [
    "MBBS",
    "MD",
    "MS",
    "DNB",
    "DM",
    "MCh",
    "PhD",
    "BDS",
    "MDS",
    "DO",
    "FRCS",
    "MRCP",
  ];

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setFormData({
      ...formData,
      [name]: fieldValue,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleDayToggle = (day: string) => {
    const updatedDays = [...formData.available_days];
    if (updatedDays.includes(day)) {
      const index = updatedDays.indexOf(day);
      updatedDays.splice(index, 1);
    } else {
      updatedDays.push(day);
    }
    setFormData({
      ...formData,
      available_days: updatedDays,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData({
        ...formData,
        profile_image: `/images/doctors/${file.name}`,
      });
    }
  };

  const addLanguage = () => {
    if (currentLanguage.trim() !== "" && !formData.languages.includes(currentLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, currentLanguage.trim()],
      });
      setCurrentLanguage("");
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((language) => language !== languageToRemove),
    });
  };

  const handleRatingChange = (rating: number) => {
    setFormData({
      ...formData,
      rating,
    });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    if (!formData.qualification) newErrors.qualification = "Qualification is required";
    if (!formData.experience_years) newErrors.experience_years = "Years of experience is required";
    else if (isNaN(Number(formData.experience_years))) newErrors.experience_years = "Must be a number";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    if (!formData.consultation_fee) newErrors.consultation_fee = "Consultation fee is required";
    else if (isNaN(Number(formData.consultation_fee))) newErrors.consultation_fee = "Must be a number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    if (initialData) {
      setFormData(JSON.parse(JSON.stringify(initialData)));
      setErrors({});
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Doctor updated successfully:", formData);
      
      // Update the initial data to reflect the changes
      setInitialData(JSON.parse(JSON.stringify(formData)));
      setHasChanges(false);
      
      alert("Doctor updated successfully!");
    } catch (error) {
      console.error("Error updating doctor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center w-full p-6 min-h-64">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading doctor information...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={onBack}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-semibold text-gray-800">Edit Doctor Profile</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-2">
                  <input
                    type="file"
                    id="profile_image"
                    name="profile_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-32 h-32 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all bg-gray-50 overflow-hidden">
                    {previewImage ? (
                      typeof previewImage === "string" ? (
                        <motion.img
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={previewImage}
                          alt="Doctor preview"
                          className="w-full h-full object-cover"
                        />
                      ) : null
                    ) : (
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500 text-center">
                  {previewImage ? "Click to change photo" : "Click to upload photo"}
                  <p>PNG, JPG (max. 2MB)</p>
                </div>
              </div>
              
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.first_name ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="e.g. John"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.last_name ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="e.g. Smith"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                  )}
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="e.g. doctor@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.phone ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="e.g. 1234567890"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>
              
              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization*
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.specialization ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white`}
                  >
                    <option value="">Select specialization</option>
                    {specializations.map((specialization) => (
                      <option key={specialization} value={specialization}>
                        {specialization}
                      </option>
                    ))}
                  </select>
                  {errors.specialization && (
                    <p className="mt-1 text-sm text-red-500">{errors.specialization}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification*
                  </label>
                  <select
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.qualification ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white`}
                  >
                    <option value="">Select qualification</option>
                    {qualifications.map((qualification) => (
                      <option key={qualification} value={qualification}>
                        {qualification}
                      </option>
                    ))}
                  </select>
                  {errors.qualification && (
                    <p className="mt-1 text-sm text-red-500">{errors.qualification}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience*
                  </label>
                  <input
                    type="text"
                    id="experience_years"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.experience_years ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="e.g. 10"
                  />
                  {errors.experience_years && (
                    <p className="mt-1 text-sm text-red-500">{errors.experience_years}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="consultation_fee" className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Fee ($)*
                  </label>
                  <input
                    type="text"
                    id="consultation_fee"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.consultation_fee ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="e.g. 100"
                  />
                  {errors.consultation_fee && (
                    <p className="mt-1 text-sm text-red-500">{errors.consultation_fee}</p>
                  )}
                </div>
              </div>
              
              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Bio*
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.bio ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Write a professional bio for the doctor..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
                )}
              </div>
              
              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages Spoken
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={currentLanguage}
                    onChange={(e) => setCurrentLanguage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Add language and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="inline-flex items-center p-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.languages.map((language) => (
                    <motion.span
                      key={language}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {language}
                      <button
                        type="button"
                        onClick={() => removeLanguage(language)}
                        className="ml-1 p-1 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>
              
              {/* Available Days with Calendar Icon */}
              <div>
                <div className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Available Days
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {weekdays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        formData.available_days.includes(day)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Rating */}
              <div>
                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 text-gray-500 mr-2" />
                  <label className="block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {formData.rating > 0 ? `${formData.rating} out of 5` : "Not rated"}
                  </span>
                </div>
              </div>
              
              {/* Toggle Switches */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Active Status</span>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.is_active ? "bg-blue-500" : "bg-gray-200"
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        is_active: !formData.is_active,
                      })
                    }
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        formData.is_active ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Accepting New Patients</span>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.is_accepting_new_patients ? "bg-blue-500" : "bg-gray-200"
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        is_accepting_new_patients: !formData.is_accepting_new_patients,
                      })
                    }
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        formData.is_accepting_new_patients ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  onClick={resetForm}
                  disabled={!hasChanges || isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Discard Changes
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={isLoading || !hasChanges}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Saving Changes...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </span>
                  )}
                </motion.button>
              </div>
              
              {/* Changes Indicator */}
              {hasChanges && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-2 text-sm text-blue-600"
                >
                  You have unsaved changes
                </motion.div>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}