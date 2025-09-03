"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"


interface Team {
  id: string
  name: string
  score: number
  badges: string[]
  joined_at: string
  user_id: string | null
}

interface FinalScoreboardProps {
  sessionId: string
  sessionName: string
  onBack: () => void
}

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export function FinalScoreboard({ sessionId, sessionName, onBack }: FinalScoreboardProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeamsData()

    // Set up real-time subscription for live updates
    const channel = supabase
      .channel(`final-scoreboard-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "teams",
          filter: `session_id=eq.${sessionId}`,
        },
        () => {
          loadTeamsData()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  const loadTeamsData = async () => {
    try {
      const { data: teamsData, error } = await supabase
        .from("teams")
        .select("*")
        .eq("session_id", sessionId)
        .order("score", { ascending: false })

      if (error) {
        console.error("Error fetching teams:", error)
        return
      }

      setTeams(teamsData || [])
    } catch (error) {
      console.error("Error loading teams data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProgressPercentage = (badges: string[]) => {
    return Math.min((badges.length / 4) * 100, 100) // 4 total planets
  }

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "team-1"
      case 2:
        return "team-2"
      case 3:
        return "team-3"
      default:
        return "team-default"
    }
  }

  const getTrophyColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#ffd700" // Gold
      case 2:
        return "#c0c0c0" // Silver
      case 3:
        return "#cd7f32" // Bronze
      default:
        return "#8a82ff"
    }
  }

  const handleBackClick = () => {
    console.log("[v0] Back to Galaxy button clicked")
    console.log("[v0] onBack function:", typeof onBack)
    onBack()
    console.log("[v0] onBack function called")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050517] text-[#e6e6ff] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#8a82ff] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading final results...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }
        
        .final-scoreboard-container {
          background: #050517;
          color: #e6e6ff;
          min-height: 100vh;
          overflow-x: hidden;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        
        .container {
          max-width: 900px;
          width: 100%;
          padding: 2rem;
          background: rgba(6, 12, 48, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(80, 60, 150, 0.3);
          box-shadow: 0 0 50px rgba(21, 9, 51, 0.6);
          position: relative;
          z-index: 2;
        }
        
        .header {
          text-align: center;
          margin-bottom: 2rem;
          padding: 1rem;
          border-bottom: 1px solid #39316d;
          position: relative;
        }
        
        .title {
          font-size: 3.5rem;
          color: #8a82ff;
          margin-bottom: 1rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-shadow: 0 0 15px rgba(138, 130, 255, 0.7);
          font-weight: 900;
        }
        
        .subtitle {
          font-size: 1.2rem;
          color: #a29dff;
          margin-bottom: 1rem;
        }
        
        .scoreboard {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .team {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 15px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          border: 1px solid;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .team:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .team-1 {
          border-color: #6c5ce7;
          box-shadow: 0 0 20px rgba(108, 92, 231, 0.4);
          background: linear-gradient(to right, rgba(15, 23, 42, 0.4), rgba(65, 52, 152, 0.2));
        }
        
        .team-2 {
          border-color: #5b4db9;
          box-shadow: 0 0 20px rgba(91, 77, 185, 0.4);
          background: linear-gradient(to right, rgba(15, 23, 42, 0.4), rgba(55, 44, 126, 0.2));
        }
        
        .team-3 {
          border-color: #4a3c97;
          box-shadow: 0 0 20px rgba(74, 60, 151, 0.4);
          background: linear-gradient(to right, rgba(15, 23, 42, 0.4), rgba(45, 36, 100, 0.2));
        }
        
        .team-default {
          border-color: #39316d;
          box-shadow: 0 0 10px rgba(57, 49, 109, 0.3);
          background: linear-gradient(to right, rgba(15, 23, 42, 0.3), rgba(35, 30, 80, 0.1));
        }
        
        .rank {
          font-size: 3.5rem;
          margin-right: 1.5rem;
          min-width: 60px;
          text-align: center;
          font-weight: bold;
          text-shadow: 0 0 10px;
          color: #8a82ff;
        }
        
        .team-info {
          flex-grow: 1;
        }
        
        .team-name {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #d5d1ff;
          font-weight: 700;
        }
        
        .team-score {
          font-size: 2.8rem;
          font-weight: bold;
          color: #8a82ff;
          text-shadow: 0 0 15px rgba(138, 130, 255, 0.6);
          margin-bottom: 1rem;
        }
        
        .progress-container {
          width: 100%;
          height: 12px;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #6c5ce7, #8a82ff);
          border-radius: 6px;
          transition: width 1s ease-in-out;
          box-shadow: 0 0 10px rgba(138, 130, 255, 0.5);
        }
        
        .progress-text {
          font-size: 0.9rem;
          color: #a29dff;
          text-align: right;
        }
        
        .trophy {
          width: 90px;
          height: 90px;
          margin-left: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 3.5rem;
          text-shadow: 0 0 20px;
        }
        
        .ribbon {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 80px;
          height: 80px;
          overflow: hidden;
        }
        
        .ribbon span {
          position: absolute;
          top: 15px;
          right: -25px;
          transform: rotate(45deg);
          width: 110px;
          padding: 5px 0;
          background: linear-gradient(45deg, #6c5ce7, #5b4db9);
          color: #d5d1ff;
          text-align: center;
          font-size: 0.9rem;
          font-weight: bold;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
        }
        
        .info-text {
          text-align: center;
          margin-top: 2rem;
          color: #a29dff;
          font-size: 1.1rem;
        }
        
        .stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .star {
          position: absolute;
          background: #8a82ff;
          border-radius: 50%;
        }
        
        .shooting-star {
          position: absolute;
          height: 2px;
          background: linear-gradient(to right, transparent, #8a82ff);
          animation: shooting 2s linear infinite;
          z-index: 1;
        }
        
        @keyframes shooting {
          0% {
            transform: translateX(-100px) translateY(0) rotate(45deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(100vh) rotate(45deg);
            opacity: 0;
          }
        }
        
        .nebula {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at 20% 30%, rgba(65, 52, 152, 0.1) 0%, transparent 60%),
                     radial-gradient(ellipse at 80% 70%, rgba(74, 60, 151, 0.1) 0%, transparent 60%);
          z-index: 0;
        }
        
        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
        }
        
        @media (max-width: 768px) {
          .team {
            flex-direction: column;
            text-align: center;
          }
          
          .rank {
            margin-right: 0;
            margin-bottom: 1rem;
          }
          
          .trophy {
            margin-left: 0;
            margin-top: 1rem;
          }
          
          .title {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <div className="final-scoreboard-container">
        <div className="nebula"></div>

        <Button
          onClick={handleBackClick}
          variant="outline"
          className="back-button bg-transparent border-[#8a82ff] text-[#8a82ff] hover:bg-[#8a82ff] hover:text-[#050517]"
          style={{ zIndex: 50 }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Galaxy
        </Button>

        <div className="container">
          <div className="header">
            <h1 className="title">Final Results</h1>
            <div className="subtitle">{sessionName} - Mission Complete</div>
          </div>

          <div className="scoreboard">
            {teams.map((team, index) => {
              const rank = index + 1
              const progress = getProgressPercentage(team.badges)

              return (
                <div key={team.id} className={`team ${getRankClass(rank)}`}>
                  {rank <= 3 && (
                    <div className="ribbon">
                      <span>{rank === 1 ? "CHAMPION" : rank === 2 ? "RUNNER-UP" : "3RD PLACE"}</span>
                    </div>
                  )}

                  <div className="rank">{rank}</div>

                  <div className="team-info">
                    <div className="team-name">{team.name.toUpperCase()}</div>
                    <div className="team-score">{team.score}</div>

                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="progress-text">
                      {team.badges.length}/4 Planets Complete ({Math.round(progress)}%)
                    </div>
                  </div>

                  {rank <= 3 && (
                    <div className="trophy" style={{ color: getTrophyColor(rank) }}>
                      <Trophy size={56} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="info-text">SDG Galaxy Mission • {new Date().getFullYear()}</div>
        </div>

        <div className="stars" id="stars-container"></div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          // Create stars
          const starsContainer = document.getElementById('stars-container');
          if (starsContainer) {
            const starCount = 150;
            
            for (let i = 0; i < starCount; i++) {
              const star = document.createElement('div');
              star.classList.add('star');
              const size = Math.random() * 2;
              star.style.width = size + 'px';
              star.style.height = size + 'px';
              star.style.left = Math.random() * 100 + 'vw';
              star.style.top = Math.random() * 100 + 'vh';
              star.style.opacity = Math.random() * 0.7 + 0.3;
              starsContainer.appendChild(star);
            }
            
            // Create shooting stars
            function createShootingStar() {
              const shootingStar = document.createElement('div');
              shootingStar.classList.add('shooting-star');
              shootingStar.style.top = Math.random() * 50 + 'vh';
              shootingStar.style.left = Math.random() * 50 + 'vw';
              shootingStar.style.width = Math.random() * 50 + 50 + 'px';
              document.body.appendChild(shootingStar);
              
              setTimeout(() => {
                if (shootingStar.parentNode) {
                  shootingStar.remove();
                }
              }, 2000);
            }
            
            setInterval(createShootingStar, 3000);
          }
        `,
        }}
      />
    </>
  )
}
