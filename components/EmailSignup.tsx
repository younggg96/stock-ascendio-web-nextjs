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
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
        <div className="glow-border rounded-full">
          <div className="flex w-full items-stretch rounded-full h-14 bg-white/5 backdrop-blur-sm">
            <input
              type="email"
              className="flex-1 min-w-0 resize-none overflow-hidden rounded-l-full text-white bg-transparent border-0 focus:ring-0 h-full placeholder:text-white/40 px-6 text-base font-normal focus:outline-none"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="flex min-w-[150px] items-center justify-center rounded-r-full h-14 px-6 bg-primary text-background-dark text-base font-bold tracking-wide hover:bg-primary/90 transition-colors"
            >
              <span>Get Early Access</span>
            </button>
          </div>
        </div>
      </form>
      {message && (
        <p className="text-blue-400 text-sm mt-3 px-6 text-left h-5">
          {message}
        </p>
      )}
    </div>
  );
}
