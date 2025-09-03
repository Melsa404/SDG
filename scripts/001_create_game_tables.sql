-- Create game sessions and teams tables for multi-device support
-- Enable Row Level Security for all tables

-- Game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  max_teams INTEGER DEFAULT 8,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view sessions (for joining)
CREATE POLICY "Anyone can view sessions" ON game_sessions FOR SELECT USING (true);

-- Allow authenticated users to create sessions
CREATE POLICY "Authenticated users can create sessions" ON game_sessions FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Allow session creators to update their sessions
CREATE POLICY "Session creators can update sessions" ON game_sessions FOR UPDATE 
USING (auth.uid() = created_by);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(session_id, name)
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view teams in any session (for leaderboard)
CREATE POLICY "Anyone can view teams" ON teams FOR SELECT USING (true);

-- Allow authenticated users to create teams
CREATE POLICY "Authenticated users can create teams" ON teams FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow team owners to update their own teams
CREATE POLICY "Team owners can update own teams" ON teams FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow team owners to delete their own teams
CREATE POLICY "Team owners can delete own teams" ON teams FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_session_id ON teams(session_id);
CREATE INDEX IF NOT EXISTS idx_teams_score ON teams(score DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON game_sessions(created_at DESC);
