"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface FinancialJuiceNewsProps {
  width?: string;
  height?: string;
}

export default function FinancialJuiceNews({
  width = "100%",
  height = "600px",
}: FinancialJuiceNewsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const widgetInitialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 防止重复初始化
    if (widgetInitialized.current) return;

    const initWidget = () => {
      // 检查是否已经加载了脚本
      if (document.getElementById("FJ-Widgets")) {
        // 如果脚本已存在，直接初始化
        if (window.FJWidgets && containerRef.current) {
          initializeWidget();
        }
        return;
      }

      // 创建脚本
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.id = "FJ-Widgets";
      const r = Math.floor(Math.random() * (9999 - 0 + 1) + 0);
      script.src = `https://feed.financialjuice.com/widgets/widgets.js?r=${r}`;

      script.onload = () => {
        initializeWidget();
      };

      script.onerror = () => {
        console.error("Failed to load FinancialJuice widget script");
        setError(true);
        setLoading(false);
      };

      document.head.appendChild(script);
    };

    const initializeWidget = () => {
      if (!window.FJWidgets || !containerRef.current) return;

      const isDark = resolvedTheme === "dark";

      const options = {
        container: containerRef.current.id,
        mode: isDark ? "Dark" : "Light",
        width: width,
        height: height,
        backColor: isDark ? "0f172a" : "f8fafc",
        fontColor: isDark ? "e2e8f0" : "334155",
        widgetType: "NEWS",
      };

      try {
        new window.FJWidgets.createWidget(options);
        widgetInitialized.current = true;
        setLoading(false);
      } catch (error) {
        console.error("Error initializing FinancialJuice widget:", error);
        setError(true);
        setLoading(false);
      }
    };

    // 延迟初始化以确保主题已加载
    const timer = setTimeout(() => {
      initWidget();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [width, height, resolvedTheme]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-white/50">
            Failed to load news feed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 z-10 rounded-lg p-4 space-y-3">
          {/* Skeleton Loading */}
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse flex gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        id="financialjuice-news-widget-container"
        ref={containerRef}
        className="w-full h-full rounded-lg overflow-hidden [&_iframe]:rounded-lg"
        style={{ minHeight: height }}
      />
      <style jsx global>{`
        #financialjuice-news-widget-container {
          border-radius: 0.5rem;
        }
        #financialjuice-news-widget-container iframe {
          border-radius: 0.5rem;
          border: none !important;
        }
        #financialjuice-news-widget-container * {
          font-family: inherit !important;
        }
      `}</style>
    </div>
  );
}

// 扩展 Window 接口以支持 FJWidgets
declare global {
  interface Window {
    FJWidgets?: {
      createWidget: new (options: {
        container: string;
        mode: string;
        width: string;
        height: string;
        backColor: string;
        fontColor: string;
        widgetType: string;
      }) => void;
    };
  }
}
