// components/PortfolioFlow.jsx
"use client";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function PortfolioFlow({ children }) {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Refresh ScrollTrigger to ensure accurate trigger positions in normal scroll flow
    ScrollTrigger.refresh();
  }, []);

  return (
    <div ref={mainRef} className="relative w-full">
      {children}
    </div>
  );
}
