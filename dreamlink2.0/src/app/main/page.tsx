'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Dream {
  id: number;
  date: string;
  title: string;
  description: string;
  tags: string[];
}

const dummyDreams: Dream[] = [
  {
    id: 1,
    date: 'February 2, 2025',
    title: 'Dream Title 1',
    description: 'A short summary of what the dream may mean.',
    tags: ['Tree of Life', 'en'],
  },
  {
    id: 2,
    date: 'February 2, 2025',
    title: 'Dream Title 2',
    description: 'Another interpretation summary.',
    tags: ['Nightmare', 'en'],
  },
];

export default function MainPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-900 p-4">
      {/* Header */}
      <header className="flex justify-between items-center pb-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white">Dreamlink</h1>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex justify-center items-center text-white">
            B
          </div>
        </div>
      </header>

      {/* Dream Submission Box */}
      <section className="my-6">
        <div className="flex space-x-2">
          <Input placeholder="Share your dream journey..." className="flex-1" />
          <Button variant="default" className="flex items-center">
            {/* Paper plane icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-9 9 9M9 21V9h6v12" />
            </svg>
            Send
          </Button>
          <Button variant="outline" className="flex items-center">
            {/* Fullscreen toggle icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6" />
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
            {/* Search Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            All Tags
          </Button>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Dream Entries (Grid Layout) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyDreams.map((dream) => (
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
        ))}
      </section>
    </div>
  );
}