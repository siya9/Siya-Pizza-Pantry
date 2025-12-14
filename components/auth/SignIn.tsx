"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, LogIn } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const hasRedirected = useRef(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoadingSubmit(true);
    hasRedirected.current = false;

    try {
      const success = await login(email, password);
      if (success) {
        // Small delay to ensure React processes the state update
        // Then navigate - this prevents the infinite loading issue
        setTimeout(() => {
          hasRedirected.current = true;
          router.replace("/dashboard");
        }, 100);
      } else {
        setError("Invalid email or password");
        setIsLoadingSubmit(false);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoadingSubmit(false);
    }
  };

  // Show loading state only while checking initial auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground">
              <Package className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Pizza Pantry</CardTitle>
          <CardDescription>Sign in to manage your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@pizzapantry.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoadingSubmit}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoadingSubmit}
              />
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Demo credentials:</p>
              <p>• admin@pizzapantry.com / admin123</p>
              <p>• staff@pizzapantry.com / staff123</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoadingSubmit}>
              <LogIn className="mr-2 h-4 w-4" />
              {isLoadingSubmit ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
              <Link href="/sign-up" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

