"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface TextEffectProps {
  children: ReactNode
  preset?: "fade-in-blur"
  speedSegment?: number
  delay?: number
  as?: "h1" | "h2" | "h3" | "p" | "span"
  className?: string
}

export function TextEffect({
  children,
  preset = "fade-in-blur",
  speedSegment = 1,
  delay = 0,
  as: Component = "p",
  className = "",
}: TextEffectProps) {
  const variants = {
    "fade-in-blur": {
      hidden: { opacity: 0, filter: "blur(10px)" },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.5 * speedSegment,
          delay: delay,
          ease: "easeOut",
        },
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants[preset]}
      className={className}
    >
      <Component>{children}</Component>
    </motion.div>
  )
}
