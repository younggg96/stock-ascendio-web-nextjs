import * as React from "react";
import { cn } from "@/lib/utils";

export interface TriggerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Whether the button is in selected/active state
   */
  selected?: boolean;
  /**
   * Additional className for custom styling
   */
  className?: string;
  /**
   * Button size
   */
  size?: "sm" | "md" | "lg";
}

const TriggerButton = React.forwardRef<HTMLButtonElement, TriggerButtonProps>(
  ({ className, selected = false, size = "md", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          
          // Size
          sizeClasses[size],
          
          // Default state (not selected)
          !selected && [
            // Light mode - default
            "border border-gray-200 bg-white text-gray-900",
            "hover:bg-gray-50 hover:border-gray-300",
            
            // Dark mode - default
            "dark:border-white/10 dark:bg-white/5 dark:text-white",
            "dark:hover:bg-white/10 dark:hover:border-white/20",
          ],
          
          // Selected state
          selected && [
            // Light mode - selected
            "border-2 border-primary bg-primary text-primary",
            "hover:bg-primary/10 hover:border-primary",
            
            // Dark mode - selected
            "dark:border-primary dark:bg-primary/20 dark:text-primary",
            "dark:hover:bg-primary/30 dark:hover:border-primary",
          ],
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

TriggerButton.displayName = "TriggerButton";

export { TriggerButton };

