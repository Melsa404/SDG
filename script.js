// Game state management
const gameState = {
  currentScreen: "intro",
  playerName: "",
  score: 0,
  badges: [],
  stickers: [],
  leaderboard: JSON.parse(localStorage.getItem("sdg-leaderboard") || "[]"),
  currentPlanet: null,
}

// DOM elements
const screens = {
  intro: document.getElementById("intro-screen"),
  galaxy: document.getElementById("galaxy-screen"),
  planetDescription: document.getElementById("planet-description-screen"),
  verde: document.getElementById("verde-screen"),
  aqua: document.getElementById("aqua-screen"),
  leaderboard: document.getElementById("leaderboard-screen"),
}

const planetData = {
  verde: {
    title: "🌍 Planet Verde - Climate Action Mission",
    description:
      "Planet Verde is experiencing dangerous climate changes! The temperature is rising, ice caps are melting, and extreme weather events are becoming more frequent. As a Guardian, you must use real NASA climate data to understand the crisis and help save this beautiful green world.",
    objectives: [
      "Study NASA temperature and climate data",
      "Learn about greenhouse gases and their effects",
      "Understand renewable energy solutions",
      "Master climate action strategies",
    ],
    visualClass: "verde",
  },
  aqua: {
    title: "💧 Planet Aqua - Clean Water Mission",
    description:
      "Planet Aqua's water systems are in crisis! Clean water sources are becoming scarce, and billions of inhabitants lack access to safe drinking water. Use NASA's precipitation and water data to understand the water cycle and help restore balance to this aquatic world.",
    objectives: [
      "Analyze NASA water and precipitation data",
      "Learn about the global water cycle",
      "Understand water conservation methods",
      "Master clean water solutions",
    ],
    visualClass: "aqua",
  },
}

// Initialize game
document.addEventListener("DOMContentLoaded", () => {
  initializeGame()
})

function initializeGame() {
  // Intro screen handlers
  const playerNameInput = document.getElementById("player-name")
  const startBtn = document.getElementById("start-btn")

  playerNameInput.addEventListener("input", function () {
    startBtn.disabled = !this.value.trim()
  })

  startBtn.addEventListener("click", startGame)

  document.getElementById("planet-verde").addEventListener("click", () => showPlanetDescription("verde"))
  document.getElementById("planet-aqua").addEventListener("click", () => showPlanetDescription("aqua"))
  document.getElementById("leaderboard-btn").addEventListener("click", () => showScreen("leaderboard"))

  // Back buttons
  document.getElementById("back-from-description").addEventListener("click", () => showScreen("galaxy"))
  document.getElementById("back-from-verde").addEventListener("click", () => showScreen("galaxy"))
  document.getElementById("back-from-aqua").addEventListener("click", () => showScreen("galaxy"))
  document.getElementById("back-from-leaderboard").addEventListener("click", () => showScreen("galaxy"))

  document.getElementById("start-mission-btn").addEventListener("click", startPlanetMission)

  // Quiz submit buttons
  document.getElementById("submit-verde").addEventListener("click", () => submitQuiz("verde"))
  document.getElementById("submit-aqua").addEventListener("click", () => submitQuiz("aqua"))
}

function startGame() {
  const playerName = document.getElementById("player-name").value.trim()
  if (!playerName) return

  gameState.playerName = playerName
  showScreen("galaxy")
  updatePlayerDisplay()
}

