import { useState, useEffect, useRef } from "react"
import type { FileType } from "@/lib/portfolio-types"

export function usePortfolioState() {
  const [activeFile, setActiveFile] = useState<FileType>("AboutMe.js")
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Checking for updates...",
    "# Type 'help' to see all available commands",
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [panelHeight, setPanelHeight] = useState(208)
  const [isResizing, setIsResizing] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "hadar-portfolio": true,
    src: true,
  })
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [openTabs, setOpenTabs] = useState<FileType[]>(["AboutMe.js"])

  useEffect(() => {
    const savedTheme = localStorage.getItem("vscode-theme")
    if (savedTheme === "light") {
      setIsDarkMode(false)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("vscode-theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  return {
    activeFile,
    setActiveFile,
    terminalOutput,
    setTerminalOutput,
    isTyping,
    setIsTyping,
    terminalInput,
    setTerminalInput,
    terminalHistory,
    setTerminalHistory,
    historyIndex,
    setHistoryIndex,
    panelHeight,
    setPanelHeight,
    isResizing,
    setIsResizing,
    expandedFolders,
    setExpandedFolders,
    isDarkMode,
    setIsDarkMode,
    openTabs,
    setOpenTabs,
  }
}
