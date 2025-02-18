// src/types/dreamAnalysis.ts

import { z } from 'zod';

/**
 * Represents the JSON stored in the "analysis" column.
 */
export interface DreamAnalysisData {
  title: string;
  original_dream: string;
  tags: {
    bible: string;
    language: string;
    bible_book: string;
    general_theme: string[];
  };
  analysis: {
    topic_sentence: string;
    supporting_points: Array<{
      point: string;
      citation: string;
      bible_quote: string;
      additional: string;
    }>;
  };
}

/**
 * Represents a complete Dream Analysis record,
 * combining the core dream entry data and its analysis.
 */
export interface DreamAnalysis {
  dream_entry: {
    id: number;
    created_at: string;
    // Optionally include other columns (like user_id or dream_analysis_id) if needed
  };
  analysis: DreamAnalysisData;
}

/**
 * Represents a row in the "dream_entries" table.
 * This matches your DB schema.
 */
export interface Dream {
  id: number;
  created_at: string;
  analysis: DreamAnalysisData;
}

/**
 * Zod schema to validate the analysis JSON stored in the "analysis" column.
 * This reflects the structure stored in that column.
 */
export const dreamAnalysisSchema = z.object({
  title: z.string(), // a short title for the analysis
  original_dream: z.string(), // the original dream text
  tags: z.object({
    bible: z.string(),
    language: z.string(),
    bible_book: z.string(),
    general_theme: z.array(z.string()),
  }),
  analysis: z.object({
    topic_sentence: z.string(),
    supporting_points: z.array(
      z.object({
        point: z.string(),
        citation: z.string(),
        bible_quote: z.string(),
        additional: z.string(),
      })
    ),
  }),
  // Optional timestamps (if you store these in the JSON)
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});