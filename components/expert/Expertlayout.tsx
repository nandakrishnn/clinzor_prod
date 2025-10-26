import { useState, useEffect } from 'react';
import {
  Calendar,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  User,
  Video,
  AlertTriangle
} from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import { ExpertProvider } from '@/app/Providers';

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
    className={`flex items-center ${collapsed ? 'justify-center' : ''} w-full px-3 py-3 my-1 rounded-lg transition-all duration-200 group ${active
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

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

const LogoutDialog = ({ isOpen, onClose, onConfirm, userName }: LogoutDialogProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Dialog */}
        <motion.div
          className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
              <p className="text-sm text-gray-600">
                {userName ? `Are you sure you want to logout, ${userName}?` : 'Are you sure you want to logout?'}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            You will need to sign in again to access your expert dashboard.
          </p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// User profile type
interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export default function ExpertSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('/expert/dashboard');
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    role: '',
    avatar: '/clinic.png'
  });

  // Update user data when session changes
  useEffect(() => {
    if (session?.user) {
      setUser({
        name: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role || '',
        avatar: '/api/placeholder/32/32'
      });
    }
  }, [session]);

  // Handle resize to switch between mobile and desktop views
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false);
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set active item based on current path
  useEffect(() => {
    const path = window.location.pathname;
    if (path) {
      setActiveItem(path);
    }
  }, []);

  // Menu items configuration - simplified for expert dashboard
  const menuItems = [
    { icon: <BarChart3 size={20} strokeWidth={1.5} />, label: 'Dashboard', href: '/expert' },
    { icon: <Calendar size={20} strokeWidth={1.5} />, label: 'Slot Management', href: '/expert/slotmanagement' },
    { icon: <Video size={20} strokeWidth={1.5} />, label: 'Expert Video Calls', href: '/expert/videocall/portal' },
  ];

  const handleItemClick = (href: string) => {
    setActiveItem(href);
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    signOut({ callbackUrl: "/auth/expertauthentication" });
    console.log('Logging out...');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Render sidebar content - used in both mobile and desktop views
  const renderSidebarContent = () => (
    <>
      <motion.div
        className={`flex items-center ${collapsed ? 'justify-center py-8' : ''} px-5 py-8 z-50`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {collapsed ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <img src="/assets/logo/fav.png" alt="logo" className='w-full' />
          </div>
        ) : (
          <div className="flex flex-col items-start ">
            <div className="w-40 h-10 flex items-center justify-center ">
              <img src="/assets/logo/logo.png" alt="logo" className='w-full' />
            </div>
            <div className="pt-1.5 ml-1.5">
              <h1 className="font-semibold text-gray-500 truncate tracking-[4px] text-xs uppercase">Expert Portal</h1>
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
              <User size={20} strokeWidth={1.5} />
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
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <User size={20} strokeWidth={1.5} />
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.role}</p>
                </div>
              </div>
              <motion.button
                onClick={handleLogoutClick}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600"
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
      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        isOpen={logoutDialogOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        userName={user.name}
      />

      {/* Mobile toggle button - always visible on mobile */}
      <ExpertProvider>
        <div className="md:hidden fixed top-4 left-4 z-50">
          <motion.button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 bg-white rounded-lg text-purple-600 shadow-md border border-gray-100"
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
                className="relative w-72 h-full bg-white shadow-xl flex flex-col"
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
            className={`h-full bg-white border-r border-gray-100 shadow-sm flex flex-col`}
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
            className="absolute -right-3 top-16 p-1.5 bg-white rounded-full border border-gray-100 text-gray-400 shadow-sm hover:text-purple-500 hover:border-purple-100 transition-colors duration-200"
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
      </ExpertProvider>
    </>
  );
}