import React, { useState, useEffect, useCallback, useRef } from "react"
import type { ColorScheme } from "@/lib/portfolio-types"

interface SnakeSegment {
  x: number
  y: number
  label?: string // The skill/achievement this segment represents
}

interface FoodItem {
  x: number
  y: number
  type: "tech" | "experience"
  label: string
  icon: string
}

interface SnakeGameState {
  snake: SnakeSegment[]
  direction: "UP" | "DOWN" | "LEFT" | "RIGHT"
  food: FoodItem | null
  score: number
  collectedItems: string[]
  gameOver: boolean
  won: boolean
  isPaused: boolean
  speed: number
}

interface SnakeGameProps {
  isDarkMode: boolean
  colors: ColorScheme
  onGameEnd: (won: boolean) => void
  onLog: (message: string) => void
}

// Game configuration
const GRID_WIDTH = 40
const GRID_HEIGHT = 12
const INITIAL_SPEED = 200 // ms per move - slower for easier gameplay
// We have 7 items (tech + experience). Win condition equals total items.
const WIN_CONDITION = 7

// Career items to collect
const CAREER_ITEMS: Omit<FoodItem, "x" | "y">[] = [
  { type: "tech", label: "Java", icon: "☕" },
  { type: "tech", label: "Node.js", icon: "🟢" },
  { type: "tech", label: "Python", icon: "🐍" },
  { type: "tech", label: "SQL", icon: "🗄️" },
  { type: "tech", label: "React", icon: "⚛️" },
  { type: "experience", label: "Team Leader", icon: "⭐" },
  { type: "experience", label: "BGU Student", icon: "🎓" },
]

const getRandomPosition = (snake: SnakeSegment[]): { x: number; y: number } => {
  let pos: { x: number; y: number }
  let isValid = false

  while (!isValid) {
    pos = {
      x: Math.floor(Math.random() * (GRID_WIDTH - 2)) + 1,
      y: Math.floor(Math.random() * (GRID_HEIGHT - 2)) + 1,
    }
    isValid = !snake.some((segment) => segment.x === pos.x && segment.y === pos.y)
  }

  return pos!
}

const spawnFood = (snake: SnakeSegment[], itemIndex: number): FoodItem => {
  const pos = getRandomPosition(snake)
  const item = CAREER_ITEMS[itemIndex % CAREER_ITEMS.length]
  return { ...item, ...pos }
}

