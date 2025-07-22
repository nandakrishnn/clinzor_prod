"use client";
import { useState, useEffect, useCallback } from 'react';

// Extend the Window interface to include dropdownRegistry
declare global {
  interface Window {
    dropdownRegistry?: { current: Record<string, boolean> };
  }
}

// Improved dropdown hook with better management and safety checks
const useDropdown = (initialState = false, id = 'dropdown') => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  
  // Static registry to track all active dropdown instances
  // This helps coordinate dropdowns so only one is open at a time
  const dropdownRegistry = useCallback(() => {
    if (typeof window === 'undefined') return { current: {} };
    
    if (!window.dropdownRegistry) {
      window.dropdownRegistry = { current: {} };
    }
    
    return window.dropdownRegistry;
  }, []);
  
  const open = useCallback(() => {
    setIsOpen(true);
    const registry = dropdownRegistry();
    registry.current[id] = true;
    setActiveDropdownId(id);
    
    // Close other dropdowns when opening this one
    Object.keys(registry.current).forEach(key => {
      if (key !== id && registry.current[key]) {
        const closeEvent = new CustomEvent('closeDropdown', { detail: { id: key } });
        document.dispatchEvent(closeEvent);
      }
    });
  }, [id, dropdownRegistry]);
  
  const close = useCallback(() => {
    setIsOpen(false);
    const registry = dropdownRegistry();
    registry.current[id] = false;
    if (activeDropdownId === id) {
      setActiveDropdownId(null);
    }
  }, [id, activeDropdownId, dropdownRegistry]);
  
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);
  
  // Listen for custom close events from other dropdowns
  useEffect(() => {
    const handleCloseDropdown = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.id === id) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('closeDropdown', handleCloseDropdown);
    
    // Cleanup on unmount
    return () => {
      document.removeEventListener('closeDropdown', handleCloseDropdown);
      
      // Also remove from registry when unmounted
      const registry = dropdownRegistry();
      if (registry.current && registry.current[id]) {
        delete registry.current[id];
      }
    };
  }, [id, dropdownRegistry]);
  
  // Handle document-wide click events to close active dropdowns
  useEffect(() => {
    // Only add this effect if this dropdown is open
    if (!isOpen) return;
    
    // We're handling clicks via the ResponsiveDropdown component,
    // but this serves as a safety net for unexpected situations
    const handleGlobalClick = () => {
      const registry = dropdownRegistry();
      if (registry.current && Object.values(registry.current).some(Boolean)) {
        setTimeout(() => {
          const anyDropdownOpen = Object.values(registry.current).some(Boolean);
          if (!anyDropdownOpen) {
            setActiveDropdownId(null);
          }
        }, 100);
      }
    };
    
    document.addEventListener('click', handleGlobalClick);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [isOpen, dropdownRegistry]);
  
  return {
    isOpen,
    open,
    close,
    toggle,
    activeDropdownId
  };
};

export default useDropdown;