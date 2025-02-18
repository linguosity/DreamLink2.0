"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import HeaderMenu from "@/components/layout/HeaderMenu";
import { supabase } from "@/lib/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";
import DreamCard from "@/components/ui/dream_card";
// Import your DreamAnalysis types (make sure this file exports a type that matches your DB result)
import { DreamAnalysisData } from "@/types/dreamAnalysis";

// Define the shape of the dream object based on your DB schema.
export interface Dream {
  id: number;
  created_at: string;
  analysis: DreamAnalysisData;
}

export default function MainPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [dreams, setDreams] = useState<Dream[]>([]);

  // Function to fetch dreams from the database
  const fetchDreams = async () => {
    console.log("[MainPage] Fetching dreams from dream_entries...");
    const { data, error } = await supabase
      .from("dream_entries")
      .select("id, created_at, analysis");
    if (error) {
      console.error("Error fetching dreams:", error);
    } else if (data) {
      console.log("[MainPage] Dreams fetched:", data);
      setDreams(data as Dream[]);
    } else {
      console.log("[MainPage] No data returned from fetchDreams.");
    }
  };

  useEffect(() => {
    console.log("document.cookie:", document.cookie);
  }, []);

  // Log the current session JWT for debugging
  useEffect(() => {
    const initSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("[MainPage] Error retrieving session:", error);
      } else {
        console.log("[MainPage] Current session JWT:", session?.access_token);
      }
    };
    initSession();
  }, []);

  // Set up realtime subscription for the "dream_entries" table
  useEffect(() => {
    console.log("[MainPage] Setting up realtime channel for dream_entries...");
    let debounceTimeout: NodeJS.Timeout;

    // Create the realtime channel
    const channel: RealtimeChannel = supabase.channel("realtime:public:dream_entries");
    console.log("[MainPage] Channel created:", channel);

    // Subscribe to channel status changes
    channel.subscribe((status) => {
      console.log("[MainPage] Channel subscription status:", status);
      if (status === "SUBSCRIBED") {
        console.log("[MainPage] Realtime channel is fully subscribed.");
      }
    });

    // Listen for changes on the "dream_entries" table
    channel.on(
      "postgres_changes",
      { event: "*", schema: "public", table: "dream_entries" },
      (payload) => {
        console.log("[MainPage] Realtime change received:", payload);
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          fetchDreams();
        }, 300);
      }
    );

    // Initial fetch so we have data when the component mounts
    fetchDreams();

    // Cleanup on unmount
    return () => {
      console.log("[MainPage] Cleaning up realtime channel...");
      clearTimeout(debounceTimeout);
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter dreams based on search query (using analysis.title)
  const filteredDreams = dreams.filter((dream) =>
    dream.analysis.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("[MainPage] Dreams state:", dreams);
  console.log("[MainPage] Filtered dreams:", filteredDreams);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-900 p-4">
      <HeaderMenu />

      {/* Dream Search & Filters */}
      <section className="my-6">
        <div className="flex space-x-2">
          <Input
            placeholder="Search dreams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline">All Tags</Button>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Dream Entries (Grid Layout) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDreams.length > 0 ? (
          filteredDreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-4 border-dashed border-2 border-gray-500 bg-gray-800 text-gray-400">
            <h2 className="text-xl font-bold mb-2">No Dreams Yet</h2>
            <p className="mb-4">Start by creating your first dream analysis card!</p>
            <Button onClick={() => router.push("/create-dream")}>
              Create Dream Analysis
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}