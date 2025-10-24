"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectorOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectorProps {
  options: SelectorOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "pills" | "tabs";
}

export function Selector({
  options,
  value,
  onValueChange,
  className,
  size = "md",
  variant = "pills",
}: SelectorProps) {
  const [indicatorStyle, setIndicatorStyle] = React.useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const [mounted, setMounted] = React.useState(false);

  const sizeClasses = {
    sm: "h-7 px-2 text-[10px]",
    md: "h-8 px-3 text-xs",
    lg: "h-9 px-4 text-sm",
  };

  // Update indicator position when value changes
  const updateIndicatorPosition = React.useCallback(() => {
    const activeButton = buttonRefs.current.get(value);
    const container = containerRef.current;

    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [value]);

  // Initial position setup
  React.useEffect(() => {
    setMounted(true);
    updateIndicatorPosition();
  }, [updateIndicatorPosition]);

  // Update position when value or options change
  React.useEffect(() => {
    if (mounted) {
      updateIndicatorPosition();
    }
  }, [value, options, mounted, updateIndicatorPosition]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center gap-1 bg-gray-100 dark:bg-white/5 rounded-lg p-1",
        className
      )}
    >
      {/* Animated indicator */}
      {variant === "pills" && indicatorStyle.width > 0 && (
        <div
          className="absolute bg-primary/40 rounded-md transition-all duration-300 ease-out"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            height: "calc(100% - 8px)",
            top: "4px",
          }}
        />
      )}

      {/* Options */}
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            ref={(el) => {
              if (el) {
                buttonRefs.current.set(option.value, el);
              }
            }}
            onClick={() => onValueChange(option.value)}
            className={cn(
              `relative z-10 rounded-md font-medium transition-all duration-200 flex items-center gap-1.5`,
              sizeClasses[size],
              isActive
                ? "text-white shadow-sm"
                : "text-gray-600 dark:text-white/50 hover:bg-white dark:hover:bg-white/10"
            )}
          >
            {option.icon && (
              <span className="flex-shrink-0">{option.icon}</span>
            )}
            {option.label && (
              <span className="hidden sm:inline">{option.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
