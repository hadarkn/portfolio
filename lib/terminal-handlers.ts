import type { FileType } from "@/lib/portfolio-types"

interface TerminalCommandHandlerProps {
  command: string
  setTerminalOutput: (fn: (prev: string[]) => string[]) => void
  setTerminalInput: (input: string) => void
  setTerminalHistory: (fn: (prev: string[]) => string[]) => void
  setHistoryIndex: (index: number) => void
}

export function handleTerminalCommand({
  command,
  setTerminalOutput,
  setTerminalInput,
  setTerminalHistory,
  setHistoryIndex,
}: TerminalCommandHandlerProps) {
  const trimmedCommand = command.trim().toLowerCase()

  // Add command to history
  setTerminalHistory((prev) => [...prev, command])
  setHistoryIndex(-1)

  // Add command to output
  setTerminalOutput((prev) => [...prev, `guest@portfolio:~$ ${command}`])

  switch (trimmedCommand) {
    case "help":
      setTerminalOutput((prev) => [
        ...prev,
        "",
        "Available commands:",
        "  whoami      - Get to know the developer",
        "  skills      - List technical superpowers",
        "  projects    - See my work in action",
        "  contact     - How to reach me",
        "  npm run dev - Play the Job Hunt Maze game! 🎮",
        "  clear       - Clean the terminal screen",
        "  coffee      - Check caffeine levels",
        "",
      ])
      break

    case "whoami":
      setTerminalOutput((prev) => [
        ...prev,
        "",
        "> A Full Stack Developer powered by caffeine and curiosity.",
        "> I turn complex problems into elegant code.",
        "> Version v2025.12 - Stable and ready for deployment.",
        "",
      ])
      break

    case "skills":
      setTerminalOutput((prev) => [
        ...prev,
        "",
        "Technical Superpowers:",
        "  Languages:   JavaScript, TypeScript, Python, Java, C, C++, C#",
        "  Frontend:    React, Next.js, Vue.js, Tailwind CSS",
        "  Backend:     Node.js, Express, FastAPI",
        "  Databases:   SQL, PostgreSQL, MongoDB",
        "  CS Core:     Data Structures, Algorithms, OOP",
        "  Tools:       Git, Docker, Bash",
        "  Soft Skills: Problem-solving, Team collaboration, Communication",
        "",
      ])
      break

    case "projects":
      setTerminalOutput((prev) => [
        ...prev,
        "",
        "Featured Projects:",
        "  1. E-Commerce Platform - Full-stack shopping experience",
        "  2. Task Management App - Collaborative productivity tool",
        "  3. Weather Dashboard - Real-time weather visualization",
        "  4. Portfolio Website - This VS Code themed portfolio!",
        "",
      ])
      break

    case "contact":
      setTerminalOutput((prev) => [
        ...prev,
        "",
        "How to reach me:",
        "  Email:    your.email@example.com",
        "  LinkedIn: linkedin.com/in/yourprofile",
        "  GitHub:   github.com/yourusername",
        "  Twitter:  @yourhandle",
        "",
      ])
      break

    case "coffee":
      setTerminalOutput((prev) => [
        ...prev,
        "",
        "    (",
        "     )",
        '  .-""""-.',
        "  |      |",
        "  |      |",
        "  '------'",
        "",
        "[STATUS]: Coffee levels at 15%.",
        "Warning: Brain function requires a refill (or a job offer).",
        "",
      ])
      break

    case "clear":
      setTerminalOutput(() => ["# Type 'help' to see all available commands"])
      break

    case "npm run dev":
      setTerminalOutput((prev) => [...prev, "$ npm run dev", ""])
      setTerminalOutput((prev) => [...prev, "🚀 Starting development server..."])
      setTerminalOutput((prev) => [...prev, "✓ Server ready on http://localhost:3000", ""])
      // Note: Game launch is handled in page.tsx via runNpmScript callback
      break

    default:
      if (trimmedCommand) {
        setTerminalOutput((prev) => [...prev, `Command not found: ${trimmedCommand}. Type 'help' for options.`, ""])
      } else {
        setTerminalOutput((prev) => [...prev, ""])
      }
      break
  }

  setTerminalInput("")
}

export async function typeTerminalText(text: string, setTerminalOutput: (fn: (prev: string[]) => string[]) => void, setIsTyping: (typing: boolean) => void) {
  setIsTyping(true)
  const chars = text.split("")
  let currentText = ""

  for (const char of chars) {
    currentText += char
    setTerminalOutput((prev) => [...prev.slice(0, -1), currentText])
    await new Promise((resolve) => setTimeout(resolve, 30))
  }

  setIsTyping(false)
}
