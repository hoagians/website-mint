"use client";

import React, { useEffect } from "react";

const isMobileDevice = (): boolean => {
  return /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const BackgroundEffect: React.FC = () => {
  useEffect(() => {
    if (isMobileDevice()) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      // Calculates mouse position as a proportion of the screen
      const posX = (event.clientX / innerWidth - 0.5) * 30; // Limits movement between -15 to 15 pixels
      const posY = (event.clientY / innerHeight - 0.5) * 30;

      // Apply the new position to the body style
      document.body.style.backgroundPosition = `calc(50% + ${posX}px) calc(50% + ${posY}px)`;
    };

    // Add mousemove event
    window.addEventListener("mousemove", handleMouseMove);

    // Removes event when component unmounts
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null;
};
