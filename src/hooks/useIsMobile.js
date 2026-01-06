"use client";

// hooks/useIsMobile.js
import { useState, useEffect } from "react";

function getInitialState(breakpoint) {
  if (typeof window === "undefined") {
    return false;
  }
  return window.innerWidth <= breakpoint;
}

export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => getInitialState(breakpoint));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}
