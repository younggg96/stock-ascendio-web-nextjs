"use client";

import { useState, FormEvent, useEffect } from "react";

// Country options with language mapping
const countries = [
  { code: "US", flag: "🇺🇸", language: "en" },
  { code: "CN", flag: "🇨🇳", language: "zh" },
  { code: "JP", flag: "🇯🇵", language: "ja" },
  { code: "KR", flag: "🇰🇷", language: "ko" },
  { code: "GB", flag: "🇬🇧", language: "en" },
  { code: "CA", flag: "🇨🇦", language: "en" },
  { code: "AU", flag: "🇦🇺", language: "en" },
  { code: "DE", flag: "🇩🇪", language: "de" },
  { code: "FR", flag: "🇫🇷", language: "fr" },
  { code: "ES", flag: "🇪🇸", language: "es" },
  { code: "IT", flag: "🇮🇹", language: "it" },
  { code: "BR", flag: "🇧🇷", language: "pt" },
  { code: "MX", flag: "🇲🇽", language: "es" },
  { code: "IN", flag: "🇮🇳", language: "en" },
  { code: "SG", flag: "🇸🇬", language: "en" },
  { code: "HK", flag: "🇭🇰", language: "zh" },
  { code: "TW", flag: "🇹🇼", language: "zh" },
];

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("US");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detect system country/region on mount
  useEffect(() => {
    const locale = navigator.language; // e.g., "en-US", "zh-CN"
    const countryCode = locale.split("-")[1]?.toUpperCase();

    // Check if detected country is in our list
    const supportedCountryCodes = countries.map((c) => c.code);
    if (countryCode && supportedCountryCodes.includes(countryCode)) {
      setCountry(countryCode);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Invalid email format");
      setMessageType("error");
      return;
    }

    // Get language from selected country
    const selectedCountry = countries.find((c) => c.code === country);
    const language = selectedCountry?.language || "en";

    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          language,
          isActive: "true",
        }),
      });

      if (response.ok) {
        setMessage("✓ Success! We'll keep you updated.");
        setMessageType("success");
        setEmail("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage(
          `✕ Failed: ${errorData.message || "Please try again later"}`
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("✕ Network error. Please try again.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        {/* Mobile: Separate input and button */}
        <div className="flex flex-col gap-3 sm:hidden">
          <div className="glow-border rounded-full">
            <div className="flex items-center gap-2 h-12 bg-white/5 backdrop-blur-sm rounded-full">
              {/* Country Flag Selector - Circular */}
              <div className="relative flex-shrink-0 ml-3 flex items-center">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="appearance-none bg-transparent text-xl cursor-pointer focus:outline-none"
                  style={{
                    border: "none",
                    padding: 0,
                    lineHeight: "1",
                    height: "24px",
                  }}
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="email"
                className="flex-1 h-full rounded-full text-white bg-transparent border-0 focus:ring-0 placeholder:text-white/40 pr-5 text-sm font-normal focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-primary text-background-dark text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Get Early Access"}
          </button>
        </div>

        {/* Tablet & Desktop: Combined input and button */}
        <div className="hidden sm:block glow-border rounded-full">
          <div className="flex w-full items-center rounded-full h-12 md:h-14 bg-white/5 backdrop-blur-sm">
            {/* Country Flag Selector - Circular */}
            <div className="relative h-full flex-shrink-0 my-4 md:ml-4 flex items-center">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="appearance-none bg-transparent text-xl md:text-2xl cursor-pointer focus:outline-none"
                style={{
                  border: "none",
                  padding: 0,
                  lineHeight: "1",
                  height: "28px",
                }}
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="email"
              className="flex-1 h-full min-w-0 text-white bg-transparent border-0 focus:ring-0 placeholder:text-white/40 px-1 md:px-2 text-sm md:text-base font-normal focus:outline-none"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-full min-w-[140px] md:min-w-[150px] items-center justify-center rounded-r-full px-5 md:px-6 bg-primary text-background-dark text-sm md:text-base font-bold tracking-wide hover:bg-primary/90 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Get Early Access"}
            </button>
          </div>
        </div>
      </form>
      {message && (
        <p
          className={`text-xs sm:text-sm mt-3 text-center sm:text-left min-h-[20px] ${
            messageType === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
