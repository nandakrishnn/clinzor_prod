"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface DropdownPortalProps {
  children: React.ReactNode;
}

const DropdownPortal: React.FC<DropdownPortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Handle positioning after rendering
    setTimeout(() => {
      const dropdownContent = document.querySelector('.dropdown-content');
      if (!dropdownContent) return;
      
      const parentId = dropdownContent.getAttribute('data-parent-id');
      if (!parentId) return;
      
      const triggerElement = document.getElementById(parentId);
      if (!triggerElement) return;
      
      const rect = triggerElement.getBoundingClientRect();
      const dropdownRect = dropdownContent.getBoundingClientRect();
      
      // Calculate position
      const top = rect.bottom + window.scrollY;
      let left = rect.left;
      
      // Adjust horizontal position based on available space
      const viewportWidth = window.innerWidth;
      if (left + dropdownRect.width > viewportWidth - 16) {
        // If dropdown would go off right edge, align to right side of trigger
        left = rect.right - dropdownRect.width;
        if (left < 16) left = 16; // Keep minimum padding from left edge
      }
      
      // Apply position
      (dropdownContent as HTMLElement).style.top = `${top}px`;
      (dropdownContent as HTMLElement).style.left = `${left}px`;
      
      // Add event listener to close dropdown on scroll/resize
      const handleScrollResize = () => {
        const event = new CustomEvent('dropdownRepositionNeeded', {
          detail: { parentId }
        });
        document.dispatchEvent(event);
      };
      
      window.addEventListener('scroll', handleScrollResize);
      window.addEventListener('resize', handleScrollResize);
      
      return () => {
        window.removeEventListener('scroll', handleScrollResize);
        window.removeEventListener('resize', handleScrollResize);
      };
    }, 0);
    
    // Add global event listener for repositioning
    const handleRepositionEvent = (e: CustomEvent) => {
      const { parentId } = e.detail;
      const dropdownContent = document.querySelector(`.dropdown-content[data-parent-id="${parentId}"]`);
      const triggerElement = document.getElementById(parentId);
      
      if (!dropdownContent || !triggerElement) return;
      
      const rect = triggerElement.getBoundingClientRect();
      const dropdownRect = dropdownContent.getBoundingClientRect();
      
      // Calculate and apply new position
      const top = rect.bottom + window.scrollY;
      let left = rect.left;
      
      // Adjust horizontal position
      const viewportWidth = window.innerWidth;
      if (left + dropdownRect.width > viewportWidth - 16) {
        left = rect.right - dropdownRect.width;
        if (left < 16) left = 16;
      }
      
      (dropdownContent as HTMLElement).style.top = `${top}px`;
      (dropdownContent as HTMLElement).style.left = `${left}px`;
    };
    
    document.addEventListener('dropdownRepositionNeeded', handleRepositionEvent as EventListener);
    
    return () => {
      document.removeEventListener('dropdownRepositionNeeded', handleRepositionEvent as EventListener);
    };
  }, []);
  
  return mounted ? createPortal(
    <div className="glassdropdown-portal fixed top-0 left-0 w-full h-0 overflow-visible pointer-events-none z-50">
      <div className="pointer-events-auto absolute">
        {children}
      </div>
    </div>,
    document.body
  ) : null;
};

export default DropdownPortal;