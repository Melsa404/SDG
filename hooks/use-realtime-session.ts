"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

interface Team {
  id: string
  name: string
  score: number
  badges: string[]
  joined_at: string
  user_id: string | null // Allow null for guest users
}

interface GameSession {
  id: string
  name: string
  created_at: string
  max_teams: number
  created_by: string
  teams: Team[]
}

interface SessionUpdate {
  type: "badge_earned" | "score_updated" | "team_joined"
  teamName: string
  data: any
  timestamp: number
}

export function useRealtimeSession(sessionId: string | null, currentTeamName: string) {
  const [session, setSession] = useState<GameSession | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [recentUpdates, setRecentUpdates] = useState<SessionUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const previousTeamsRef = useRef<Team[]>([])
  const supabase = createClient()

  const loadSessionData = useCallback(async () => {
    if (!sessionId) return null

    try {
      const { data: sessionData, error } = await supabase
        .from("game_sessions")
        .select(`
          *,
          teams (*)
        `)
        .eq("id", sessionId)
        .single()

      if (error || !sessionData) {
        setIsConnected(false)
        return null
      }

      setSession(sessionData)

      const previousTeams = previousTeamsRef.current
      if (previousTeams.length > 0) {
        const updates: SessionUpdate[] = []

        sessionData.teams.forEach((newTeam: Team) => {
          const oldTeam = previousTeams.find((t) => t.name === newTeam.name)

          if (!oldTeam && newTeam.name !== currentTeamName) {
            // New team joined
            updates.push({
              type: "team_joined",
              teamName: newTeam.name,
              data: { teamName: newTeam.name },
              timestamp: Date.now(),
            })
          } else if (oldTeam && newTeam.name !== currentTeamName) {
            // Check for new badges
            const newBadges = newTeam.badges.filter((badge) => !oldTeam.badges.includes(badge))
            newBadges.forEach((badge) => {
              updates.push({
                type: "badge_earned",
                teamName: newTeam.name,
                data: { badge },
                timestamp: Date.now(),
              })
            })

            // Check for score updates
            if (newTeam.score > oldTeam.score) {
              updates.push({
                type: "score_updated",
                teamName: newTeam.name,
                data: { oldScore: oldTeam.score, newScore: newTeam.score },
                timestamp: Date.now(),
              })
            }
          }
        })

        if (updates.length > 0) {
          setRecentUpdates((prev) => [...updates, ...prev].slice(0, 10))
        }
      }

      const sortedTeams = sessionData.teams.sort((a: Team, b: Team) => b.score - a.score)
      setTeams(sortedTeams)
      previousTeamsRef.current = sortedTeams
      setIsConnected(true)
      return sessionData
    } catch (error) {
      console.error("Error loading session data:", error)
      setIsConnected(false)
      return null
    }
  }, [sessionId, currentTeamName, supabase])

  const updateTeamData = useCallback(
    async (teamName: string, score: number, badges: string[]) => {
      if (!sessionId) return

      try {
        const { error } = await supabase
          .from("teams")
          .update({ score, badges })
          .eq("session_id", sessionId)
          .eq("name", teamName)

        if (error) {
          console.error("Error updating team data:", error)
          return
        }

        // Trigger immediate refresh
        setTimeout(loadSessionData, 100)
      } catch (error) {
        console.error("Error updating team data:", error)
      }
    },
    [sessionId, loadSessionData, supabase],
  )

  const clearRecentUpdates = useCallback(() => {
    setRecentUpdates([])
  }, [])

  useEffect(() => {
    if (!sessionId) return

    // Initial load
    loadSessionData()

    const channel = supabase
      .channel(`session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          // Reload data when teams table changes
          loadSessionData()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, loadSessionData, supabase])

  return {
    session,
    teams,
    recentUpdates,
    isConnected,
    updateTeamData,
    clearRecentUpdates,
    refreshSession: loadSessionData,
  }
}