function showPlanetDescription(planet) {
  gameState.currentPlanet = planet
  const data = planetData[planet]

  // Update description content
  document.getElementById("planet-description-title").textContent = data.title
  document.getElementById("planet-mission-description").innerHTML = `<p>${data.description}</p>`

  // Update objectives list
  const objectivesList = document.getElementById("mission-objectives-list")
  objectivesList.innerHTML = ""
  data.objectives.forEach((objective) => {
    const li = document.createElement("li")
    li.textContent = objective
    objectivesList.appendChild(li)
  })

  // Update planet visual
  const planetVisual = document.getElementById("planet-description-visual")
  planetVisual.className = `planet-large ${data.visualClass}`

  // Set planet surface style
  const planetSurface = planetVisual.querySelector(".planet-surface-large")
  if (planet === "verde") {
    planetSurface.style.background = "linear-gradient(45deg, #22c55e, #16a34a, #15803d)"
    planetSurface.style.boxShadow = "inset -30px -30px 60px rgba(0, 0, 0, 0.3), 0 0 50px rgba(34, 197, 94, 0.4)"
  } else {
    planetSurface.style.background = "linear-gradient(45deg, #0ea5e9, #0284c7, #0369a1)"
    planetSurface.style.boxShadow = "inset -30px -30px 60px rgba(0, 0, 0, 0.3), 0 0 50px rgba(14, 165, 233, 0.4)"
  }

  showScreen("planetDescription")
}

function startPlanetMission() {
  if (gameState.currentPlanet) {
    showScreen(gameState.currentPlanet)
  }
}

function showScreen(screenName) {
  // Hide all screens
  Object.values(screens).forEach((screen) => screen.classList.remove("active"))

  // Show target screen
  screens[screenName].classList.add("active")
  gameState.currentScreen = screenName

  // Update leaderboard if showing
  if (screenName === "leaderboard") {
    updateLeaderboard()
  }
}

function updatePlayerDisplay() {
  document.getElementById("player-display").textContent = `Guardian: ${gameState.playerName}`
  document.getElementById("score-display").textContent = `Score: ${gameState.score}`
  updateBadgesDisplay()
}

function updateBadgesDisplay() {
  const container = document.getElementById("badges-container")
  container.innerHTML = ""

  // Show stickers
  gameState.stickers.forEach((sticker) => {
    const stickerEl = document.createElement("div")
    stickerEl.className = "sticker"
    stickerEl.textContent = sticker
    container.appendChild(stickerEl)
  })

  // Show badges
  gameState.badges.forEach((badge) => {
    const badgeEl = document.createElement("div")
    badgeEl.className = "badge"
    badgeEl.textContent = badge
    container.appendChild(badgeEl)
  })
}

function submitQuiz(planet) {
  const quizData = {
    verde: {
      questions: ["q1", "q2", "q3"],
      planetName: "Planet Verde",
      badgeName: "🌍 Climate Guardian",
      stickerPrefix: "🌱",
    },
    aqua: {
      questions: ["aq1", "aq2", "aq3"],
      planetName: "Planet Aqua",
      badgeName: "💧 Water Protector",
      stickerPrefix: "💧",
    },
  }

  const quiz = quizData[planet]
  let correctAnswers = 0
  const totalQuestions = quiz.questions.length

  // Check answers
  quiz.questions.forEach((questionName) => {
    const selectedAnswer = document.querySelector(`input[name="${questionName}"]:checked`)
    if (selectedAnswer && selectedAnswer.value === "correct") {
      correctAnswers++
    }
  })

  // Calculate score and rewards
  const pointsPerQuestion = 10
  const earnedPoints = correctAnswers * pointsPerQuestion
  gameState.score += earnedPoints

  let badgeEarned = false

  if (correctAnswers === totalQuestions) {
    // Perfect score - award badge
    if (!gameState.badges.includes(quiz.badgeName)) {
      gameState.badges.push(quiz.badgeName)
      badgeEarned = true
      gameState.score += 50 // Bonus points for perfect score
    }
  } else if (correctAnswers === 0) {
    // Zero correct - award effort badge
    const effortBadge = "⭐ Effort Badge"
    if (!gameState.badges.includes(effortBadge)) {
      gameState.badges.push(effortBadge)
      badgeEarned = true
    }
  } else {
    // Partial correct - award stickers only
    for (let i = 0; i < correctAnswers; i++) {
      gameState.stickers.push(`${quiz.stickerPrefix} Star ${i + 1}`)
    }
  }

  // Show results
  showQuizResults(planet, correctAnswers, totalQuestions, earnedPoints, badgeEarned, quiz.badgeName)

  // Update displays
  updatePlayerDisplay()

  // Save to leaderboard
  updatePlayerInLeaderboard()
}

