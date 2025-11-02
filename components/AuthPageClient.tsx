"use client";

import { useState } from "react";
import AuthForm from "@/components/AuthForm";
import AuthLayout from "@/components/AuthLayout";

type AuthMode = "login" | "signup";

export default function AuthPageClient() {
  const [mode, setMode] = useState<AuthMode>("login");

  const title = mode === "login" ? "Welcome Back" : "Create Account";
  const subtitle =
    mode === "login"
      ? "Login to access your investment dashboard"
      : "Join us to start tracking your investments";

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <AuthForm mode={mode} onModeChange={setMode} />
    </AuthLayout>
  );
}
