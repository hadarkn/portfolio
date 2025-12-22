import type { FileType } from "@/lib/portfolio-types"

interface MeltdownSetters {
  setMeltdownPhase: (phase: "idle" | "panic" | "takeover" | "climax" | "resolution") => void
  setMeltdownMessage: (msg: string | ((prev: string) => string)) => void
  setTerminalOutput: (fn: (prev: string[]) => string[]) => void
}

export async function triggerMeltdownSequence({
  setMeltdownPhase,
  setMeltdownMessage,
  setTerminalOutput,
}: MeltdownSetters) {
  // Phase 1: The Meltdown (3 seconds) - Black background with rapidly scrolling red errors
  setMeltdownPhase("panic")

  const errorMessages = [
    "[FATAL] Segmentation fault in neural_network.py",
    "[ERROR] GPU Memory Overflow during XLM-R model training",
    "[CRITICAL] Infinite loop detected in Active Learning module",
    "[SYSTEM] Data corruption imminent... Searching for solution...",
    "[ERROR] Core dump initiated...",
    "[CRITICAL] Stack overflow in hire_me.dll",
    "[WARNING] Resume.pdf permissions: 777 (DANGEROUS!)",
    "[ERROR] Segmentation fault: Talent overflow",
    "[CRITICAL] Buffer exceeded: Skills too numerous",
  ]

  // Rapidly type out error messages
  for (const msg of errorMessages) {
    setMeltdownMessage((prev) => prev + "\n" + msg)
    await new Promise((resolve) => setTimeout(resolve, 150))
  }

  // Phase 2: Transition after 3 seconds - Clear and show green solution
  setTimeout(() => {
    setMeltdownPhase("resolution")
    setMeltdownMessage("")

    // Type out the solution message character by character
    const solution = "Solution found: A skilled Software Engineer is required to restore order."
    let typedText = ""
    let charIndex = 0

    const typeInterval = setInterval(() => {
      if (charIndex < solution.length) {
        typedText += solution[charIndex]
        setMeltdownMessage(typedText)
        charIndex++
      } else {
        clearInterval(typeInterval)
      }
    }, 50)
  }, 3000)
}

export function closeMeltdownSequence({
  setMeltdownPhase,
  setMeltdownMessage,
  setTerminalOutput,
}: MeltdownSetters) {
  setMeltdownPhase("idle")
  setMeltdownMessage("")
  setTerminalOutput(() => ["System restored to normal operation.", "# Type 'help' to see all available commands"])
}

export async function handleBuildSequence(
  setIsTyping: (typing: boolean) => void,
  setTerminalOutput: (fn: (prev: string[]) => string[]) => void,
) {
  setIsTyping(true)
  setTerminalOutput(() => [])

  const messages = [
    "> npm run build:candidate",
    "",
    "Building candidate profile...",
    "",
    "⚙️  Compiling technical skills... [OK]",
    "⚙️  Checking soft skills... [OK]",
    "⚙️  Analyzing problem-solving abilities... [OK]",
    "⚙️  Optimizing for teamwork... [DONE]",
    "",
    "✅ Build complete! Candidate is production-ready.",
    "💯 Performance Score: 95/100",
    "",
    "SUCCESS_LINK",
  ]

  for (let i = 0; i < messages.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 400))
    setTerminalOutput((prev) => [...prev, messages[i]])
  }

  setIsTyping(false)
}
