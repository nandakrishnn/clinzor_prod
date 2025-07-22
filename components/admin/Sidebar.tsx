import { useState, useEffect } from 'react';
import {
  Calendar,
  BarChart3,
  BookOpen,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronDown,
  LogOut,
  User,
  Users,
  Building2,
  Settings,
  HelpCircle,
  FileText,
  UserCheck,
  CreditCard,
  Gift,
  Stethoscope,
  DollarSign,
  Bell,
  Search
} from 'lucide-react';
import React from 'react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
  badge?: string | number;
  badgeColor?: 'blue' | 'red' | 'green' | 'yellow';
  onClick?: () => void;
}

interface NestedSidebarItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
  hasActiveChild?: boolean;
  badge?: string | number;
  badgeColor?: 'blue' | 'red' | 'green' | 'yellow';
  children: Array<{
    label: string;
    href: string;
    badge?: string | number;
    badgeColor?: 'blue' | 'red' | 'green' | 'yellow';
  }>;
  onItemClick: (href: string) => void;
  activeItem: string;
}

const Badge = ({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'red' | 'green' | 'yellow' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

const SidebarItem = ({ icon, label, href, collapsed, active = false, badge, badgeColor = 'blue', onClick }: SidebarItemProps) => (
  <a 
    href={href}
    onClick={onClick}
    className={`flex items-center ${collapsed ? 'justify-center' : ''} w-full px-3 py-3 my-1 rounded-lg transition-all duration-200 group relative touch-manipulation ${
      active 
        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 active:scale-95'
    }`}
  >
    {/* Active indicator bar */}
    {active && (
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
    )}
    
    <div 
      className={`flex items-center justify-center ${collapsed ? 'w-8 h-8' : 'w-8 h-8 mr-3'} ${
        active 
          ? 'text-blue-700' 
          : 'text-gray-500 group-hover:text-blue-500'
      }`}
    >
      {icon}
    </div>
    {!collapsed && (
      <div className="flex items-center justify-between flex-1 min-w-0">
        <span className={`text-sm font-medium transition-colors duration-200 truncate mr-2 ${
          active 
            ? 'text-blue-700 font-semibold' 
            : 'text-gray-700 group-hover:text-blue-600'
        }`}>
          {label}
        </span>
        {badge && <Badge color={badgeColor}>{badge}</Badge>}
      </div>
    )}
    
    {/* Tooltip for collapsed state */}
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {label}
        <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    )}
  </a>
);

