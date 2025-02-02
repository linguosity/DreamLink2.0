-- Create a table to store the detailed analysis for each dream entry.
CREATE TABLE public.dream_analysis (
  id BIGSERIAL PRIMARY KEY,
  dream_entry_id BIGINT REFERENCES public.dream_entries(id) ON DELETE CASCADE,
  tags JSONB,  -- Stores an object with bible, language, bible_book, and general_theme
  topic_sentence TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Create a table to store the supporting points for each dream analysis.
CREATE TABLE public.supporting_points (
  id BIGSERIAL PRIMARY KEY,
  dream_analysis_id BIGINT REFERENCES public.dream_analysis(id) ON DELETE CASCADE,
  point TEXT NOT NULL,
  citation TEXT NOT NULL,
  bible_quote TEXT NOT NULL,
  additional TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);