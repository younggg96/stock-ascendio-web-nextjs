"use client";

import { useState, FormEvent } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter a valid email address");
      return;
    }

    // Simulate API call
    setIsSubmitted(true);
    setMessage("This email is already on our list. We'll keep you updated!");

    // In a real application, you would send this to your backend
    // try {
    //   const response = await fetch('/api/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await response.json();
    //   setMessage(data.message);
    // } catch (error) {
    //   setMessage("Something went wrong. Please try again.");
    // }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        {/* Mobile: Separate input and button */}
        <div className="flex flex-col gap-3 sm:hidden">
          <div className="glow-border rounded-full">
            <input
              type="email"
              className="w-full h-12 rounded-full text-white bg-white/5 backdrop-blur-sm border-0 focus:ring-0 placeholder:text-white/40 px-5 text-sm font-normal focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 rounded-full bg-primary text-background-dark text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors"
          >
            Get Early Access
          </button>
        </div>

        {/* Tablet & Desktop: Combined input and button */}
        <div className="hidden sm:block glow-border rounded-full">
          <div className="flex w-full items-stretch rounded-full h-12 md:h-14 bg-white/5 backdrop-blur-sm">
            <input
              type="email"
              className="flex-1 min-w-0 resize-none overflow-hidden rounded-l-full text-white bg-transparent border-0 focus:ring-0 placeholder:text-white/40 px-5 md:px-6 text-sm md:text-base font-normal focus:outline-none"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="flex min-w-[140px] md:min-w-[150px] items-center justify-center rounded-r-full px-5 md:px-6 bg-primary text-background-dark text-sm md:text-base font-bold tracking-wide hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Get Early Access
            </button>
          </div>
        </div>
      </form>
      {message && (
        <p className="text-blue-400 text-xs sm:text-sm mt-3 text-center sm:text-left min-h-[20px]">
          {message}
        </p>
      )}
    </div>
  );
}
