"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Loader2, ImagePlus } from "lucide-react";

export default function AddNewServiceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    duration_minutes: string;
    category: string;
    is_active: boolean;
    image_url: string;
    tags: string[];
    available_days: string[];
    requires_prior_approval: boolean;
  }>({
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
    category: "",
    is_active: true,
    image_url: "",
    tags: [],
    available_days: [],
    requires_prior_approval: false,
  });
  type FormErrors = {
    name?: string;
    description?: string;
    price?: string;
    duration_minutes?: string;
    category?: string;
    [key: string]: string | undefined;
  };
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentTag, setCurrentTag] = useState("");
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);

  const categories = [
    "General Health",
    "Dermatology",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Dental Care",
    "Mental Health",
    "Skin Care",
    "Physical Therapy",
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
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      // In a real app, you would handle the file upload here
      setFormData({
        ...formData,
        image_url: `/images/services/${file.name}`, // Placeholder path
      });
    }
  };

  const addTag = () => {
    if (currentTag.trim() !== "" && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Service name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (formData.price && isNaN(Number(formData.price))) newErrors.price = "Price must be a number";
    if (!formData.duration_minutes) newErrors.duration_minutes = "Duration is required";
    if (formData.duration_minutes && isNaN(Number(formData.duration_minutes))) newErrors.duration_minutes = "Duration must be a number";
    if (!formData.category) newErrors.category = "Category is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Form submitted successfully:", formData);
      // In a real app, you would handle the API response here
      
      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        duration_minutes: "",
        category: "",
        is_active: true,
        image_url: "",
        tags: [],
        available_days: [],
        requires_prior_approval: false,
      });
      setPreviewImage(null);
      
      // Show success message or redirect
      alert("Service added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add New Service</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Service Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="e.g. Dermatology Consultation"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  placeholder="Describe the service..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
              </div>
              
              {/* Price and Duration Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.price ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="e.g. 1000"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="text"
                    id="duration_minutes"
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.duration_minutes ? "border-red-300" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    placeholder="e.g. 30"
                  />
                  {errors.duration_minutes && (
                    <p className="mt-1 text-sm text-red-500">{errors.duration_minutes}</p>
                  )}
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.category ? "border-red-300" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-32 h-32 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all bg-gray-50">
                      {previewImage ? (
                        typeof previewImage === "string" ? (
                          <img
                            src={previewImage}
                            alt="Service preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : null
                      ) : (
                        <ImagePlus className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {previewImage ? "Click to change image" : "Click to upload image"}
                    <p>PNG, JPG or SVG (max. 2MB)</p>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex items-center p-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 p-1 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>
              
              {/* Available Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Days
                </label>
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
              
              {/* Toggle Switches */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Active Service</span>
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
                  <span className="text-sm font-medium text-gray-700">Requires Prior Approval</span>
                  <div
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.requires_prior_approval ? "bg-blue-500" : "bg-gray-200"
                    }`}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        requires_prior_approval: !formData.requires_prior_approval,
                      })
                    }
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                        formData.requires_prior_approval ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Saving...
                    </span>
                  ) : (
                    "Save New Service"
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}