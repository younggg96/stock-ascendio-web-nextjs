"use client";

import { useEffect, useRef } from "react";

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
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Load TradingView script
    const loadTradingViewScript = () => {
      if (scriptLoadedRef.current) return;

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initWidget();
      };
      document.head.appendChild(script);
    };

    const initWidget = () => {
      if (
        containerRef.current &&
        typeof window !== "undefined" &&
        window.TradingView
      ) {
        // Clear previous widget
        containerRef.current.innerHTML = "";

        // Create new widget
        new window.TradingView.widget({
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
          container_id: containerRef.current?.id || "tradingview-widget",
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          studies: ["STD;SMA", "STD;Volume"],
        });
      }
    };

    // Check if script is already loaded
    if (window.TradingView) {
      initWidget();
    } else {
      loadTradingViewScript();
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, theme]);

  return (
    <div className="w-full h-full min-h-[500px]">
      <div
        id="tradingview-widget"
        ref={containerRef}
        className="w-full h-full"
      />
    </div>
  );
}
