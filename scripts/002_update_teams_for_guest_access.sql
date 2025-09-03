-- Update teams table to allow guest users (no authentication required for joining)
-- Only session creation requires authentication

-- Drop the existing foreign key constraint on user_id
ALTER TABLE teams DROP CONSTRAINT IF EXISTS teams_user_id_fkey;

-- Make user_id nullable to allow guest teams
ALTER TABLE teams ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow guest team creation
DROP POLICY IF EXISTS "Authenticated users can create teams" ON teams;
DROP POLICY IF EXISTS "Team owners can update own teams" ON teams;
DROP POLICY IF EXISTS "Team owners can delete own teams" ON teams;

-- Allow anyone to create teams (guests can join)
CREATE POLICY "Anyone can create teams" ON teams FOR INSERT WITH CHECK (true);

-- Allow team updates by either authenticated user or by session (for guest teams)
CREATE POLICY "Teams can be updated" ON teams FOR UPDATE USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- Allow team deletion by either authenticated user or by session (for guest teams)
CREATE POLICY "Teams can be deleted" ON teams FOR DELETE USING (
  auth.uid() = user_id OR user_id IS NULL
);
