"use client";

import React, { useEffect, useState } from "react";

// Example placeholders; adjust to your real list of languages/versions
const LANGUAGES = ["en", "es", "fr"];
const BIBLE_VERSIONS = ["KJV", "NIV", "ESV"];

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    preferred_language: "en",
    bible_version: "KJV",
  });
  const [message, setMessage] = useState("");

  // Fetch the user's current profile from GET /api/profiles
  useEffect(() => {
    fetch("/api/profiles", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile({
            preferred_language: data.data.preferred_language || "en",
            bible_version: data.data.bible_version || "KJV",
          });
        } else {
          console.error("Failed to fetch profile:", data.error);
        }
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  // Save changes to the profile using PATCH /api/profiles
  const handleSave = async () => {
    try {
      const res = await fetch("/api/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Settings updated!");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`Request failed: ${error.message}`);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Preferred Language */}
      <div className="mb-4">
        <label htmlFor="language" className="block text-sm font-medium">
          Preferred Language
        </label>
        <select
          id="language"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={profile.preferred_language}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, preferred_language: e.target.value }))
          }
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Bible Version */}
      <div className="mb-4">
        <label htmlFor="bible_version" className="block text-sm font-medium">
          Bible Version
        </label>
        <select
          id="bible_version"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          value={profile.bible_version}
          onChange={(e) =>
            setProfile((prev) => ({ ...prev, bible_version: e.target.value }))
          }
        >
          {BIBLE_VERSIONS.map((version) => (
            <option key={version} value={version}>
              {version}
            </option>
          ))}
        </select>
      </div>

      {/* Success/Error Message */}
      {message && <p className="mb-2 text-sm text-green-600">{message}</p>}

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}