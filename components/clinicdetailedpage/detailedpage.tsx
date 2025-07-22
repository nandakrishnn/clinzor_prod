'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IconStar,
  IconMapPin,
  IconClock,
  IconPhone,
  IconChevronLeft,
  IconCalendarEvent,
  IconUser,
  IconStethoscope,
  IconShield,
  IconSearch,
  IconAward,
  IconCheck,
  IconChevronRight,
  IconChevronDown
} from '@tabler/icons-react';
import FooterSection from '../landingpage/footer/footer';
import { ChevronDown } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  education: string;
  experience: string;
  availability: string;
  availableSlots?: {
    [date: string]: string[];
  };
}

interface Clinic {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  location: string;
  openHours: string;
  phone: string;
  address: string;
  description: string;
  specialty: string[];
  services: string[];
  insurance: string[];
  doctors: Doctor[];
  gallery: {
    imageUrl: string;
    caption: string;
  }[];
}

interface Props {
  clinicId: string;
}

export default function ClinicDetailClient({ clinicId }: Props) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  
  // Improved carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // — DUMMY DATA —
  const clinic: Clinic = {
    id: clinicId,
    name: 'Sunrise Health Clinic',
    imageUrl: '/image.jpg',
    rating: 4.9,
    location: '123 Main St, Springfield',
    openHours: '8:00 AM – 6:00 PM',
    phone: '123-456-7890',
    address: '123 Main St, Springfield, USA',
    description:
      'Welcome to Sunrise Health Clinic—your premier healthcare destination. We deliver exceptional patient-centered care with innovative technology and a compassionate approach. Our state-of-the-art facility provides comprehensive medical services for patients of all ages, ensuring your health needs are met with precision and care.',
    specialty: ['Primary Care', 'Family Medicine', 'Dermatology', 'Cardiology'],
    services: ['Consultation', 'Health Screenings', 'Preventive Care', 'Diagnostic Services', 'Specialized Treatment', 'Telemedicine'],
    insurance: ['Apple Health', 'Medicare', 'Blue Cross', 'Aetna', 'UnitedHealth', 'Cigna'],
    gallery: [
      { imageUrl: '/image.jpg', caption: 'Modern Reception Area' },
      { imageUrl: '/image.jpg', caption: 'State-of-the-Art Examination Room' },
      { imageUrl: '/image.jpg', caption: 'Comfortable Waiting Lounge' },
      { imageUrl: '/image.jpg', caption: 'Advanced Medical Equipment' },
      { imageUrl: '/image.jpg', caption: 'Child-Friendly Play Area' },
      { imageUrl: '/image.jpg', caption: 'Consultation Room' }
    ],
    doctors: [
      {
        id: 'd1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Family Medicine',
        imageUrl: '/image.jpg',
        education: 'Harvard Medical School',
        experience: '12 years',
        availability: 'Mon, Wed, Fri',
        availableSlots: {
          '2025-05-03': ['09:00', '10:30', '11:30', '14:00', '15:30'],
          '2025-05-05': ['09:30', '11:00', '13:30', '16:00'],
          '2025-05-07': ['08:30', '10:00', '14:30', '16:30'],
          '2025-05-10': ['09:00', '10:30', '11:30', '14:00']
        }
      },
      {
        id: 'd2',
        name: 'Dr. Michael Chen',
        specialty: 'Cardiology',
        imageUrl: '/image.jpg',
        education: 'Stanford University',
        experience: '15 years',
        availability: 'Tue, Thu',
        availableSlots: {
          '2025-05-02': ['08:00', '09:30', '11:00', '13:30', '15:00'],
          '2025-05-04': ['10:00', '12:30', '14:00', '16:30'],
          '2025-05-06': ['08:30', '10:00', '13:00', '15:30'],
          '2025-05-09': ['09:00', '11:30', '14:30', '16:00']
        }
      },
      {
        id: 'd3',
        name: 'Dr. Emily Williams',
        specialty: 'Dermatology',
        imageUrl: '/image.jpg',
        education: 'Johns Hopkins University',
        experience: '8 years',
        availability: 'Mon-Fri',
        availableSlots: {
          '2025-05-02': ['09:00', '11:30', '14:00', '16:30'],
          '2025-05-03': ['08:30', '10:00', '13:30', '15:00'],
          '2025-05-04': ['09:30', '11:00', '14:30', '16:00'],
          '2025-05-05': ['08:00', '10:30', '13:00', '15:30']
        }
      },
      {
        id: 'd4',
        name: 'Dr. James Rodriguez',
        specialty: 'Primary Care',
        imageUrl: '/image.jpg',
        education: 'Yale School of Medicine',
        experience: '10 years',
        availability: 'Wed-Sat',
        availableSlots: {
          '2025-05-03': ['08:00', '09:30', '11:00', '14:30'],
          '2025-05-05': ['09:00', '10:30', '13:00', '15:30'],
          '2025-05-07': ['08:30', '11:00', '14:00', '16:30'],
          '2025-05-08': ['09:30', '11:30', '13:30', '15:00']
        }
      }
    ]
  };

  // Update available time slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const doctor = clinic.doctors.find(doc => doc.id === selectedDoctor);
      if (doctor && doctor.availableSlots && doctor.availableSlots[selectedDate]) {
        setAvailableTimeSlots(doctor.availableSlots[selectedDate]);
      } else {
        setAvailableTimeSlots([]);
      }
      // Reset selected time when doctor or date changes
      setSelectedTime('');
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  // Improved carousel auto-play functionality with pause on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === clinic.gallery.length - 1 ? 0 : prev + 1));
      }, 5000); // Change slide every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, clinic.gallery.length]);

  // Enhanced carousel navigation functions
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === clinic.gallery.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false); // Pause autoplay when user navigates manually
  }, [clinic.gallery.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? clinic.gallery.length - 1 : prev - 1));
    setIsAutoPlaying(false); // Pause autoplay when user navigates manually
  }, [clinic.gallery.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Pause autoplay when user navigates manually
  }, []);

  // Add touch controls for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      // Swipe left (next)
      nextSlide();
    }
    
    if (touchStart - touchEnd < -150) {
      // Swipe right (prev)
      prevSlide();
    }
  };
  
  // Resume autoplay after 10 seconds of inactivity
  useEffect(() => {
    if (!isAutoPlaying) {
      const timeout = setTimeout(() => {
        setIsAutoPlaying(true);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [isAutoPlaying, currentSlide]);

  // Get available dates for selected doctor
  const getAvailableDates = () => {
    if (!selectedDoctor) return [];
    
    const doctor = clinic.doctors.find(doc => doc.id === selectedDoctor);
    if (doctor && doctor.availableSlots) {
      return Object.keys(doctor.availableSlots);
    }
    return [];
  };

  // Format time slot for display (24h to 12h format)
  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Handle booking submission
  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    alert(`Appointment booked successfully!\n\nDoctor: ${clinic.doctors.find(doc => doc.id === selectedDoctor)?.name}\nDate: ${selectedDate}\nTime: ${formatTimeSlot(selectedTime)}\nName: ${fullName}\nPhone: ${phoneNumber}`);
  };

  // Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* — Enhanced Hero Section with Carousel — */}
      <header className="relative h-[70vh] w-full overflow-hidden">
        {/* Improved Carousel container with touch controls */}
        <div 
          className="absolute inset-0 flex h-full w-full transition-all duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {clinic.gallery.map((image, index) => (
            <div 
              key={index} 
              className="relative h-full min-w-full" 
            >
              <Image
                src={image.imageUrl}
                alt={image.caption}
                fill
                className="object-cover"
                unoptimized
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Caption for each slide */}
              <div className="absolute bottom-8 left-8 max-w-xs text-white bg-black/30 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <h3 className="text-xl font-medium mb-1">{image.caption}</h3>
                <p className="text-sm text-white/80">{`${index + 1}/${clinic.gallery.length}`}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Improved Carousel Navigation */}
        <div className="absolute bottom-24 right-8 flex items-center gap-2 z-10">
          <button 
            onClick={prevSlide}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition"
            aria-label="Previous image"
          >
            <IconChevronLeft size={20} />
          </button>
          
          {clinic.gallery.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
          
          <button 
            onClick={nextSlide}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition"
            aria-label="Next image"
          >
            <IconChevronRight size={20} />
          </button>
        </div>
        
        {/* Updated Navigation with Logo */}
        <nav className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <Link
              href="/clinic"
              className="flex items-center gap-2 text-white hover:opacity-80 transition"
            >
              <IconChevronLeft size={24} />
              <span className="text-sm font-medium">Back</span>
            </Link>
            
            {/* Added Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-40">
                <Image 
                  src="/assets/logo/logo.png" 
                  alt="Sunrise Health Clinic Logo" 
                  fill 
                  className="object-contain"
                  unoptimized
                />
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition">
              <IconSearch size={20} />
            </button>
            <button className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-opacity-90 transition flex items-center gap-2">
              <IconCalendarEvent size={18} />
              Quick Book
            </button>
          </div>
        </nav>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-16 left-8 max-w-2xl text-white"
        >
          <div className="flex items-center gap-2 mb-3">
            <IconAward size={20} className="text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Top Rated Clinic</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight">{clinic.name}</h1>
          <div className="flex items-center gap-6 mt-4 text-lg font-light">
            <span className="inline-flex items-center gap-1">
              <IconStar size={20} className="text-yellow-400" stroke={1.5} />
              {clinic.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1">
              <IconClock size={20} />
              {clinic.openHours}
            </span>
            <span className="inline-flex items-center gap-1">
              <IconMapPin size={20} />
              {clinic.location}
            </span>
          </div>
        </motion.div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-16 space-y-16">
        {/* — Booking Section — */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <IconCalendarEvent size={28} className="text-black" />
            <h2 className="text-3xl font-semibold">Book an Appointment</h2>
          </div>
          <form onSubmit={handleBookAppointment} className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Doctor Selection (Custom Dropdown) */}
    <div className="space-y-2 relative">
      <label className="text-sm font-medium text-gray-500">Select Doctor</label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
          className="w-full p-4 bg-white border-none rounded-2xl shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {selectedDoctor ? (
            <div className="flex items-center gap-3 text-left">
              <img
                src={
                  clinic.doctors.find((doc) => doc.id === selectedDoctor)?.imageUrl ||
                  "/fallback.jpg"
                }
                alt="Doctor"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {clinic.doctors.find((doc) => doc.id === selectedDoctor)?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {clinic.doctors.find((doc) => doc.id === selectedDoctor)?.specialty}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-sm text-gray-500">Choose a specialist</span>
          )}
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>

        {/* Dropdown */}
        {showDoctorDropdown && (
          <div className="absolute z-50 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-lg max-h-64 overflow-auto">
            {clinic.doctors.map((doctor) => (
              <button
                type="button"
                key={doctor.id}
                onClick={() => {
                  setSelectedDoctor(doctor.id);
                  setShowDoctorDropdown(false);
                }}
                className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-gray-100 transition"
              >
                <img
                  src={doctor.imageUrl || "/fallback.jpg"}
                  alt={doctor.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-sm text-gray-800">
                  <p className="font-medium">{doctor.name}</p>
                  <p className="text-xs text-gray-500">{doctor.specialty}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Date Selection */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-500">Select Date</label>
      <select
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-full p-4 bg-white border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200 appearance-none"
        disabled={!selectedDoctor}
        required
      >
        <option value="">Choose available date</option>
        {getAvailableDates().map((date) => {
          const displayDate = new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          return (
            <option key={date} value={date}>
              {displayDate}
            </option>
          );
        })}
      </select>
    </div>
  </div>

  {/* Time Slots Grid */}
  {selectedDate && selectedDoctor && (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-500">
        Select Available Time
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {availableTimeSlots.length > 0 ? (
          availableTimeSlots.map((time) => (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              key={time}
              type="button"
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-xl flex justify-center items-center transition-all ${
                selectedTime === time
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-black border border-gray-100 hover:border-gray-300"
              }`}
            >
              {formatTimeSlot(time)}
              {selectedTime === time && (
                <IconCheck size={16} className="ml-2" />
              )}
            </motion.button>
          ))
        ) : (
          <p className="col-span-4 text-gray-500 text-center py-3">
            No available time slots for this date
          </p>
        )}
      </div>
    </div>
  )}

  {/* Patient Info */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-500">Full Name</label>
      <div className="relative">
        <IconUser
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-4 pl-12 bg-white border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200"
          required
        />
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-500">Phone Number</label>
      <div className="relative">
        <IconPhone
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-4 pl-12 bg-white border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-200"
          required
        />
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={
      !selectedDoctor || !selectedDate || !selectedTime || !fullName || !phoneNumber
    }
    className={`w-full py-4 rounded-2xl font-medium flex justify-center items-center gap-2 transition-all ${
      selectedDoctor && selectedDate && selectedTime && fullName && phoneNumber
        ? "bg-black text-white hover:opacity-90"
        : "bg-gray-200 text-gray-500 cursor-not-allowed"
    }`}
  >
    <IconCalendarEvent size={20} />
    Book Appointment Now
  </button>

  {/* Confirmation */}
  <p className="text-center text-sm text-gray-500 mt-2 font-light">
    {selectedDoctor && selectedDate && selectedTime
      ? `You're booking with ${
          clinic.doctors.find((doc) => doc.id === selectedDoctor)?.name
        } on ${new Date(selectedDate).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })} at ${formatTimeSlot(selectedTime)}`
      : "Select a doctor, date and time to book your appointment"}
  </p>
</form>



        </motion.section>

        {/* — Quick Contact Info — */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div 
            variants={fadeIn}
            className="bg-gray-50 rounded-3xl p-6 flex items-center gap-4"
          >
            <div className="p-3 bg-white rounded-2xl">
              <IconMapPin size={24} className="text-black" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Visit Us</p>
              <p className="text-black">{clinic.address}</p>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="bg-gray-50 rounded-3xl p-6 flex items-center gap-4"
          >
            <div className="p-3 bg-white rounded-2xl">
              <IconPhone size={24} className="text-black" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Call Us</p>
              <a href={`tel:${clinic.phone}`} className="text-black font-medium hover:underline">
                {clinic.phone}
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            className="bg-gray-50 rounded-3xl p-6 flex items-center gap-4"
          >
            <div className="p-3 bg-white rounded-2xl">
              <IconClock size={24} className="text-black" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Opening Hours</p>
              <p className="text-black">{clinic.openHours}</p>
            </div>
          </motion.div>
        </motion.section>

        {/* — Specialties — */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          {clinic.specialty.map((spec) => (
            <motion.span
              key={spec}
              variants={fadeIn}
              className="px-4 py-2 bg-gray-50 rounded-full text-sm font-medium text-black"
            >
              {spec}
            </motion.span>
          ))}
        </motion.section>

        {/* — About Section — */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-semibold mb-6">About</h2>
          <p className="text-black text-lg leading-relaxed font-light">{clinic.description}</p>
        </motion.section>

        {/* — Doctors Section — */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
        >
          <h2 className="text-3xl font-semibold mb-8">Our Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clinic.doctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                variants={fadeIn}
                className="bg-gray-50 rounded-3xl p-6 flex gap-6 hover:shadow-md transition duration-300"
              >
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden">
                  <Image
                    src={doctor.imageUrl}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{doctor.name}</h3>
                  <p className="text-gray-500 mb-3">{doctor.specialty}</p>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Education:</span> {doctor.education}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Experience:</span> {doctor.experience}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Available:</span> {doctor.availability}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedDoctor(doctor.id);
                      // Scroll to booking section
                      document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="mt-3 px-4 py-2 bg-black text-white rounded-xl text-sm hover:bg-opacity-90 transition"
                  >
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
        {/* — Insurance Section — */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-semibold mb-6 flex items-center gap-3">
            <IconShield size={28} className="text-black" />
            Insurance Accepted
          </h2>
          <div className="flex flex-wrap gap-3">
            {clinic.insurance.map((ins) => (
              <motion.span
                key={ins}
                whileHover={{ scale: 1.02 }}
                className="px-5 py-3 bg-gray-50 rounded-full text-black hover:shadow-sm transition duration-300"
              >
                {ins}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* — Location Map — */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-semibold mb-6">Location</h2>
          <div className="w-full h-80 rounded-3xl overflow-hidden shadow-sm">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                clinic.address
              )}&output=embed`}
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              className="border-none"
            />
          </div>
        </motion.section>
      </main>
      
      <FooterSection/>
    </div>
  );
}