function showQuizResults(planet, correct, total, points, badgeEarned, badgeName) {
  const resultsDiv = document.getElementById(`${planet}-results`)
  resultsDiv.classList.add("show")

  let resultsHTML = `
        <h3>Quiz Results</h3>
        <p><strong>Correct Answers:</strong> ${correct}/${total}</p>
        <p><strong>Points Earned:</strong> ${points}</p>
    `

  if (correct === total) {
    // Perfect score
    resultsHTML += `
            <div style="margin-top: 1rem; padding: 1rem; background: var(--accent); border-radius: 0.5rem;">
                <h4>🎉 PERFECT SCORE! 🎉</h4>
                <p><strong>Badge Earned:</strong> ${badgeName}</p>
                <p><strong>Bonus Points:</strong> +50</p>
            </div>
        `
  } else if (correct === 0) {
    // Zero correct - effort badge
    resultsHTML += `
            <div style="margin-top: 1rem; padding: 1rem; background: var(--muted); border-radius: 0.5rem;">
                <h4>⭐ Keep Trying! ⭐</h4>
                <p><strong>Effort Badge Earned:</strong> You showed up and tried!</p>
                <p>Study the NASA data and try again to earn more rewards!</p>
            </div>
        `
  } else {
    // Partial correct - stickers only
    resultsHTML += `<p><strong>Stickers Earned:</strong> ${correct} star sticker${correct > 1 ? "s" : ""}!</p>`
    resultsHTML += `<p style="color: var(--secondary);">Get all answers correct to earn the ${badgeName} badge!</p>`
  }

  resultsDiv.innerHTML = resultsHTML
}

function updatePlayerInLeaderboard() {
  gameState.leaderboard = gameState.leaderboard.filter((player) => player.name !== gameState.playerName)

  // Add current player
  gameState.leaderboard.push({
    name: gameState.playerName,
    score: gameState.score,
    badges: [...gameState.badges],
    stickers: gameState.stickers.length,
    timestamp: Date.now(),
  })

  // Sort by score (descending), then by timestamp (ascending for ties)
  gameState.leaderboard.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score
    }
    return a.timestamp - b.timestamp
  })

  // Keep only top 10
  gameState.leaderboard = gameState.leaderboard.slice(0, 10)

  // Save to localStorage
  localStorage.setItem("sdg-leaderboard", JSON.stringify(gameState.leaderboard))
}

function updateLeaderboard() {
  const leaderboardList = document.getElementById("leaderboard-list")

  if (gameState.leaderboard.length === 0) {
    leaderboardList.innerHTML =
      '<div style="padding: 2rem; text-align: center; color: var(--muted-foreground);">No players yet. Be the first to complete a quiz!</div>'
    return
  }

  leaderboardList.innerHTML = ""

  gameState.leaderboard.forEach((player, index) => {
    const item = document.createElement("div")
    item.className = "leaderboard-item"

    if (player.name === gameState.playerName) {
      item.classList.add("current-player")
    }

    const badgesHTML = player.badges.map((badge) => `<span class="badge">${badge}</span>`).join("")

    item.innerHTML = `
            <div class="player-rank">#${index + 1}</div>
            <div class="player-name">${player.name}</div>
            <div class="player-score">${player.score} pts</div>
            <div class="player-badges">${badgesHTML}</div>
            <div style="font-size: 0.875rem; color: var(--muted-foreground);">${player.stickers} stickers</div>
        `

    leaderboardList.appendChild(item)
  })
}

// Add some visual feedback for planet interactions
document.addEventListener("DOMContentLoaded", () => {
  const planets = document.querySelectorAll(".planet")
  planets.forEach((planet) => {
    planet.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)"
    })

    planet.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)"
    })
  })
})
