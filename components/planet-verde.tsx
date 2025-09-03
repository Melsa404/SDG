"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface PlanetVerdeProps {
  onBack: () => void
  onBadgeEarned: (badge: string, points: number) => void
  playerName: string
}

const questions = [
  {
    id: 1,
    question:
      "Looking at NASA's 2024 global temperature anomaly map, which region shows the most extreme warming compared to the 1951–1980 average?",
    link: "https://data.giss.nasa.gov/gistemp/maps",
    options: [
      "The Arctic region (North Pole and surrounding oceans)",
      "Central Africa (around the equator)",
      "The Southern Ocean (around Antarctica)",
      "South America (Amazon basin)",
    ],
    correct: 0,
    explanation:
      "NASA data show that the Arctic is warming about 3–4 times faster than the global average, a process called Arctic amplification.",
  },
  {
    id: 2,
    question: "Which of these is a real effect of losing Arctic ice?",
    options: [
      "Polar bears lose hunting grounds",
      "The sea level rises",
      "The Earth absorbs more heat (less ice to reflect sunlight)",
      "All of the above",
    ],
    correct: 3,
    explanation: "All of these effects are real consequences of Arctic ice loss, creating a dangerous feedback loop.",
  },
  {
    id: 3,
    question: "NASA’s MODIS Fire Maps show thousands of fires across the world each month. Some patterns are natural (like lightning-caused fires in Canada), but others are linked to people. Looking at the fire hotspots in the Amazon and central Africa, why do so many fires occur there each year?",
    options: [
      "Because wild animals create sparks that start fires",
      "Because people clear land for farming and agriculture ",
      "Because volcanoes erupt daily in these regions ",
      "Because these areas never receive rainfall ",
    ],
    correct: 1,
    explanation: "The MODIS fire maps reveal repeating yearly fire patterns tied to farming methods like slash-and-burn, especially in the Amazon, Africa, and Southeast Asia.",
  },
  {
    id: 4,
    question: "The map shows Earth getting hotter (more red zones). What action helps Planet Verde cool down?",
    options: [
      "Planting more trees",
      "Burning more coal",
      "Using more plastic bags",
      "Leaving lights on all night",
    ],
    correct: 0,
    explanation: "Trees absorb CO₂ from the atmosphere, helping to reduce global warming.",
  },
  {
    id: 5,
    question: "NASA CO₂ maps show more greenhouse gases over cities. What action helps reduce CO₂?",
    options: [
      "Riding bicycles or using public transport ",
      "Driving big cars alone ",
      "Wasting electricity ",
      "Cutting down forests ",
    ],
    correct: 0,
    explanation: "Less fuel use → less CO₂ released.",
  },
]

export function PlanetVerde({ onBack, onBadgeEarned, playerName }: PlanetVerdeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    if (answerIndex === questions[currentQuestion].correct) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setCompleted(true)
      // Award badge based on score
      if (score >= 2) {
        onBadgeEarned("🌿 Climate Defender", 100)
      } else {
        onBadgeEarned("🔥 Climate Learner", 50)
      }
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900/20 via-background to-background flex items-center justify-center p-4">
        <Card className="max-w-2xl mx-auto bg-card/90 backdrop-blur border-green-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-green-400">Mission Complete!</CardTitle>
            <CardDescription>Planet Verde Status Report</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <iframe
                src="/badges/verdebadge.html"
                width="192"
                height="192"
                frameBorder="0"
                className="rounded-lg"
                title="Verde Climate Hero Badge"
              />
            </div>
            <p className="text-lg">
              Excellent work, Guardian {playerName}! You scored {score} out of {questions.length} questions correctly.
            </p>
            <div className="bg-green-500/10 p-4 rounded-lg">
              <p className="text-green-400 font-semibold">
                {score >= 2 ? "🌿 Climate Defender Badge Earned!" : "🔥 Climate Learner Badge Earned!"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                You've helped Planet Verde understand the climate crisis using real NASA data!
              </p>
            </div>
            <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
              Return to Galaxy Map
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900/20 via-background to-background p-4">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back to Galaxy
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-400">🌍 Planet Verde</h1>
          <p className="text-muted-foreground">The Fevered World</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <p className="text-lg font-bold text-green-400">Score: {score}</p>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card/90 backdrop-blur border-green-500/30">
          <CardHeader>
            <CardTitle className="text-xl text-green-400">Climate Challenge</CardTitle>
            {question.link && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="w-4 h-4" />
                <a
                  href={question.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  View NASA Data
                </a>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed">{question.question}</p>

            {currentQuestion === 0 && (
              <div className="flex justify-center">
                <img
                  src="/images/question1/pic1.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}
            {currentQuestion === 1 && (
              <div className="flex justify-center">
                <img
                  src="/images/question1/pic2.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}
            {currentQuestion === 2 && (
              <div className="flex justify-center">
                <video
                  controls
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                  style={{ maxHeight: "400px" }}
                >
                  <source src="/videos/question1/video3.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {currentQuestion === 4 && (
              <div className="flex justify-center">
                <img
                  src="/images/question1/pic5.png"
                  alt="NASA Global Temperature Anomaly Map for July 2025 showing temperature differences compared to 1951-1980 baseline"
                  className="max-w-full h-auto rounded-lg border border-green-500/30"
                />
              </div>
            )}


            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  variant={
                    showExplanation
                      ? index === question.correct
                        ? "default"
                        : selectedAnswer === index
                          ? "destructive"
                          : "outline"
                      : "outline"
                  }
                  className={`text-left justify-start h-auto p-4 ${
                    showExplanation && index === question.correct
                      ? "bg-green-600 hover:bg-green-700 border-green-500"
                      : ""
                  }`}
                >
                  <span className="font-semibold mr-3">{String.fromCharCode(65 + index)})</span>
                  {option}
                </Button>
              ))}
            </div>

            {showExplanation && (
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                <p className="text-green-400 font-semibold mb-2">
                  {selectedAnswer === question.correct ? "Correct! ✅" : "Incorrect ❌"}
                </p>
                <p className="text-sm">{question.explanation}</p>
              </div>
            )}

            {showExplanation && (
              <div className="flex justify-center">
                <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Mission"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
