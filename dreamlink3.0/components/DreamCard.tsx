"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type DreamEntryProps = {
  empty?: boolean;
  dream?: {
    id: string;
    original_text: string;
    title?: string;
    dream_summary?: string;
    analysis_summary?: string;
    tags?: string[];
    created_at?: string;
  };
};

export default function DreamCard({ empty, dream }: DreamEntryProps) {
  const router = useRouter();

  if (empty) {
    return (
      <div className="border-dashed border-2 border-gray-300 p-8 text-center rounded">
        <p className="text-gray-500">You have no dream entries yet.</p>
        <p className="text-gray-500">Your dream journal entries will appear here.</p>
      </div>
    );
  }

  if (!dream) return null;

  // Format date as DD/MM/YY
  const dateObj = dream.created_at ? new Date(dream.created_at) : null;
  const formattedDate = dateObj
    ? `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${dateObj.getFullYear().toString().slice(-2)}`
    : "";

  // Handle card click to open detail view (to be implemented)
  const handleCardClick = () => {
    router.push(`/dreams/${dream.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border border-gray-200 rounded p-4 shadow-sm bg-white cursor-pointer hover:shadow-md"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">{dream.title}</h2>
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>
      {dream.tags && (
        <div className="mb-2">
          {dream.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 mr-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-500 mb-1">
        <strong>Summary:</strong> {dream.dream_summary}
      </p>
      <p className="text-sm text-gray-500">
        <strong>Analysis:</strong> {dream.analysis_summary}
      </p>
    </div>
  );
}