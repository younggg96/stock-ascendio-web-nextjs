"use client";

import { Toaster as Sonner } from "sonner";
import { useState, useEffect } from "react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position={isMobile ? "bottom-center" : "top-right"}
      toastOptions={{
        classNames: {
          toast: "group toast rounded-lg shadow-2xl border",
          description: "text-sm opacity-90",
          actionButton: "bg-white/20 text-white hover:bg-white/30",
          cancelButton: "bg-white/10 text-white hover:bg-white/20",
          success: "!bg-green-600 !text-white !border-green-500",
          error: "!bg-red-600 !text-white !border-red-500",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
