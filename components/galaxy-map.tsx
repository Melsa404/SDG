"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TeamPanel } from "@/components/team-panel"
import { RealtimeNotifications } from "@/components/realtime-notifications"
import { SessionExitDialog } from "@/components/session-exit-dialog"
import { FinalScoreboard } from "@/components/final-scoreboard"
import { LogOut, Trophy } from "lucide-react"
import { useRealtimeSession } from "@/hooks/use-realtime-session"

interface GalaxyMapProps {
  onPlanetSelect: (planet: string) => void
  onShowLeaderboard: () => void
  onExitSession?: () => void
  playerName: string
  badges: string[]
  score: number
  sessionId?: string | null
  sessionName?: string
}

export function GalaxyMap({
  onPlanetSelect,
  onShowLeaderboard,
  onExitSession,
  playerName,
  badges,
  score,
  sessionId,
  sessionName,
}: GalaxyMapProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showFinalScoreboard, setShowFinalScoreboard] = useState(false)
  const [animationPaused, setAnimationPaused] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)
    // keep current rotation angles for each orbit
  const anglesRef = useRef([0, 72, 144, 216].map((a) => (a * Math.PI) / 180))
  const animationRef = useRef<number | null>(null)

  const { recentUpdates, clearRecentUpdates } = useRealtimeSession(sessionId || null, playerName)

  const planets = [
    {
      id: "aqua",
      name: "Planet Aqua",
      description:
        "A water-rich world with sustainable water management. Help restore water balance using NASA rainfall and soil moisture maps.",
      radius: 300, // Increased from 150 to 300 for larger screen coverage
      speed: 0.01,
      color: "rgba(59, 130, 246, 0.5)",
      emoji: "💧",
      title: "The Thirsty World",
      mission: "Clean Water Mission",
      details: "Restore water balance using NASA rainfall maps",
    },
    {
      id: "verde",
      name: "Planet Verde",
      description: "A fevered world needing climate action. Help cool down the world using NASA temperature data.",
      radius: 450, // Increased from 250 to 450 for larger screen coverage
      speed: 0.008,
      color: "rgba(34, 197, 94, 0.5)",
      emoji: "🌍",
      title: "The Fevered World",
      mission: "Climate Action Challenge",
      details: "Use NASA temperature data to cool the burning lands",
    },
    {
      id: "flora",
      name: "Planet Flora",
      description:
        "A world with endangered forests and wildlife. Protect ecosystems using NASA vegetation and deforestation data.",
      radius: 600, // Increased from 350 to 600 for larger screen coverage
      speed: 0.006,
      color: "rgba(132, 204, 22, 0.5)",
      emoji: "🌿",
      title: "The Barren World",
      mission: "Life on Land Mission",
      details: "Restore ecosystems using NASA vegetation data",
    },
    {
      id: "oceanus",
      name: "Planet Oceanus",
      description:
        "A world with threatened marine ecosystems. Save ocean life using NASA ocean temperature and plankton data.",
      radius: 750, // Increased from 450 to 750 for larger screen coverage
      speed: 0.004,
      color: "rgba(14, 165, 233, 0.5)",
      emoji: "🌊",
      title: "The Warming Seas",
      mission: "Life Below Water Mission",
      details: "Protect marine life using NASA ocean data",
    },
  ]

  const isMissionComplete = badges.length >= 4

  useEffect(() => {
    const animate = () => {
      if (!animationPaused) {
        anglesRef.current = anglesRef.current.map((angle, i) => {
          const planet = planets[i]
          return angle + (planet ? planet.speed * animationSpeed : 0)
        })
      }

      planets.forEach((planet, i) => {
        const orbitEl = document.getElementById(`orbit-${planet.id}`)
        if (orbitEl) {
          const angleDeg = (anglesRef.current[i] * 180) / Math.PI
          orbitEl.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animationPaused, animationSpeed, planets])

  const resetAnimation = () => {
    anglesRef.current = [0, 72, 144, 216].map((a) => (a * Math.PI) / 180)
    planets.forEach((planet, i) => {
      const orbitEl = document.getElementById(`orbit-${planet.id}`)
      if (orbitEl) {
        orbitEl.style.transform = `translate(-50%, -50%) rotate(${(anglesRef.current[i] * 180) / Math.PI}deg)`
      }
    })
  }

  const handleExitSession = () => {
    setShowExitDialog(false)
    onExitSession?.()
  }

  const handlePlanetClick = (planetId: string) => {
    onPlanetSelect(planetId)
  }

  
  const handleShowFinalScoreboard = () => {
    setShowFinalScoreboard(true)
  }

  const handleBackFromFinalScoreboard = () => {
    setShowFinalScoreboard(false)
  }

  if (showFinalScoreboard && sessionId && sessionName) {
    return <FinalScoreboard sessionId={sessionId} sessionName={sessionName} onBack={handleBackFromFinalScoreboard} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {sessionId && (
        <>
          <TeamPanel sessionId={sessionId} currentTeamName={playerName} />
          <RealtimeNotifications updates={recentUpdates} onClear={clearRecentUpdates} />
        </>
      )}

      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 160px 30px, #fff, transparent)
          `,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 100px",
          animation: "twinkle 4s ease-in-out infinite alternate",
        }}
      />

      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        @keyframes sunGlow {
          0% { box-shadow: 0 0 100px #ffa500, 0 0 200px #ff6b35; }
          100% { box-shadow: 0 0 150px #ffa500, 0 0 250px #ff6b35; }
        }
      `}</style>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-40">
        <div>
          <h1
            className="text-3xl font-bold m-0"
            style={{
              background: "linear-gradient(90deg, #4f46e5, #06b6d4, #10b981)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SDG Galaxy Map
          </h1>
          <p className="text-slate-400 mt-1">{sessionId ? `Team: ${playerName}` : `Guardian: ${playerName}`}</p>
        </div>

        <div className="flex items-center gap-4 mr-16">
          <div className="text-right">
            <span className="text-sm text-slate-400">Score</span>
            <div className="text-2xl font-bold text-emerald-400">{score}</div>
          </div>
          <div className="flex gap-1">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
          <Button
            onClick={onShowLeaderboard}
            className="bg-transparent border border-white/40 hover:bg-white/10 text-white"
          >
            Leaderboard
          </Button>
          {sessionId && isMissionComplete && (
            <Button
              onClick={handleShowFinalScoreboard}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Final Results
            </Button>
          )}
          {sessionId && onExitSession && (
            <Button
              onClick={() => setShowExitDialog(true)}
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="relative w-full h-screen">
        {/* Central Sun */}
        <div
          className="absolute w-48 h-48 rounded-full z-10 cursor-pointer transition-transform hover:scale-110"
          style={{
            left: "0",
            bottom: "0",
            background: "radial-gradient(circle, #ffd700, #ffa500, #ff6b35)",
            transform: "translate(-50%, 50%)",
            animation: "sunGlow 3s ease-in-out infinite alternate",
          }}
        />

        {/* Orbit containers with planets */}
        {planets.map((planet, i) => (
          <div
            key={`orbit-${planet.id}`}
            id={`orbit-${planet.id}`}
            className="absolute border border-dashed border-white/30 rounded-full z-15 pointer-events-none"
            style={{
              width: `${planet.radius * 2}px`,
              height: `${planet.radius * 2}px`,
              left: "0px",
              top: `${window.innerHeight}px`,
              transform: "translate(-50%, -50%)",
              transformOrigin: "center center",
            }}
          >
            <div
              id={`planet-${planet.id}`}
              className="absolute w-20 h-20 rounded-full cursor-pointer transition-all duration-200 hover:scale-125 z-40 pointer-events-auto"
              style={{
                top: "50%",
                left: "100%",
                transform: "translate(-50%, -50%)",
                backgroundImage: `url('planets/${i + 1}.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                boxShadow: "0 0 20px rgba(255,255,255,0.5)",
              }}
              onMouseEnter={() => setHoveredPlanet(planet.id)}
              onMouseLeave={() => setHoveredPlanet(null)}
              onClick={() => handlePlanetClick(planet.id)}
            />
          </div>
        ))}
      </div>

      {/* Hover tooltip */}
      {hoveredPlanet && (
        <div
          className="absolute bottom-48 right-52 bg-black/80 text-white p-5 rounded-2xl max-w-xs z-40 transition-all duration-300"
          style={{
            opacity: hoveredPlanet ? 1 : 0,
            transform: hoveredPlanet ? "translateY(0)" : "translateY(-20px)",
          }}
        >
          {(() => {
            const planet = planets.find((p) => p.id === hoveredPlanet)
            return planet ? (
              <>
                <h3 className="text-indigo-400 m-0 mb-2">
                  {planet.emoji} {planet.name}
                </h3>
                <p className="text-sm m-0">{planet.description}</p>
              </>
            ) : null
          })()}
        </div>
      )}

      {/* Controls */}
      <div className="absolute top-64 right-64 bg-black/80 text-white p-4 rounded-xl z-30 space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={() => setAnimationPaused(!animationPaused)}
            size="sm"
            variant={animationPaused ? "default" : "outline"}
            className="text-xs"
          >
            {animationPaused ? "Resume" : "Pause"}
          </Button>
          <Button onClick={resetAnimation} size="sm" variant="outline" className="text-xs bg-transparent">
            Reset
          </Button>
        </div>

        <div>
          <label htmlFor="speed" className="block text-sm mb-2">
            Animation Speed
          </label>
          <input
            id="speed"
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number.parseFloat(e.target.value))}
            className="w-36"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="relative z-10 text-center p-6">
        <p className="text-slate-400">
          {sessionId
            ? "Click on a planet to begin your team mission. Compete with other teams using real NASA data!"
            : "Click on a planet to begin your mission. Use real NASA data to solve challenges and earn Guardian badges!"}
        </p>
      </div>

      <SessionExitDialog
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onExitSession={handleExitSession}
        sessionName={sessionName || "Unknown Session"}
        teamName={playerName}
        currentScore={score}
        currentBadges={badges.length}
      />
    </div>
  )
}
