"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TriggerButton } from "./trigger-button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface MultiSelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      onChange,
      placeholder = "Select...",
      className,
      disabled = false,
      size = "md",
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSelect = (optionValue: string) => {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange([]);
      setIsOpen(false);
    };

    const selectedOptions = options.filter((opt) =>
      value.includes(opt.value)
    );

    const getDisplayText = () => {
      if (selectedOptions.length === 0) {
        return placeholder;
      }
      if (selectedOptions.length === 1) {
        return selectedOptions[0].label;
      }
      return `${selectedOptions.length} selected`;
    };

    return (
      <div ref={ref} className={cn("relative w-full", className)}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <TriggerButton
              disabled={disabled}
              selected={selectedOptions.length > 0}
              size={size}
              className="w-full justify-between"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span className="truncate">{getDisplayText()}</span>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {selectedOptions.length > 0 && !disabled && (
                  <button
                    onClick={handleClear}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    aria-label="Clear all selections"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 opacity-50 transition-transform duration-200",
                    isOpen && "transform rotate-180"
                  )} 
                />
              </div>
            </TriggerButton>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0" 
            align="start"
            sideOffset={4}
          >
            <div className="max-h-80 overflow-auto p-1">
              {options.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500 dark:text-white/50">
                  No options available
                </div>
              ) : (
                options.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none transition-colors duration-150",
                        isSelected
                          ? "bg-primary/10 text-primary dark:bg-primary/20"
                          : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white"
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {option.icon && (
                          <span className="flex items-center">{option.icon}</span>
                        )}
                        <span>{option.label}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

