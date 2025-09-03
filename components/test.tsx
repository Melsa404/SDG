"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface GalaxyMapSolarProps {
  onPlanetSelect: (planet: string) => void
  onShowLeaderboard: () => void
  playerName: string
  score: number
}

export function GalaxyMapSolar({ onPlanetSelect, onShowLeaderboard, playerName, score }: GalaxyMapSolarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationPaused, setAnimationPaused] = useState(false)
  const [speedFactor, setSpeedFactor] = useState(1)
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)

  // Orbit data
  const orbitRadii = [200, 300, 400, 500]
  const baseSpeeds = [0.01, 0.008, 0.006, 0.004]
  const planetTypes = ["aqua", "verde", "flora", "oceanus"]
  const angles = useRef<number[]>([0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2])
  const [positions, setPositions] = useState<{ x: number; y: number }[]>(orbitRadii.map(() => ({ x: 0, y: 0 })))

  // Planet info
  const planetInfo: Record<
    string,
    { title: string; subtitle: string; mission: string; detail: string; color: string }
  > = {
    aqua: {
      title: "💧 Planet Aqua",
      subtitle: "The Thirsty World",
      mission: "Clean Water Mission",
      detail: "Restore water balance using NASA rainfall maps",
      color: "blue",
    },
    verde: {
      title: "🌍 Planet Verde",
      subtitle: "The Fevered World",
      mission: "Climate Action Challenge",
      detail: "Use NASA temperature data to cool the burning lands",
      color: "green",
    },
    flora: {
      title: "🌿 Planet Flora",
      subtitle: "The Barren World",
      mission: "Life on Land Mission",
      detail: "Restore ecosystems using NASA vegetation data",
      color: "emerald",
    },
    oceanus: {
      title: "🌊 Planet Oceanus",
      subtitle: "The Warming Seas",
      mission: "Life Below Water Mission",
      detail: "Protect marine life using NASA ocean data",
      color: "cyan",
    },
  }

  // Animation loop
  useEffect(() => {
    let frame: number
    const animate = () => {
      if (!animationPaused && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const cx = rect.width / 2
        const cy = rect.height / 2

        const newPositions = orbitRadii.map((r, i) => {
          angles.current[i] += baseSpeeds[i] * speedFactor
          return {
            x: cx + r * Math.cos(angles.current[i]),
            y: cy + r * Math.sin(angles.current[i]),
          }
        })
        setPositions(newPositions)
      }
      frame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frame)
  }, [animationPaused, speedFactor])

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] overflow-hidden text-white font-sans">
      {/* Stars */}
      <div className="absolute inset-0 animate-twinkle bg-[radial-gradient(2px_2px_at_20px_30px,#eee,transparent),radial-gradient(2px_2px_at_40px_70px,rgba(255,255,255,0.8),transparent),radial-gradient(1px_1px_at_90px_40px,#fff,transparent),radial-gradient(1px_1px_at_130px_80px,rgba(255,255,255,0.6),transparent)] bg-repeat bg-[length:200px_100px] z-0"></div>

      {/* Header */}
      <div className="absolute top-0 left-0 w-full flex justify-between p-6 z-20">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
            SDG Galaxy Map
          </h1>
          <p className="text-slate-400">Guardian: {playerName}</p>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-slate-400">Score</p>
            <p className="text-2xl font-bold text-emerald-400">{score}</p>
          </div>
          <Button variant="outline" onClick={onShowLeaderboard}>
            Leaderboard
          </Button>
        </div>
      </div>

      {/* Solar system */}
      <div ref={containerRef} className="relative w-full h-screen z-10">
        {/* Sun */}
        <div className="absolute left-1/2 top-1/2 w-48 h-48 rounded-full bg-gradient-radial from-yellow-300 via-orange-400 to-red-500 animate-pulse shadow-[0_0_150px_#ffa500,0_0_250px_#ff6b35] -translate-x-1/2 -translate-y-1/2"></div>

        {/* Planets */}
        {positions.map((pos, i) => {
          const planet = planetTypes[i]
          const info = planetInfo[planet]
          return (
            <div key={planet} style={{ left: pos.x, top: pos.y }} className="absolute">
              <div
                className={`w-20 h-20 rounded-full cursor-pointer transition-transform duration-200 shadow-lg shadow-${info.color}-500/30`}
                style={{
                  transform: `translate(-50%,-50%) scale(${hoveredPlanet === planet ? 1.2 : 1})`,
                  backgroundImage: `url(/planet-${i + 1}.png)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onMouseEnter={() => setHoveredPlanet(planet)}
                onMouseLeave={() => setHoveredPlanet(null)}
                onClick={() => onPlanetSelect(planet)}
              />

              {/* Floating info card */}
              {hoveredPlanet === planet && (
                <Card className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 bg-card/90 backdrop-blur border border-white/20 z-30">
                  <CardHeader className="pb-2">
                    <CardTitle className={`text-${info.color}-400 text-lg`}>{info.title}</CardTitle>
                    <CardDescription>{info.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-1">{info.mission}</p>
                    <p className="text-xs text-muted-foreground">{info.detail}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="absolute bottom-20 right-20 flex gap-2 z-20">
        <Button onClick={() => setAnimationPaused(true)}>Pause</Button>
        <Button onClick={() => setAnimationPaused(false)}>Resume</Button>
        <Button onClick={() => (angles.current = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2])}>Reset</Button>
      </div>

      {/* Speed Slider */}
      <div className="absolute top-40 right-20 bg-black/70 p-4 rounded-lg z-20">
        <label className="block text-sm">Animation Speed</label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={speedFactor}
          onChange={(e) => setSpeedFactor(parseFloat(e.target.value))}
          className="w-40"
        />
      </div>
    </div>
  )
}
