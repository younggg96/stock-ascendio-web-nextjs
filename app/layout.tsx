import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ascendio - Investment Platform",
  description:
    "The Future of Investing is Here. Sign up for early access or updates.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Ascendio - Investment Platform",
    description: "The Future of Investing is Here",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ascendio - Investment Platform",
    description: "The Future of Investing is Here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
