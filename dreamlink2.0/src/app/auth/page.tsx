'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useSession from '@/lib/utils/use-session';

export default function AuthPage() {
  const router = useRouter();
  const session = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if a session exists
  useEffect(() => {
    if (session) {
      router.push("/main");
    }
  }, [session, router]);

  const handleSignUp = async () => {
    setIsLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Sign-up successful! You can now log in.");
    } else {
      setMessage(`Error: ${data.error}`);
    }
    setIsLoading(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      setMessage("Login successful!");
      // Redirect to main page upon successful login
      router.push("/main");
    } else {
      setMessage(`Error: ${data.error}`);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const res = await fetch("/api/auth/logout", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setMessage("Logged out successfully!");
    } else {
      setMessage(`Error: ${data.error}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            {message && (
              <p className="text-center text-sm text-muted-foreground">
                {message}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleSignUp} disabled={isLoading} variant="outline">
                Sign Up
              </Button>
              <Button onClick={handleLogin} disabled={isLoading}>
                Log In
              </Button>
            </div>
            <Separator className="my-4" />
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              variant="destructive"
              className="w-full"
            >
              Log Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}