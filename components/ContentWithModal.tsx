"use client";

import { ExternalLink } from "lucide-react";

interface ContentWithModalProps {
  children: React.ReactNode;
  onOpenModal: () => void;
  ariaLabel?: string;
  className?: string;
}

/**
 * A reusable component that displays content with an external link button
 * that opens a modal when clicked.
 *
 * @param children - The content to display (text, summary, or any React node)
 * @param onOpenModal - Callback function to open the modal
 * @param ariaLabel - Accessible label for the button (default: "Open in modal")
 * @param className - Additional CSS classes for the container
 */
export default function ContentWithModal({
  children,
  onOpenModal,
  ariaLabel = "Open in modal",
  className = "",
}: ContentWithModalProps) {
  return (
    <div className={`text-sm ${className}`}>
      <div className="flex items-start gap-2 group">
        <div className="flex-1">{children}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-sky-400 transition-colors mt-0.5"
          aria-label={ariaLabel}
        >
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
