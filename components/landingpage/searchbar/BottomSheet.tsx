"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  height?: string | number;
  className?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  height = 'auto',
  className = '',
}) => {
  const [mounted, setMounted] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragControls = useRef<{ startY: number; currentY: number }>({
    startY: 0,
    currentY: 0,
  });

  useEffect(() => {
    setMounted(true);
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    if (sheetRef.current) {
      if (event instanceof MouseEvent || event instanceof PointerEvent) {
        dragControls.current.startY = event.clientY;
      } else if (event instanceof TouchEvent) {
        dragControls.current.startY = event.touches[0]?.clientY || 0;
      }
    }
  };

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    dragControls.current.currentY = info.offset.y;
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged down more than 100px or velocity is high, close the sheet
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300 
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={`relative w-full max-w-md bg-white rounded-t-2xl shadow-xl ${className}`}
            style={{ 
              maxHeight: 'calc(100vh - 2rem)',
              height: typeof height === 'number' ? `${height}px` : height,
              touchAction: 'none'
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center p-2">
              <div className="w-12 h-1.5 rounded-full bg-gray-300" />
            </div>
            
            {/* Title (optional) */}
            {title && (
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-800">{title}</h3>
              </div>
            )}
            
            {/* Content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 2.5rem)' }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BottomSheet;