-- Create dream_entries table
CREATE TABLE public.dream_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create dream_tags table
CREATE TABLE public.dream_tags (
  id BIGSERIAL PRIMARY KEY,
  dream_id BIGINT REFERENCES public.dream_entries (id) ON DELETE CASCADE,
  tag TEXT NOT NULL
);

-- Create interpretation_elements table
CREATE TABLE public.interpretation_elements (
  id BIGSERIAL PRIMARY KEY,
  dream_id BIGINT REFERENCES public.dream_entries (id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  meaning TEXT
);

-- Create verses table
CREATE TABLE public.verses (
  id BIGSERIAL PRIMARY KEY,
  verse_reference TEXT NOT NULL,
  content TEXT NOT NULL
);

-- Add Row-Level Security Policies
ALTER TABLE public.dream_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interpretation_elements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_can_access_their_own_dreams"
ON public.dream_entries
FOR ALL
USING (auth.uid() = user_id);