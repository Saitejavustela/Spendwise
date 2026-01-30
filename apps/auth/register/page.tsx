"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      router.push("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent via-accent-secondary to-accent-tertiary p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-card/95 shadow-2xl border border-border/20">
          {/* Logo/Brand */}
          <div className="flex flex-col items-center p-8 pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-accent to-accent-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-3xl">💰</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">SpendWise</h1>
            <p className="text-muted-foreground mt-2 text-sm">Create your account</p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-8 space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="w-full"
                  disabled={isLoading}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full"
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="w-full"
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              {/* Register Button */}
              <Button className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-accent hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 px-8 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
