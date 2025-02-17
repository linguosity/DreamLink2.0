// Header Menu Component (e.g., in MainPage.tsx)
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function HeaderMenu() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      router.push("/auth");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="flex justify-between items-center pb-4 border-b border-gray-700">
      <h1 className="text-3xl font-bold text-white">Dreamlink</h1>
      {/* User Avatar + Dropdown Menu */}
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full bg-primary flex justify-center items-center text-white cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          B
        </div>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-10">
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setMenuOpen(false);
                router.push("/account"); // Navigate to the account page
              }}
            >
              Account
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setMenuOpen(false);
                router.push("/settings");
              }}
            >
              Settings
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setMenuOpen(false);
                handleSignOut();
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}