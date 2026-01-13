import { useState, useEffect } from "react";
import { BostaLogo } from "./ui";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({
  onComplete,
  duration = 2500,
}: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Animated Logo Container */}
      <div className="relative">
        {/* Pulse ring effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full bg-[#E30613]/10 animate-pulse-ring" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-[#E30613]/20 animate-pulse-ring animation-delay-200" />
        </div>

        {/* Logo with animation */}
        <div className="relative z-10 animate-logo-entrance">
          <BostaLogo className="h-16 w-auto" />
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-8 flex items-center gap-2">
        <span className="text-gray-500 font-medium animate-fade-in">
          Loading
        </span>
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-[#E30613] rounded-full animate-bounce-dot"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-[#E30613] rounded-full animate-bounce-dot"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-[#E30613] rounded-full animate-bounce-dot"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-[#E30613] to-[#ff6b6b] animate-progress-bar"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
