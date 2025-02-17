// src/app/account/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;
  
    try {
      const res = await fetch("/api/account", {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        // Immediately call your logout endpoint to clear the client-side cookie
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        setMessage("Your account has been deleted. Redirecting to login...");
        router.push("/auth");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`Request failed: ${error.message}`);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6">Account Management</h1>
      <p className="mb-4">
        Manage your account details and delete your account if needed.
      </p>
      {message && <p className="mb-2 text-sm text-green-600">{message}</p>}
      <Button onClick={handleDeleteAccount} variant="destructive">
        Delete Account
      </Button>
    </div>
  );
}