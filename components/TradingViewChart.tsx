"use client";

import { useEffect, useRef, useState } from "react";

interface TradingViewChartProps {
  symbol: string;
  theme?: "light" | "dark";
}

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewChart({
  symbol,
  theme = "dark",
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load TradingView script once
  useEffect(() => {
    // Check if script is already loaded
    if (window.TradingView) {
      setScriptLoaded(true);
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector(
      'script[src="https://s3.tradingview.com/tv.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => setScriptLoaded(true));
      return;
    }

    // Load script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => console.error("Failed to load TradingView script");
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup to allow reuse
    };
  }, []);

  // Initialize/Update widget when script loads or symbol/theme changes
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current || !window.TradingView) {
      return;
    }

    // Destroy previous widget
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
      } catch (e) {
        // Widget might not have a remove method
      }
      widgetRef.current = null;
    }

    // Clear container
    containerRef.current.innerHTML = "";

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (!containerRef.current) return;

      try {
        // Create new widget
        widgetRef.current = new window.TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: "D",
          timezone: "America/New_York",
          theme: theme,
          style: "1",
          locale: "en",
          toolbar_bg: theme === "dark" ? "#1a1d1f" : "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview-widget",
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: ["STD;SMA", "STD;Volume"],
        });
      } catch (error) {
        console.error("Error creating TradingView widget:", error);
      }
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme, scriptLoaded]);

  return (
    <div className="w-full h-full min-h-[500px] relative">
      {!scriptLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-card-dark">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-500 dark:text-white/50">
              Loading chart...
            </p>
          </div>
        </div>
      )}
      <div
        id="tradingview-widget"
        ref={containerRef}
        className="w-full h-full"
      />
    </div>
  );
}
