"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      try {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("user", decodeURIComponent(user));
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to parse auth callback:", error);
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent via-accent-secondary to-accent-tertiary">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-white border-t-transparent mx-auto mb-4"></div>
        <p className="text-white font-medium">Signing you in...</p>
      </div>
    </div>
  );
}