export function JobHuntGame({ isDarkMode, colors, onGameEnd, onLog }: SnakeGameProps) {
  const [gameState, setGameState] = useState<SnakeGameState>({
    snake: [{ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2), label: "Head" }],
    direction: "RIGHT",
    food: null,
    score: 0,
    collectedItems: [],
    gameOver: false,
    won: false,
    isPaused: false,
    speed: INITIAL_SPEED,
  })

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const directionQueueRef = useRef<("UP" | "DOWN" | "LEFT" | "RIGHT")[]>([])
  const isInitializedRef = useRef(false)
  const loggedItemsRef = useRef<Set<string>>(new Set())
  const onLogRef = useRef(onLog)
  
  // Keep onLog ref updated
  useEffect(() => {
    onLogRef.current = onLog
  }, [onLog])
  
  // Helper to log only once per unique message
  const logOnce = (message: string, uniqueKey?: string) => {
    const key = uniqueKey || message
    if (!loggedItemsRef.current.has(key)) {
      loggedItemsRef.current.add(key)
      onLogRef.current(message)
    }
  }

  // Initialize first food - only once
  useEffect(() => {
    if (!isInitializedRef.current && !gameState.food) {
      isInitializedRef.current = true
      setGameState((prev) => ({
        ...prev,
        food: spawnFood(prev.snake, 0),
      }))
    }
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setGameState((prev) => {
        if (prev.gameOver || prev.won) return prev

        let newDirection: "UP" | "DOWN" | "LEFT" | "RIGHT" | null = null

        switch (e.key) {
          case "ArrowUp":
          case "w":
          case "W":
            e.preventDefault()
            newDirection = "UP"
            break
          case "ArrowDown":
          case "s":
          case "S":
            e.preventDefault()
            newDirection = "DOWN"
            break
          case "ArrowLeft":
          case "a":
          case "A":
            e.preventDefault()
            newDirection = "LEFT"
            break
          case "ArrowRight":
          case "d":
          case "D":
            e.preventDefault()
            newDirection = "RIGHT"
            break
          case " ":
            e.preventDefault()
            return { ...prev, isPaused: !prev.isPaused }
          default:
            break
        }

        if (newDirection) {
          // Prevent 180-degree turns
          const currentDir = directionQueueRef.current.length > 0
            ? directionQueueRef.current[directionQueueRef.current.length - 1]
            : prev.direction

          const isOpposite =
            (currentDir === "UP" && newDirection === "DOWN") ||
            (currentDir === "DOWN" && newDirection === "UP") ||
            (currentDir === "LEFT" && newDirection === "RIGHT") ||
            (currentDir === "RIGHT" && newDirection === "LEFT")

          if (!isOpposite) {
            directionQueueRef.current.push(newDirection)
          }
        }

        return prev
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Game loop
  useEffect(() => {
    if (gameState.gameOver || gameState.won || gameState.isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
        gameLoopRef.current = null
      }
      return
    }

    // Clear any existing interval first to prevent duplicates
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }

    gameLoopRef.current = setInterval(() => {
      setGameState((prev) => {
        // Get direction from queue or use current
        const nextDirection = directionQueueRef.current.shift() || prev.direction
        const head = prev.snake[0]
        let newHead: SnakeSegment = { x: head.x, y: head.y }

        // Calculate new head position
        switch (nextDirection) {
          case "UP":
            newHead = { x: head.x, y: head.y - 1 }
            break
          case "DOWN":
            newHead = { x: head.x, y: head.y + 1 }
            break
          case "LEFT":
            newHead = { x: head.x - 1, y: head.y }
            break
          case "RIGHT":
            newHead = { x: head.x + 1, y: head.y }
            break
        }

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_WIDTH ||
          newHead.y < 0 ||
          newHead.y >= GRID_HEIGHT
        ) {
          onLogRef.current("💥 Stack Overflow! Hit the wall. Game Over.")
          return { ...prev, gameOver: true, direction: nextDirection }
        }

        // Check self collision
        if (prev.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          onLogRef.current("💥 Stack Overflow! Collided with your own stack. Game Over.")
          return { ...prev, gameOver: true, direction: nextDirection }
        }

        // Check food collision
        let newSnake = [newHead, ...prev.snake]
        let newFood = prev.food
        let newScore = prev.score
        let newCollectedItems = prev.collectedItems
        let newSpeed = prev.speed
        let won = false

        if (prev.food && newHead.x === prev.food.x && newHead.y === prev.food.y) {
          // Food eaten!
          const foodLabel = prev.food.label
          newHead.label = foodLabel // Label this segment
          newScore += 1
          newCollectedItems = [...prev.collectedItems, foodLabel]
          newSpeed = prev.speed // Keep speed constant for easier gameplay

          // Log to terminal
          if (prev.food.type === "tech") {
            logOnce(`${prev.food.icon} Hadar mastered ${foodLabel}! ${
              foodLabel === "Node.js" ? "Backend" : foodLabel === "React" ? "Frontend" : "Technical"
            } capabilities expanded.`, `tech-${foodLabel}`)
          } else {
            logOnce(`⭐ ${foodLabel} achievement unlocked! Professional experience recognized.`, `exp-${foodLabel}`)
          }

          // Check victory condition
          if (newCollectedItems.length >= WIN_CONDITION) {
            logOnce("", "victory-1")
            logOnce("╔═══════════════════════════════════════════════════════════╗", "victory-2")
            logOnce("║       🏆 PRODUCTION READY - Full Stack Achieved! 🏆     ║", "victory-3")
            logOnce("╚═══════════════════════════════════════════════════════════╝", "victory-4")
            logOnce("", "victory-5")
            logOnce(`📧 Contact: Hadarknafo@gmail.com`, "victory-6")
            logOnce(`📱 Phone: 054-3552316`, "victory-7")
            logOnce(`🔗 LinkedIn: linkedin.com/in/hadar-knafo`, "victory-8")
            logOnce("", "victory-9")
            logOnce(`💼 Status: AVAILABLE FOR HIRE - Immediate Start`, "victory-10")
            logOnce("", "victory-11")
            won = true
          } else {
            // Spawn new food
            newFood = spawnFood(newSnake, newCollectedItems.length)
          }
        } else {
          // No food eaten, remove tail
          newSnake = newSnake.slice(0, -1)
        }

        return {
          ...prev,
          snake: newSnake,
          direction: nextDirection,
          food: newFood,
          score: newScore,
          collectedItems: newCollectedItems,
          speed: newSpeed,
          won,
        }
      })
    }, gameState.speed)

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameState.speed, gameState.gameOver, gameState.won, gameState.isPaused])

  // Trigger game end callback
  useEffect(() => {
    if (gameState.won) {
      setTimeout(() => onGameEnd(true), 2000)
    } else if (gameState.gameOver) {
      setTimeout(() => onGameEnd(false), 1500)
    }
  }, [gameState.won, gameState.gameOver, onGameEnd])

  // Render the game grid
  const renderGrid = () => {
    const cells = []
    
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        let content: React.ReactNode = " "
        let colorClass = ""
        let isBorder = false
        
        // Determine what should be displayed at this position
        if (y === 0 && x === 0) {
          content = "┌"
          colorClass = isDarkMode ? "text-[#454545]" : "text-[#d4d4d4]"
          isBorder = true
        } else if (y === 0 && x === GRID_WIDTH - 1) {
          content = "┐"
          colorClass = isDarkMode ? "text-[#454545]" : "text-[#d4d4d4]"
          isBorder = true
        } else if (y === GRID_HEIGHT - 1 && x === 0) {
          content = "└"
          colorClass = isDarkMode ? "text-[#454545]" : "text-[#d4d4d4]"
          isBorder = true
        } else if (y === GRID_HEIGHT - 1 && x === GRID_WIDTH - 1) {
          content = "┘"
          colorClass = isDarkMode ? "text-[#454545]" : "text-[#d4d4d4]"
          isBorder = true
        } else if (y === 0 || y === GRID_HEIGHT - 1) {
          content = "─"
          colorClass = isDarkMode ? "text-[#454545]" : "text-[#d4d4d4]"
          isBorder = true
        } else if (x === 0 || x === GRID_WIDTH - 1) {
          content = "│"
          colorClass = isDarkMode ? "text-[#454545]" : "text-[#d4d4d4]"
          isBorder = true
        } else {
          // Inside the playing area - check for snake and food
          const isSnakeHead = gameState.snake[0].x === x && gameState.snake[0].y === y
          const isSnakeBody = gameState.snake.slice(1).some(s => s.x === x && s.y === y)
          const isFood = gameState.food && gameState.food.x === x && gameState.food.y === y
          
          if (isSnakeHead) {
            // Custom head block styled to look like you (initial H)
            content = (
              <div
                className="flex items-center justify-center text-white font-bold"
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: "#3794ff",
                  borderRadius: 3,
                  fontSize: 10,
                  lineHeight: "12px",
                }}
              >
                H
              </div>
            )
            colorClass = ""
          } else if (isSnakeBody) {
            content = "●"
            colorClass = "text-[#10b981]"
          } else if (isFood) {
            content = gameState.food!.icon
            colorClass = gameState.food!.type === "tech" ? "text-[#3b82f6]" : "text-[#8b5cf6]"
          }
        }
        
        cells.push(
          <div
            key={`${y}-${x}`}
            className={`flex items-center justify-center ${colorClass}`}
            style={{ 
              width: '18px', 
              height: '20px',
              fontSize: isBorder ? '14px' : '16px'
            }}
          >
            {content}
          </div>
        )
      }
    }
    
    return (
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 18px)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 20px)`,
          fontFamily: 'JetBrains Mono, monospace',
          lineHeight: 1
        }}
      >
        {cells}
      </div>
    )
  }

  return (
    <div className="font-mono leading-tight">
      {/* Game Status */}
      <div
        className={`flex items-center justify-between mb-3 px-3 py-2 rounded ${
          isDarkMode ? "bg-[#1e1e1e]" : "bg-[#f3f3f3]"
        }`}
      >
        <div className="flex items-center gap-6 text-sm">
          <span className="text-[#10b981] font-semibold">
            Stack Size: {gameState.snake.length}
          </span>
          <span className="text-[#3b82f6] font-semibold">
            Items: {gameState.collectedItems.length}/{WIN_CONDITION}
          </span>
          <span className={isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}>
            {gameState.isPaused ? "⏸ PAUSED" : "▶ RUNNING"}
          </span>
        </div>
        <div className="text-sm text-[#858585]">
          {!gameState.gameOver && !gameState.won && "SPACE to pause | WASD/Arrows to move"}
        </div>
      </div>

      {/* Game Grid - Larger size with bigger font */}
      <div 
        className={`p-4 rounded ${isDarkMode ? "bg-[#0e1118]" : "bg-[#fafafa]"}`}
        style={{ fontSize: '20px', lineHeight: '24px' }}
      >
        {renderGrid()}
      </div>

      {/* Game Over / Victory Message */}
      {(gameState.gameOver || gameState.won) && (
        <div
          className={`mt-3 p-4 rounded border-2 text-center ${
            gameState.won
              ? "border-[#10b981] bg-[#064e3b] text-[#10b981]"
              : "border-[#ef4444] bg-[#7f1d1d] text-[#ef4444]"
          }`}
        >
          <div className="font-bold text-2xl mb-2">
            {gameState.won ? "🎉 PRODUCTION READY!" : "💥 Stack Overflow!"}
          </div>
          <div className="text-sm">
            {gameState.won
              ? `Full Stack achieved! ${gameState.collectedItems.length} skills mastered.`
              : "Game Over. Close window (ESC) or play again."}
          </div>
        </div>
      )}

      {/* Stack Display */}
      {gameState.collectedItems.length > 0 && (
        <div className={`mt-3 p-3 rounded text-sm ${isDarkMode ? "bg-[#1e1e1e]" : "bg-[#f3f3f3]"}`}>
          <div className="text-[#8b5cf6] font-semibold mb-2 text-base">Hadar's Growing Stack:</div>
          <div className="flex flex-wrap gap-2">
            {gameState.collectedItems.map((item, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  item === "Team Leader" || item === "BGU Student"
                    ? "bg-[#8b5cf6] text-white" // Experience = purple
                    : "bg-[#3b82f6] text-white" // Tech = blue
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
