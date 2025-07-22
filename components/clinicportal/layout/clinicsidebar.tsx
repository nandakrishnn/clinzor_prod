import { useState, useEffect } from 'react';
import {
  User,
  AlignLeft,
  Users,
  Clock,
  BookOpen,
  DollarSign,
  Home,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Settings,
  Tag
} from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}

// Framer motion variants
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const SidebarItem = ({ icon, label, href, collapsed, active = false, onClick }: SidebarItemProps) => (
  <motion.a 
    href={href}
    onClick={onClick}
    className={`flex items-center ${collapsed ? 'justify-center' : ''} w-full px-3 py-3 my-1 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
    whileTap={{ scale: 0.97 }}
    initial={false}
    animate={{ 
      backgroundColor: active ? 'rgb(239, 246, 255)' : 'transparent', 
      transition: { type: 'tween', duration: 0.15 }
    }}
  >
    <motion.div 
      className={`flex items-center justify-center ${collapsed ? 'w-8 h-8' : 'w-8 h-8 mr-3'} ${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'}`}
      animate={{ 
        color: active ? 'rgb(37, 99, 235)' : '', 
        transition: { type: 'tween', duration: 0.15 }
      }}
    >
      {icon}
    </motion.div>
    {!collapsed && (
      <span className={`text-sm font-medium transition-colors duration-200 ${active ? 'text-blue-600' : 'text-gray-700 group-hover:text-blue-600'}`}>
        {label}
      </span>
    )}
  </motion.a>
);

// User profile type
interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export default function ClinicSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('/clinicportal/dashboard');
  
  // Example user data - in a real app, this would come from your authentication system
  const [user] = useState<UserProfile>({
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@clinicportal.com',
    role: 'Clinic Administrator',
    avatar: '/api/placeholder/32/32' // This is a placeholder, replace with actual avatar URL in production
  });
  
  // Handle resize to switch between mobile and desktop views
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setCollapsed(false);
          setMobileOpen(false);
        }
      };
      
      window.addEventListener('resize', handleResize);
      handleResize();
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Set active item based on current path
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path) {
        setActiveItem(path);
      }
    }
  }, []);

  // Menu items configuration
  const menuItems = [
    { icon: <Home size={20} strokeWidth={1.5} />, label: 'Dashboard', href: '/clinicportal' },
    { icon: <User size={20} strokeWidth={1.5} />, label: 'Profile Settings', href: '/clinicportal/profile' },
    { icon: <Clock size={20} strokeWidth={1.5} />, label: 'Slot Management', href: '/clinicportal/slotmanagement' },
    { icon: <DollarSign size={20} strokeWidth={1.5} />, label: 'Dues to Clinzor', href: '/clinicportal/dues' },
    { icon: <BookOpen size={20} strokeWidth={1.5} />, label: 'Booking Management', href: '/clinicportal/bookings' },
    { icon: <AlignLeft size={20} strokeWidth={1.5} />, label: 'Service Management', href: '/clinicportal/servicemanagement' },
    { icon: <Users size={20} strokeWidth={1.5} />, label: 'Doctor Management', href: '/clinicportal/doctors' },
    { icon: <Tag size={20} strokeWidth={1.5} />, label: 'Offers', href: '/clinicportal/offers' },
  ];

  const handleItemClick = (href: string) => {
    setActiveItem(href);
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };
  
  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    // e.g., redirect to login page or call logout API
  };

  // Render sidebar content - used in both mobile and desktop views
  const renderSidebarContent = () => (
    <>
      <motion.div 
        className={`flex items-center ${collapsed ? 'justify-center py-8' : ''} px-5 py-8`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {collapsed ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white">
            <Home size={20} strokeWidth={1.5} />
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Home size={20} strokeWidth={1.5} />
            </div>
            <div className="ml-3">
              <h1 className="font-semibold text-gray-800">Clinic Portal</h1>
              <p className="text-xs text-blue-600">Healthcare Management</p>
            </div>
          </div>
        )}
      </motion.div>
      
      <div className="mt-2 px-3 flex-grow">
        <motion.nav 
          className="space-y-0.5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { 
              transition: { 
                staggerChildren: 0.05 
              } 
            }
          }}  
        >
          {menuItems.map((item) => (
            <motion.div key={item.href} variants={itemVariants}>
              <SidebarItem
                icon={item.icon}
                label={item.label}
                href={item.href}
                collapsed={collapsed}
                active={activeItem === item.href}
                onClick={() => handleItemClick(item.href)}
              />
            </motion.div>
          ))}
        </motion.nav>
      </div>
      
      {!collapsed && (
        <motion.div 
          className="px-5 pt-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-600 mb-3">Need assistance with your dashboard?</p>
            <a 
              href="/help-center"
              className="block w-full py-2 text-center text-xs font-medium text-blue-600 bg-white rounded-lg border border-gray-100 hover:border-blue-100 hover:shadow-sm transition-all duration-200"
            >
              Support Center
            </a>
          </div>
        </motion.div>
      )}
      
      {/* User Profile Section */}
      <div className={`px-3 py-3 border-t border-gray-100 ${collapsed ? 'flex justify-center' : ''}`}>
        <AnimatePresence>
          {collapsed ? (
            <motion.button
              onClick={() => setCollapsed(false)}
              className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full object-cover" 
              />
            </motion.button>
          ) : (
            <motion.div 
              className="flex items-center justify-between w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <motion.button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} strokeWidth={1.5} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  // Main component return
  return (
    <>
      {/* Mobile toggle button - always visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <motion.button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-white rounded-lg text-blue-600 shadow-md border border-gray-100"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </motion.button>
      </div>
      
      {/* Mobile sidebar - slides in from left */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div 
              className="relative w-72 h-full bg-white shadow-xl flex flex-col z-50"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {renderSidebarContent()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Desktop sidebar - collapsible */}
      <div className="hidden md:block relative h-screen">
        <motion.div 
          className={`h-full bg-white border-r border-gray-100 shadow-sm flex flex-col z-30`}
          initial={false}
          animate={{ 
            width: collapsed ? "5rem" : "16rem"
          }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
        >
          {renderSidebarContent()}
        </motion.div>
        
        {/* Collapse toggle button */}
        <motion.button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 p-1.5 bg-white rounded-full border border-gray-100 text-gray-400 shadow-sm hover:text-blue-500 hover:border-blue-100 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={14} />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}