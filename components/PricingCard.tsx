import { Check, X, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingFeature {
  text: string;
  included: boolean;
  highlighted?: boolean;
}

interface PricingCardProps {
  name: string;
  price: number;
  period?: string;
  features: PricingFeature[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  buttonDisabled?: boolean;
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  highlight?: boolean;
  popularLabel?: string;
}

export default function PricingCard({
  name,
  price,
  period = "/month",
  features,
  buttonText,
  buttonVariant = "default",
  buttonDisabled = false,
  badge,
  highlight = false,
  popularLabel,
}: PricingCardProps) {
  const cardClasses = highlight
    ? "relative flex flex-col p-4 sm:p-5 md:p-6 lg:p-8 bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent dark:from-primary/10 dark:via-primary/5 dark:to-transparent border-2 border-primary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 md:scale-105 mt-5 sm:mt-0"
    : "group relative flex flex-col p-4 sm:p-5 md:p-6 lg:p-8 bg-white dark:bg-card-dark border-2 border-gray-200 dark:border-white/10 rounded-2xl hover:border-gray-300 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300";

  const priceClasses = highlight
    ? "text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
    : "text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white";

  const featureIconBg = highlight
    ? "bg-primary/20 dark:bg-primary/30"
    : "bg-primary/10 dark:bg-primary/20";

  return (
    <div className={cardClasses}>
      {/* Badge */}
      {badge && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="px-2.5 py-1 sm:px-3 sm:py-1 md:px-4 md:py-1.5 bg-gradient-to-r from-primary to-primary text-white text-[9px] sm:text-[10px] md:text-xs font-semibold rounded-full shadow-lg flex items-center gap-1 sm:gap-1.5">
            {badge.icon && (
              <badge.icon className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
            )}
            {badge.text}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
          {name}
          {popularLabel && (
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-primary/10 dark:bg-primary/20 text-primary text-[9px] sm:text-[10px] md:text-xs font-semibold rounded">
              {popularLabel}
            </span>
          )}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className={priceClasses}>${price}</span>
          <span className="text-gray-500 dark:text-white/50 text-sm sm:text-base">
            {period}
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 sm:space-y-3 md:space-y-4 mb-5 sm:mb-6 md:mb-8 flex-1">
        {features.map((feature, index) => (
          <li
            key={index}
            className={`flex items-start gap-2 sm:gap-3 text-xs sm:text-sm ${
              feature.included
                ? "text-gray-700 dark:text-white/70"
                : "text-gray-400 dark:text-white/30"
            }`}
          >
            <div
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${
                feature.included ? featureIconBg : "bg-gray-100 dark:bg-white/5"
              } flex items-center justify-center flex-shrink-0 mt-0.5`}
            >
              {feature.included ? (
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
              ) : (
                <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              )}
            </div>
            <span className={feature.highlighted ? "font-medium" : ""}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <Button
        variant={buttonVariant}
        disabled={buttonDisabled}
        className={`w-full h-9 sm:h-10 md:h-11 text-xs sm:text-sm ${
          buttonDisabled ? "opacity-70" : ""
        } ${
          !highlight && !buttonDisabled ? "group-hover:shadow-lg" : ""
        } transition-shadow`}
      >
        {buttonText}
      </Button>
    </div>
  );
}
