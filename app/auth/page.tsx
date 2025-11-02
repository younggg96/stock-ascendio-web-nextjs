import { Metadata } from "next";
import AuthPageClient from "@/components/AuthPageClient";

export const metadata: Metadata = {
  title: "Authentication | Ascendio AI",
  description:
    "Welcome to Ascendio AI. Login to access your investment dashboard and track your portfolio performance",
};

export default function AuthPage() {
  return <AuthPageClient />;
}
