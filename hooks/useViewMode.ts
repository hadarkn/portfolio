import { useState } from "react"

export function useViewMode() {
  const [viewMode, setViewMode] = useState<"ide" | "production" | "transitioning">("ide")
  const [buildProgress, setBuildProgress] = useState(0)
  const [meltdownPhase, setMeltdownPhase] = useState<"idle" | "panic" | "takeover" | "climax" | "resolution">("idle")
  const [meltdownMessage, setMeltdownMessage] = useState("")

  return {
    viewMode,
    setViewMode,
    buildProgress,
    setBuildProgress,
    meltdownPhase,
    setMeltdownPhase,
    meltdownMessage,
    setMeltdownMessage,
  }
}
