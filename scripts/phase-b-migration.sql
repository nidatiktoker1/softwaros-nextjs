-- Phase B: Add entity_type column to tools table
-- This allows the tools table to support multiple entity types (software, service, etc.)
-- Run this in Supabase SQL Editor

BEGIN;

-- Add entity_type column with default value
ALTER TABLE tools ADD COLUMN IF NOT EXISTS entity_type text DEFAULT 'software';

-- Update all existing rows to have entity_type = 'software'
UPDATE tools SET entity_type = 'software' WHERE entity_type IS NULL;

-- Add a check constraint to ensure valid entity types
ALTER TABLE tools ADD CONSTRAINT check_entity_type CHECK (entity_type IN ('software', 'service', 'template', 'plugin'));

-- Add index for faster queries by entity_type
CREATE INDEX IF NOT EXISTS idx_tools_entity_type ON tools(entity_type);

COMMIT;