const NestedSidebarItem = ({ 
  icon, 
  label, 
  collapsed, 
  active = false, 
  hasActiveChild = false,
  badge, 
  badgeColor = 'blue', 
  children, 
  onItemClick,
  activeItem 
}: NestedSidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-expand if has active child
  useEffect(() => {
    if (hasActiveChild && !collapsed) {
      setIsOpen(true);
    }
  }, [hasActiveChild, collapsed]);

  const isParentActive = active || hasActiveChild;

  return (
    <div className="w-full">
      <button
        onClick={() => !collapsed && setIsOpen(!isOpen)}
        className={`flex items-center ${collapsed ? 'justify-center' : ''} w-full px-3 py-3 my-1 rounded-lg transition-all duration-200 group relative touch-manipulation ${
          isParentActive
            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 active:scale-95'
        }`}
      >
        {/* Active indicator bar for parent */}
        {isParentActive && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>
        )}
        
        <div 
          className={`flex items-center justify-center ${collapsed ? 'w-8 h-8' : 'w-8 h-8 mr-3'} ${
            isParentActive
              ? 'text-blue-700' 
              : 'text-gray-500 group-hover:text-blue-500'
          }`}
        >
          {icon}
        </div>
        {!collapsed && (
          <>
            <div className="flex items-center justify-between flex-1 min-w-0">
              <span className={`text-sm font-medium transition-colors duration-200 truncate mr-2 ${
                isParentActive
                  ? 'text-blue-700 font-semibold' 
                  : 'text-gray-700 group-hover:text-blue-600'
              }`}>
                {label}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                {badge && <Badge color={badgeColor}>{badge}</Badge>}
                <div
                  className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                  <ChevronDown size={16} className={isParentActive ? 'text-blue-600' : 'text-gray-400'} />
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {label}
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        )}
      </button>
      
      {!collapsed && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="ml-8 lg:ml-11 space-y-1 py-1">
            {children.map((child, index) => {
              const isChildActive = activeItem === child.href;
              return (
                <a
                  key={index}
                  href={child.href}
                  onClick={() => onItemClick(child.href)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200 relative touch-manipulation ${
                    isChildActive
                      ? 'bg-blue-100 text-blue-700 font-medium shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600 active:scale-95'
                  }`}
                >
                  {/* Active indicator for child items */}
                  {isChildActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-blue-600 rounded-r-full"></div>
                  )}
                  <span className="ml-2 truncate mr-2">{child.label}</span>
                  {child.badge && <Badge color={child.badgeColor || 'blue'}>{child.badge}</Badge>}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// User profile type
interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('/admin/dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Example user data - in a real app, this would come from your authentication system
  const [user] = useState<UserProfile>({
    name: 'Admin User',
    email: 'admin@hospital.com',
    role: 'System Administrator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=64&h=64&q=80'
  });
  
  // Handle resize to switch between mobile and desktop views
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(false);
        setMobileOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set active item based on current path (simulated for demo)
  useEffect(() => {
    // In a real app, you'd use window.location.pathname or your router's current path
    const path = window.location.pathname || '/admin/dashboard';
    setActiveItem(path);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (mobileOpen && isMobile) {
        const target = event.target as Element;
        if (!target.closest('.mobile-sidebar') && !target.closest('.mobile-toggle')) {
          setMobileOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [mobileOpen, isMobile]);

  // Menu items configuration
  const menuItems = [
    { icon: <BarChart3 size={20} strokeWidth={1.5} />, label: 'Dashboard', href: '/admin/dashboard' },
  ];

  const nestedMenuItems = [
    {
      icon: <Users size={20} strokeWidth={1.5} />,
      label: 'User Management',
      badge: '245',
      badgeColor: 'blue' as const,
      children: [
        { label: 'All Users', href: '/admin/allusers' },
        { label: 'Blocked Users', href: '/admin/blocked', badge: '12', badgeColor: 'red' as const },
        { label: 'User Analytics', href: '/admin/analytics' }
      ]
    },
    {
      icon: <Building2 size={20} strokeWidth={1.5} />,
      label: 'Clinic Management',
      badge: '48',
      badgeColor: 'green' as const,
      children: [
        { label: 'All Clinics', href: '/admin/allclinics' },
        { label: 'Pending Approvals', href: '/admin/pending', badge: '7', badgeColor: 'yellow' as const },
        { label: 'Clinic Analytics', href: '/admin/clinics/analytics' }
      ]
    },
    {
      icon: <UserCheck size={20} strokeWidth={1.5} />,
      label: 'Expert Management',
      badge: '89',
      badgeColor: 'blue' as const,
      children: [
        { label: 'All Experts', href: '/admin/experts' },
        { label: 'Pending Verification', href: '/admin/experts/pending', badge: '5', badgeColor: 'yellow' as const },
        { label: 'Expert Performance', href: '/admin/experts/performance' }
      ]
    },
    {
      icon: <Calendar size={20} strokeWidth={1.5} />,
      label: 'Bookings Management',
      badge: '156',
      badgeColor: 'green' as const,
      children: [
        { label: 'All Bookings', href: '/admin/bookings' },
        { label: 'Slot Management', href: '/admin/slots' },
        { label: 'Payment Records', href: '/admin/paymentsrecord' },
      ]
    },
    {
      icon: <Stethoscope size={20} strokeWidth={1.5} />,
      label: 'Service Management',
      children: [
        { label: 'All Services', href: '/admin/allservices' },
        { label: 'Request Service', href: '/admin/requestservice' },
      ]
    },
    {
      icon: <DollarSign size={20} strokeWidth={1.5} />,
      label: 'Dues Management',
      badge: 'New',
      badgeColor: 'green' as const,
      children: [
        { label: 'Dues List', href: '/admin/dues' },
      ]
    },
    {
      icon: <Gift size={20} strokeWidth={1.5} />,
      label: 'Offers & Promotions',
      badge: '8',
      badgeColor: 'yellow' as const,
      children: [
        { label: 'Offers List', href: '/admin/offers' },
      ]
    },
    {
      icon: <Home size={20} strokeWidth={1.5} />,
      label: 'Camp Management',
      badge: '15',
      badgeColor: 'blue' as const,
      children: [
        { label: 'All Camps', href: '/admin/allcamps' },
      ]
    }
  ];

  const bottomMenuItems = [
    { icon: <HelpCircle size={20} strokeWidth={1.5} />, label: 'FAQ Management', href: '/admin/faq' },
    { icon: <FileText size={20} strokeWidth={1.5} />, label: 'Blog Management', href: '/admin/blog', badge: '3', badgeColor: 'blue' as const },
    { icon: <Building2 size={20} strokeWidth={1.5} />, label: 'Organization Management', href: '/admin/org' },
  ];

  const handleItemClick = (href: string) => {
    setActiveItem(href);
    if (isMobile) {
      setMobileOpen(false);
    }
  };
  
  const handleLogout = () => {
    console.log('Logging out...');
  };

  // Helper function to check if a nested item has an active child
  const hasActiveChild = (children: Array<{href: string}>) => {
    return children.some(child => child.href === activeItem);
  };

  // Render sidebar content - used in both mobile and desktop views
  const renderSidebarContent = () => (
    <>
      <div 
        className={`flex items-center ${collapsed ? 'justify-center py-6' : ''} px-4 sm:px-5 py-6 sm:py-8 border-b border-gray-100`}
      >
        {collapsed ? (
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Settings size={20} strokeWidth={1.5} />
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm">
              <Settings size={20} strokeWidth={1.5} />
            </div>
            <div className="ml-3 min-w-0">
              <h1 className="font-semibold text-gray-800 truncate">Admin Portal</h1>
              <p className="text-xs text-purple-600 truncate">System Management</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Search Bar */}
      {!collapsed && (
        <div className="px-4 sm:px-5 py-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto px-3 sm:px-3">
        <nav className="space-y-0.5 pb-4">
          {/* Regular menu items */}
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              collapsed={collapsed}
              active={activeItem === item.href}
              onClick={() => handleItemClick(item.href)}
            />
          ))}
          
          {/* Nested menu items */}
          {nestedMenuItems.map((item, index) => (
            <NestedSidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
              badge={item.badge}
              badgeColor={item.badgeColor}
              children={item.children}
              onItemClick={handleItemClick}
              activeItem={activeItem}
              hasActiveChild={hasActiveChild(item.children)}
            />
          ))}
          
          {/* Bottom menu items */}
          <div className="pt-4 border-t border-gray-100 mt-4">
            {bottomMenuItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                collapsed={collapsed}
                active={activeItem === item.href}
                badge={item.badge}
                badgeColor={item.badgeColor}
                onClick={() => handleItemClick(item.href)}
              />
            ))}
          </div>
        </nav>
      </div>
      
      {/* System Status Card */}
      {!collapsed && (
        <div className="px-4 sm:px-5 py-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center mb-2">
              <Bell size={16} className="text-purple-600 mr-2 flex-shrink-0" />
              <p className="text-xs text-gray-600 font-medium">System Health: Good</p>
            </div>
            <p className="text-xs text-gray-600 mb-3">All services running normally</p>
            <a 
              href="/admin/system-status"
              className="block w-full py-2 text-center text-xs font-medium text-purple-600 bg-white rounded-lg border border-purple-100 hover:border-purple-200 hover:shadow-sm transition-all duration-200 touch-manipulation active:scale-95"
            >
              View Details
            </a>
          </div>
        </div>
      )}
      
      {/* User Profile Section */}
      <div className={`px-3 sm:px-3 py-3 border-t border-gray-100 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center hover:scale-105 transition-transform touch-manipulation group relative"
          >
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover" 
            />
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {user.name}
              <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          </button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600 hover:scale-105 transition-all touch-manipulation flex-shrink-0"
            >
              <LogOut size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </>
  );

  // Main component return
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile toggle button - always visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-toggle p-3 bg-white rounded-xl text-purple-600 shadow-lg border border-gray-100 hover:scale-105 transition-transform touch-manipulation active:scale-95"
        >
          {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>
      
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setMobileOpen(false)}
          />
          <div className="mobile-sidebar relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out">
            {renderSidebarContent()}
          </div>
        </div>
      )}
      
      {/* Desktop sidebar - collapsible */}
      <div className="hidden md:block relative h-screen">
        <div 
          className={`h-full bg-white border-r border-gray-100 shadow-sm flex flex-col transition-all duration-300 ease-in-out ${
            collapsed ? 'w-20' : 'w-72 lg:w-80'
          }`}
        >
          {renderSidebarContent()}
        </div>
        
        {/* Collapse toggle button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 p-1.5 bg-white rounded-full border border-gray-100 text-gray-400 shadow-md hover:text-purple-500 hover:border-purple-100 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-200"
        >
          <ChevronLeft 
            size={14} 
            className={`transform transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      

    </div>
  );
}