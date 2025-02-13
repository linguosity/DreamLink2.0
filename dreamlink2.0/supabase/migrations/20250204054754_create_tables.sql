CREATE TABLE public.dream_entries (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  summary TEXT,
  image_url TEXT
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  preferred_language TEXT DEFAULT 'en',
  bible_version TEXT DEFAULT 'KJV',
  color_analysis BOOLEAN DEFAULT TRUE,
  grammar_analysis BOOLEAN DEFAULT FALSE,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);