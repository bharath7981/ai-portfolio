// components/JellyCard.jsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function JellyCard({ className = "", style = {}, children, ...props }) {
  const [motionState, setMotionState] = useState({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    skewX: 0,
    skewY: 0,
    scale: 1,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Displacement shift following cursor (max ~14px)
    const deltaX = (x - centerX) * 0.12;
    const deltaY = (y - centerY) * 0.12;

    // Subtle 3D tilt
    const tiltX = -((y - centerY) / centerY) * 8;
    const tiltY = ((x - centerX) / centerX) * 8;

    // Jelly stretch & skew
    const skewX = (x - centerX) * 0.02;
    const skewY = (y - centerY) * 0.02;

    setMotionState({
      x: deltaX,
      y: deltaY,
      rotateX: tiltX,
      rotateY: tiltY,
      skewX: skewX,
      skewY: skewY,
      scale: 1.02,
    });
  };

  const handleMouseLeave = () => {
    setMotionState({
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      skewX: 0,
      skewY: 0,
      scale: 1,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={motionState}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 18,
        mass: 0.6,
      }}
      className={`will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d", ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
