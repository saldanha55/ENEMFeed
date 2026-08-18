"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up";
}

const variants = {
  initial: (dir: string) => ({
    x: dir === "left" ? 40 : dir === "right" ? -40 : 0,
    y: dir === "up" ? 20 : 0,
    opacity: 0,
  }),
  animate: { x: 0, y: 0, opacity: 1 },
  exit: (dir: string) => ({
    x: dir === "left" ? -40 : dir === "right" ? 40 : 0,
    y: dir === "up" ? -20 : 0,
    opacity: 0,
  }),
};

export function AnimatedPage({
  children,
  className = "",
  direction = "left",
}: AnimatedPageProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
