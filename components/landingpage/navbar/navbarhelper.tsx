"use client";

import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import React, { useRef, useState } from "react";
import Image from "next/image";

// Props Interfaces
interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: { name: string; link: string }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

// Main Navbar wrapper
export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 50);
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    setScrollProgress(Math.min(latest / (maxScroll || 1), 1));
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-5 z-50 w-full", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              visible,
              scrollProgress,
            })
          : child
      )}
    </motion.div>
  );
};

// Main Nav for desktop
export const NavBody = ({
  children,
  className,
  visible,
  scrollProgress = 0,
}: NavBodyProps & { scrollProgress?: number }) => (
  <motion.div
    initial={{
      width: "100%",
      height: "80px",
      backgroundColor: "rgba(255,255,255,0)",
      backdropFilter: "none",
      boxShadow: "none",
      y: 0,
      borderColor: "rgba(0,0,0,0.05)",
    }}
    animate={{
      width: visible ? "65%" : "70%",
      height: visible ? "60px" : "80px",
      backgroundColor: visible ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0)",
      backdropFilter: visible ? "blur(12px)" : "blur(0px)",
      boxShadow: visible
        ? "0 10px 30px -10px rgba(0,0,0,0.06), 0 0 10px rgba(0,0,0,0.03)"
        : "none",
      y: visible ? 10 : 0,
      borderColor: visible ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.05)",
    }}
    transition={{ type: "spring", stiffness: 200, damping: 30 }}
    className={cn(
      "relative z-50 mx-auto hidden flex-row items-center justify-between rounded-2xl border px-6 lg:flex",
      className
    )}
    style={{
      borderWidth: "1px",
      backgroundImage: visible
        ? `linear-gradient(135deg, rgba(255,255,255,${0.6 + scrollProgress * 0.3}) ${scrollProgress * 100}%, rgba(240,242,245,${0.6 + scrollProgress * 0.3}) 100%)`
        : undefined,
    }}
  >
    {children}
  </motion.div>
);

// Desktop navigation links
export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 z-50 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-bold  lg:flex",
        className
      )}
    >
      {items.map((item, idx) => (
        <motion.a
          key={idx}
          href={item.link}
          onClick={onItemClick}
          onMouseEnter={() => setHovered(idx)}
          className="relative px-4 py-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-100 to-slate-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
          <span className="relative z-10 font-medium text-slate-800">{item.name}</span>
        </motion.a>
      ))}
    </motion.div>
  );
};

// Mobile Nav
export const MobileNav = ({
  children,
  className,
  visible,
  scrollProgress = 0,
}: MobileNavProps & { scrollProgress?: number }) => (
  <motion.div
    initial={{
      width: "70%",
      height: "70px",
      backgroundColor: "rgba(255,255,255,0)",
      borderRadius: "1.5rem",
      backdropFilter: "none",
      boxShadow: "none",
      y: 0,
      borderColor: "rgba(0,0,0,0.05)",
    }}
    animate={{
      width: visible ? "70%" : "100%",
      height: visible ? "55px" : "70px",
      backgroundColor: visible ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0)",
      borderRadius: visible ? "1rem" : "1.5rem",
      backdropFilter: visible ? "blur(12px)" : "blur(0px)",
      boxShadow: visible
        ? "0 10px 30px -10px rgba(0,0,0,0.06), 0 0 10px rgba(0,0,0,0.03)"
        : "none",
      y: visible ? 10 : 0,
      borderColor: visible ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.05)",
    }}
    transition={{ type: "spring", stiffness: 200, damping: 30 }}
    className={cn(
      "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between border px-4 py-2 lg:hidden",
      className
    )}
    style={{
      borderWidth: "1px",
      backgroundImage: visible
        ? `linear-gradient(135deg, rgba(255,255,255,${0.6 + scrollProgress * 0.3}) ${scrollProgress * 100}%, rgba(240,242,245,${0.6 + scrollProgress * 0.3}) 100%)`
        : undefined,
    }}
  >
    {children}
  </motion.div>
);

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => (
  <div className={cn("flex w-full flex-row items-center justify-between z-50", className)}>
    {children}
  </div>
);

export const MobileNavMenu = ({ children, className, isOpen, onClose }: MobileNavMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-900"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "absolute inset-x-0 top-20 z-50 mx-4 flex flex-col text-black items-start gap-4 rounded-xl border border-slate-200 bg-white/90 p-8 backdrop-blur-md shadow-xl",
            className
          )}
        >
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="z-50 cursor-pointer rounded-full border border-slate-200 bg-white/80 p-2 backdrop-blur-sm"
    onClick={onClick}
  >
    {isOpen ? (
      <IconX className="h-5 w-5 text-slate-800" />
    ) : (
      <IconMenu2 className="h-5 w-5 text-slate-800" />
    )}
  </motion.div>
);

export const NavbarLogo = () => (
  <Image
    src="/assets/logo/logo.png"
    alt="Logo"
    width={50}
    height={50}
    className="rounded-full z-50"
  />
);

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "gradient";
} & (React.ComponentPropsWithoutRef<"a"> | React.ComponentPropsWithoutRef<"button">)) => {
  const baseStyles =
    "px-4 py-2 rounded-xl text-sm font-medium relative cursor-pointer transition duration-300 inline-block text-center overflow-hidden z-50";

  const variantStyles = {
    primary:
      "bg-white/80 text-slate-800 shadow-lg shadow-slate-200/50 backdrop-blur-md border border-slate-200 hover:border-slate-300",
    secondary:
      "bg-transparent border border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/50",
    gradient:
      "bg-gradient-to-r from-slate-800 to-slate-600 text-white shadow-lg shadow-slate-300/30 hover:shadow-slate-300/40 hover:from-slate-700 hover:to-slate-500",
  };

  return (
    <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
      <Tag
        href={href || undefined}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Tag>
    </motion.div>
  );
};
