import { Metadata } from "next";
import ForgotPasswordPageClient from "@/components/ForgotPasswordPageClient";

export const metadata: Metadata = {
  title: "Forgot Password | Stock Ascendio",
  description:
    "Reset your password to regain access to your investment dashboard",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordPageClient />;
}
