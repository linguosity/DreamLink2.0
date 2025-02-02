-- Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  preferred_language TEXT DEFAULT 'en', -- Defaults to English
  bible_version TEXT DEFAULT 'KJV', -- Defaults to King James Version
  color_analysis BOOLEAN DEFAULT TRUE,
  gematria_analysis BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  display_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Dream Entries Table Updates
ALTER TABLE public.dream_entries
ADD COLUMN summary TEXT,
ADD COLUMN image_url TEXT;

-- Languages Table
CREATE TABLE public.languages (
  code TEXT PRIMARY KEY, -- Language code (e.g., "en", "es")
  name TEXT NOT NULL -- Language name (e.g., "English", "Spanish")
);
INSERT INTO public.languages (code, name) VALUES ('en', 'English'), ('es', 'Spanish');

-- Bible Versions Table
CREATE TABLE public.bible_versions (
  id SERIAL PRIMARY KEY,
  version_code TEXT UNIQUE NOT NULL, -- Short code for the version (e.g., "KJV", "NIV")
  name TEXT NOT NULL -- Full name of the version
);
INSERT INTO public.bible_versions (version_code, name) VALUES ('KJV', 'King James Version'), ('NIV', 'New International Version');
