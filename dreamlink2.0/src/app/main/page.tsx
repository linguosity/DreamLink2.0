"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabaseClient"; // Ensure this is your initialized client
import { RealtimeChannel } from '@supabase/supabase-js';
import HeaderMenu from "@/components/layout/HeaderMenu"; 

interface Dream {
  id: number;
  date: string;
  title: string;
  description: string;
  tags: string[];
}

export default function MainPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [dreams, setDreams] = useState<Dream[]>([]);

  // Function to fetch dreams from the database
  const fetchDreams = async () => {
    const { data, error } = await supabase.from("dream_entries").select("*");
    if (error) {
      console.error("Error fetching dreams:", error);
    } else if (data) {
      setDreams(data as Dream[]);
    }
  };

  useEffect(() => {
    // Ensure we call supabase.channel() rather than supabase.from()
    const channel = supabase.channel("realtime:public:dream_entries") as RealtimeChannel;
    channel
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dream_entries" },
        (payload) => {
          console.log("Realtime change received:", payload);
          fetchDreams();
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter dreams based on the search query
  const filteredDreams = dreams.filter((dream) =>
    dream.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-900 p-4">
      {/* Header */}
      <HeaderMenu />

      {/* Dream Submission Box */}
      <section className="my-6">
        <div className="flex space-x-2">
          <Input placeholder="Share your dream journey..." className="flex-1" />
          <Button variant="default" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10l9-9 9 9M9 21V9h6v12"
              />
            </svg>
            Send
          </Button>
          <Button variant="outline" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6"
              />
            </svg>
          </Button>
        </div>
      </section>

      {/* Dream Search & Filters */}
      <section className="my-6">
        <div className="flex space-x-2">
          <Input
            placeholder="Search dreams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            All Tags
          </Button>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Dream Entries (Grid Layout) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDreams.length > 0 ? (
          filteredDreams.map((dream) => (
            <Card key={dream.id} className="p-4">
              <p className="text-sm italic text-gray-500">{dream.date}</p>
              <h2 className="text-xl font-bold">{dream.title}</h2>
              <p className="text-base my-2">{dream.description}</p>
              <div className="flex space-x-1 mt-2">
                {dream.tags.map((tag, idx) => (
                  <Badge key={idx} className="cursor-pointer">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </Card>
          ))
        ) : (
          // Ghost CTA card when no dreams exist
          <Card className="p-4 border-dashed border-2 border-gray-500 bg-gray-800 text-gray-400 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-2">No Dreams Yet</h2>
            <p className="mb-4">Start by creating your first dream analysis card!</p>
            <Button onClick={() => router.push("/create-dream")}>
              Create Dream Analysis
            </Button>
          </Card>
        )}
      </section>
    </div>
  );
}