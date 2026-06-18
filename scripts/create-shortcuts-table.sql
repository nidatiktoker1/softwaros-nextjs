-- Create shortcuts table for storing keyboard shortcuts per tool
-- Run this in Supabase SQL Editor

BEGIN;

CREATE TABLE IF NOT EXISTS shortcuts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  action TEXT NOT NULL,
  keys_windows TEXT,
  keys_mac TEXT,
  keys_iphone TEXT,
  keys_android TEXT,
  category TEXT DEFAULT 'General',
  difficulty TEXT DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster lookups by tool
CREATE INDEX IF NOT EXISTS idx_shortcuts_tool_slug ON shortcuts(tool_slug);

-- Enable Row Level Security
ALTER TABLE shortcuts ENABLE ROW LEVEL SECURITY;

-- Public read policy for anonymous users (RLS)
CREATE POLICY "Allow public read" ON shortcuts FOR SELECT TO anon USING (true);

COMMIT;
