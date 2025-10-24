"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Sparkles, Languages } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TweetMedia from "./TweetMedia";

interface TweetContentProps {
  fullText: string;
  tweetUrl: string;
  tweetId: string;
  mediaUrls: string[];
  onFormatText: (text: string) => React.ReactNode;
}

export default function TweetContent({
  fullText,
  tweetUrl,
  tweetId,
  mediaUrls,
  onFormatText,
}: TweetContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [iframeHeight, setIframeHeight] = useState<number>(500);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Detect theme on mount and listen for changes
  useEffect(() => {
    // Check if dark mode is active
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    // Create observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setTheme(isDark ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Listen for iframe resize messages from Twitter
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Twitter sends messages with height updates
      if (event.origin === "https://platform.twitter.com") {
        try {
          const data = JSON.parse(event.data);
          if (data.height) {
            setIframeHeight(data.height);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Generate AI summary (placeholder - you can integrate real AI later)
  const generateSummary = (text: string) => {
    return text;
  };

  // Generate AI analysis (placeholder - you can integrate real AI later)
  const generateAnalysis = (text: string) => {
    // Check for stock symbols and sentiment
    const hasStockSymbols = /\$[A-Z]+/.test(text);
    const hasBullishWords = /(bullish|up|gain|breakout|rally)/i.test(text);
    const hasBearishWords = /(bearish|down|loss|correction|fall)/i.test(text);

    if (hasStockSymbols) {
      if (hasBullishWords) {
        return {
          sentiment: "bullish",
          text: "The tweet mentions stock symbols with positive sentiment, expressing optimistic market outlook and potential upward movement.",
        };
      } else if (hasBearishWords) {
        return {
          sentiment: "bearish",
          text: "The tweet mentions stock symbols with cautious sentiment, indicating potential downward pressure or market concerns.",
        };
      } else {
        return {
          sentiment: "neutral",
          text: "The tweet discusses stock symbols with neutral sentiment, maintaining an objective analytical perspective on market conditions.",
        };
      }
    }
    return {
      sentiment: "neutral",
      text: "This tweet contains market-related discussion. Consider combining with other information sources for comprehensive analysis.",
    };
  };

  const summary = generateSummary(fullText);
  const analysisResult = generateAnalysis(fullText);
  const truncatedText =
    fullText.length > 80 ? fullText.substring(0, 80) + "..." : fullText;
  const needsTruncation = fullText.length > 80;

  // Handle translation
  const handleTranslate = async () => {
    if (isTranslated) {
      // If already translated, toggle back to original
      setIsTranslated(false);
      return;
    }

    if (translatedText) {
      // If we already have a translation cached, just show it
      setIsTranslated(true);
      return;
    }

    // Otherwise, fetch translation
    setIsTranslating(true);
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(
          analysisResult.text
        )}`
      );
      const data = await response.json();
      const translated = data[0].map((item: any[]) => item[0]).join("");
      setTranslatedText(translated);
      setIsTranslated(true);
    } catch (error) {
      console.error("Translation failed:", error);
      // Fallback: show a simple message
      setTranslatedText("翻译失败，请稍后重试。");
      setIsTranslated(true);
    } finally {
      setIsTranslating(false);
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return (
          <div className="ml-3 rounded px-2 py-0.5 text-xs font-medium bg-green-500/20 text-green-500 flex items-center gap-1">
            Bullish <div className="w-1 h-1 bg-green-500 rounded-full"></div>
          </div>
        );
      case "bearish":
        return (
          <div className="ml-3 rounded px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-500 flex items-center gap-1">
            Bearish
            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
          </div>
        );
      default:
        return (
          <div className="ml-3 rounded px-2 py-0.5 text-xs font-medium bg-gray-500/20 text-gray-500 flex items-center gap-1">
            Neutral
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          </div>
        );
    }
  };

  return (
    <>
      <div className="space-y-2 mb-3">
        {/* 推文简述 */}
        <div className="text-xs text-gray-600 dark:text-white/60">
          Summary: {summary}
        </div>

        {/* 推文原文 - 可点击展开/收起 */}
        <div className="text-sm">
          <div className="flex items-start gap-2 group">
            <div
              onClick={() => needsTruncation && setIsExpanded(!isExpanded)}
              className={`flex-1 text-gray-700 dark:text-white/90 leading-relaxed ${
                needsTruncation ? "cursor-pointer hover:text-sky-400" : ""
              } transition-colors`}
            >
              {isExpanded ? (
                <span className="whitespace-pre-wrap">
                  {onFormatText(fullText)}
                </span>
              ) : (
                <span>
                  {onFormatText(needsTruncation ? truncatedText : fullText)}
                  {needsTruncation && (
                    <span className="text-sky-200 hover:text-sky-400 transition-colors">
                      {" "}
                      more
                    </span>
                  )}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-sky-400 transition-colors mt-0.5"
              aria-label="Open tweet in modal"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* AI分析 */}
        <div className="mt-3 rounded-lg bg-gray-50 dark:bg-white/5 p-1.5">
          <div className="mb-1.5 flex items-center gap-2">
            <div className="flex flex-1 items-center">
              <Sparkles className="w-3 h-3 text-primary mr-2" />
              <h4 className="font-semibold text-xs text-gray-900 dark:text-white">
                AI Analysis
              </h4>
              {getSentimentBadge(analysisResult.sentiment)}
            </div>
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className={`flex items-center gap-1 text-xs transition-colors ${
                isTranslated
                  ? "text-primary"
                  : "text-gray-600 dark:text-gray-400 hover:text-primary"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isTranslated ? "显示原文" : "翻译"}
            >
              <Languages
                className={`w-3 h-3 ${isTranslating ? "animate-pulse" : ""}`}
              />
            </button>
          </div>
          <div className="mb-0">
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              {isTranslating ? (
                <span className="text-gray-500 dark:text-gray-400">
                  翻译中...
                </span>
              ) : isTranslated && translatedText ? (
                translatedText
              ) : (
                analysisResult.text
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Twitter Embed Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[600px] w-[95vw] max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-card-dark rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-gray-900 dark:text-white">
              Tweet Details
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-4 bg-white dark:bg-card-dark rounded-2xl">
            {/* Twitter iframe 嵌入 - 带主题支持 */}
            <iframe
              key={theme}
              src={`https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=${theme}`}
              width="100%"
              height={iframeHeight}
              frameBorder="0"
              className="rounded-xl bg-white dark:bg-card-dark"
              style={{
                border: "none",
              }}
            />

            {/* 外部链接 */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                View on X
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
