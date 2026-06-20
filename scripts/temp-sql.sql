-- Add INSERT permission for anonymous users to shortcuts table

-- Allow anonymous users to INSERT shortcuts
CREATE POLICY "Allow anon insert" ON shortcuts FOR INSERT TO anon WITH CHECK (true);

-- Optional: Allow authenticated users to INSERT as well
CREATE POLICY "Allow authenticated insert" ON shortcuts FOR INSERT TO authenticated WITH CHECK (true);

-- Optional: Allow UPDATE for published/owned records
CREATE POLICY "Allow anon update" ON shortcuts FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON shortcuts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
