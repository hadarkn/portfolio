"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  ChevronDown,
  ChevronRight,
  Play,
  X,
  Minus,
  Square,
  FileCode2,
  Terminal,
  Search,
  GitMerge,
  AlertTriangle,
  Settings,
  Moon,
  Sun,
  Boxes,
  CheckCircle2,
  Info,
  Code2,
  Wifi,
  Files,
  Loader2,
  Check,
  FileCode,
  PlayCircle,
  User2,
  Command,
  Database,
  Download,
  Zap,
  ExternalLink,
  Mail,
  Linkedin,
  Github,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Import types
import type { FileType, ViewMode, MenuType } from "@/lib/portfolio-types"

// Import constants
import { files, fileContent, techStack } from "@/lib/portfolio-constants"

// Import hooks
import { usePortfolioState } from "@/hooks/usePortfolioState"
import { useUIState } from "@/hooks/useUIState"
import { useViewMode } from "@/hooks/useViewMode"

// Import components
import { ExplorerView } from "@/components/sidebar/ExplorerViewComponent"
import { SearchView } from "@/components/sidebar/SearchViewComponent"
import { SourceControlView } from "@/components/sidebar/SourceControlViewComponent"
import { ExtensionsView } from "@/components/sidebar/ExtensionsViewComponent"
import { MenuDropdown } from "@/components/ui/MenuDropdown"
import { SettingsRenderer } from "@/components/editor/SettingsRenderer"
import { JobHuntGame } from "@/components/terminal/JobHuntGame"
import { WelcomeScreen } from "@/components/layout/WelcomeScreen"
import { OpenFolderModal } from "@/components/layout/OpenFolderModal"
import { LoadingWorkspace } from "@/components/layout/LoadingWorkspace"

// Import utilities
import { handleSidebarSearch, getFileIcon, renderSyntaxHighlightedCode } from "@/lib/portfolio-utils"
import { handleTerminalCommand, typeTerminalText } from "@/lib/terminal-handlers"
import { getColorScheme } from "@/lib/theme-colors"
import { triggerMeltdownSequence, closeMeltdownSequence, handleBuildSequence } from "@/lib/meltdown-handlers"

export default function Portfolio() {
  // Use custom hooks for state management
  const portfolioState = usePortfolioState()
  const uiState = useUIState()
  const viewModeState = useViewMode()

  const {
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
  } = portfolioState

  const {
    sidebarView,
    setSidebarView,
    bottomPanelTab,
    setBottomPanelTab,
    workMode,
    setWorkMode,
    activeMenu,
    setActiveMenu,
    showToast,
    setShowToast,
    toastMessage,
    setToastMessage,
    showModal,
    setShowModal,
    searchQuery,
    setSearchQuery,
    isFullscreen,
    setIsFullscreen,
    searchResults,
    setSearchResults,
    cursorPos,
    setCursorPos,
    isDirty,
    setIsDirty,
    showCommandPalette,
    setShowCommandPalette,
    commandQuery,
    setCommandQuery,
    testStatus,
    setTestStatus,
    showBreadcrumbDropdown,
    setShowBreadcrumbDropdown,
    menuRef,
    commandPaletteRef,
    breadcrumbRef,
    showToastNotification,
  } = uiState

  const { viewMode, setViewMode, buildProgress, setBuildProgress, meltdownPhase, setMeltdownPhase, meltdownMessage, setMeltdownMessage } =
    viewModeState

  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const settingsMenuRef = useRef<HTMLDivElement>(null)
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const [focusedLine, setFocusedLine] = useState<number | null>(null)
  const [showRunMenu, setShowRunMenu] = useState(false)
  const runMenuRef = useRef<HTMLDivElement>(null)
  const [ephemeralFileContent, setEphemeralFileContent] = useState("")
  const [isEphemeralOpen, setIsEphemeralOpen] = useState(false)
  const [isGameRunning, setIsGameRunning] = useState(false)

  // Boot sequence states
  const [bootStage, setBootStage] = useState<'welcome' | 'modal' | 'loading' | 'ide'>('welcome')
  const [highlightedOption, setHighlightedOption] = useState<number | null>(null)
  const [typedText, setTypedText] = useState('')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  // Boot sequence animation
  useEffect(() => {
    const runBootSequence = async () => {
      // Step 1: Show Welcome (0-1s)
      await sleep(1000)
      
      // Step 2: Highlight "Open Folder" (1-2s)
      setHighlightedOption(2)
      await sleep(1000)
      
      // Step 3: Show modal and type text (2-3.5s)
      setBootStage('modal')
      const folderName = 'hadar-portfolio'
      for (let i = 0; i <= folderName.length; i++) {
        setTypedText(folderName.substring(0, i))
        await sleep(80)
      }
      await sleep(500)
      
      // Step 4: Show loading (3.5-4.5s)
      setBootStage('loading')
      for (let i = 0; i <= 100; i += 5) {
        setLoadingProgress(i)
        await sleep(50)
      }
      
      // Step 5: Transition to IDE
      setBootStage('ide')
      setSidebarCollapsed(false)
      
      // Add welcome message to terminal
      setTerminalOutput([
        'Welcome to Hadar\'s Portfolio IDE!',
        '$ Workspace loaded successfully',
        '$ Type "help" for available commands',
        ''
      ])
    }
    
    runBootSequence()
  }, [])

  // Use the new handler for top search bar input
  useEffect(() => {
    if (searchQuery.length > 0) {
      const matchingFile = files.find((file) => file.toLowerCase().includes(searchQuery.toLowerCase()))
      if (matchingFile) {
        setActiveFile(matchingFile)
      }
    }
  }, [searchQuery])

  // Handle clicks outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false)
      }
      if (runMenuRef.current && !runMenuRef.current.contains(event.target as Node)) {
        setShowRunMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const editorContainerRef = useRef<HTMLDivElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const [scrollOffset, setScrollOffset] = useState(0)

  // Handle scrollbar sync between line numbers and editor
  useEffect(() => {
    const editor = editorContainerRef.current

    if (!editor) return

    const handleEditorScroll = () => {
      setScrollOffset(editor.scrollTop)
    }

    editor.addEventListener('scroll', handleEditorScroll, { passive: true })
    return () => editor.removeEventListener('scroll', handleEditorScroll)
  }, [])

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newHeight = window.innerHeight - e.clientY
      if (newHeight >= 100 && newHeight <= 600) {
        setPanelHeight(newHeight)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  // Handle file clicks and trigger meltdown for the danger file
  const handleFileClick = (file: FileType) => {
    // Check if it's the danger file
    if (file === "DANGER_DO_NOT_OPEN.sh") {
      triggerMeltdown()
      return
    }

    // Set active file
    setActiveFile(file)

    // Add to open tabs if not already there
    if (!openTabs.includes(file)) {
      setOpenTabs((prev) => [...prev, file])
    }
  }

  const typeTerminalText = async (text: string) => {
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

  const terminalRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  useEffect(() => {
    setFocusedLine(null)
    setCursorPos((prev) => ({ ...prev, ln: 1, col: 1 }))
  }, [activeFile])

  // Cleanup ephemeral file on unmount or when switching files
  useEffect(() => {
    return () => {
      if (isEphemeralOpen) {
        setIsEphemeralOpen(false)
        setEphemeralFileContent("")
      }
    }
  }, [])

  // Also cleanup on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isEphemeralOpen) {
        // Ephemeral file is automatically cleaned up on page refresh
        // This is just for logging purposes if needed
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isEphemeralOpen])

  const triggerMeltdown = async () => {
    await triggerMeltdownSequence({
      setMeltdownPhase: setMeltdownPhase as any,
      setMeltdownMessage: setMeltdownMessage as any,
      setTerminalOutput: setTerminalOutput as any,
    })
  }

  const closeMeltdown = () => {
    closeMeltdownSequence({
      setMeltdownPhase: setMeltdownPhase as any,
      setMeltdownMessage: setMeltdownMessage as any,
      setTerminalOutput: setTerminalOutput as any,
    })
  }

  const handleBuildClick = async () => {
    await handleBuildSequence(setIsTyping, setTerminalOutput)
  }

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev)
    if (isDarkMode) {
      setTerminalOutput(["THEME_WARNING"])
    } else {
      setTerminalOutput([])
    }
  }

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => ({ ...prev, [folder]: !prev[folder] }))
  }

  const focusEditorLine = (file: FileType, line: number) => {
    setActiveFile(file)
    setFocusedLine(Math.max(0, line - 1))
    setCursorPos({ ln: line, col: 1 })
  }

  const handleTimelineSelect = (year: number) => {
    const messages: Record<number, string> = {
      2016: "2016 – Technician: Provided technical support and automation scripts.",
      2018: "2018 – Team Leader: Led a team in a security-critical environment.",
      2023: "2023 – University Start: Began Software Engineering at BGU.",
    }

    const text = messages[year] ?? `Milestone ${year}`
    setBottomPanelTab("terminal")
    setTerminalOutput((prev) => [...prev, `timeline: ${text}`])
  }

  const getColumnFromSelection = (lineElement: HTMLDivElement) => {
    const selection = window.getSelection()
    if (!selection || !lineElement.contains(selection.anchorNode)) {
      return (lineElement.textContent?.length ?? 0) + 1
    }

    let runningTotal = 0
    const walker = document.createTreeWalker(lineElement, NodeFilter.SHOW_TEXT)
    let current: Node | null = null

    while ((current = walker.nextNode())) {
      if (current === selection.anchorNode) {
        return Math.max(1, runningTotal + selection.anchorOffset + 1)
      }
      runningTotal += current.textContent?.length ?? 0
    }

    return (lineElement.textContent?.length ?? 0) + 1
  }

  const handleLineClick = (lineIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    const lineElement = event.currentTarget as HTMLDivElement
    const col = getColumnFromSelection(lineElement)

    setFocusedLine(lineIndex)
    setCursorPos({ ln: lineIndex + 1, col })
  }

  // Enhanced handleSidebarSearch with humor and better filtering
  const handleSidebarSearchInternal = (query: string) => {
    const results = handleSidebarSearch(query)
    setSearchResults(results)
  }

  const handleTopSearchChange = (value: string) => {
    setSearchQuery(value)

    // Auto-open search sidebar when typing
    if (value.length > 0 && sidebarView !== "search") {
      setSidebarView("search")
    }

    // Sync with sidebar search
    handleSidebarSearchInternal(value)
  }

  const handleSidebarSearchChange = (value: string) => {
    setSearchQuery(value) // Sync with top bar
    handleSidebarSearchInternal(value)
  }

  const handleWorkModeChange = (newMode: string) => {
    setWorkMode(newMode)
    setIsDirty(true)
  }

  const handleTerminalCommandInternal = (command: string) => {
    // Handle npm run dev separately to trigger game
    if (command.trim() === "npm run dev") {
      runNpmScript("dev")
      return
    }
    
    handleTerminalCommand({
      command,
      setTerminalOutput,
      setTerminalInput,
      setTerminalHistory,
      setHistoryIndex,
    })
  }

  const handleCommit = () => {
    setIsDirty(false)
    setTerminalOutput((prev) => [
      ...prev,
      "",
      "$ git add settings.json",
      "$ git commit -m 'Update work mode preference'",
      "[main abc1234] Update work mode preference",
      " 1 file changed, 1 insertion(+), 1 deletion(-)",
      "✓ Changes committed successfully!",
    ])
    setBottomPanelTab("terminal")
    showToastNotification("Changes committed to repository")
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "P") {
        e.preventDefault()
        setShowCommandPalette(true)
        setCommandQuery("")
      }
      if (e.key === "Escape") {
        if (isGameRunning) {
          setIsGameRunning(false)
          setTerminalOutput((prev) => [...prev, "", "🎮 Game closed.", ""])
        } else {
          setShowCommandPalette(false)
          setShowBreadcrumbDropdown(false)
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(e.target as Node)) {
        setShowCommandPalette(false)
      }
      if (breadcrumbRef.current && !breadcrumbRef.current.contains(e.target as Node)) {
        setShowBreadcrumbDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleMenuAction = (action: string) => {
    setActiveMenu(null)
    switch (action) {
      case "new-interview":
        setTerminalOutput(["📧 Opening contact form..."])
        setTimeout(() => window.open("mailto:hadarknafo@gmail.com?subject=Interview Request", "_blank"), 500)
        break
      case "open-resume":
        showToastNotification("Downloading Resume.pdf...")
        setTerminalOutput(["📄 Resume.pdf downloading..."])
        setTimeout(() => {
          const link = document.createElement('a')
          link.href = '/files/Hadar_Knafo_CV.pdf'
          link.download = 'Hadar_Knafo_CV.pdf'
          link.click()
        }, 500)
        break
      case "save-favorite":
        showToastNotification("✓ Candidate saved to favorites!")
        break
      case "exit":
        setTerminalOutput(["👋 Goodbye! Thanks for visiting my portfolio."])
        break
      case "copy-email":
        navigator.clipboard.writeText("hadarknafo@gmail.com")
        showToastNotification("✓ Email copied to clipboard!")
        break
      case "select-all-skills":
        setActiveFile("Skills.py")
        showToastNotification("✓ Skills section highlighted!")
        break
      case "undo-rejection":
        setTerminalOutput(["❌ Action not allowed - I'm the one for you! 😄"])
        break
      case "select-engineer":
        showToastNotification("❤️ Selected for Software Engineer Role!")
        break
      case "add-shortlist":
        showToastNotification("✓ Added to shortlist!")
        break
      case "toggle-theme":
        toggleTheme()
        break
      case "focus-explorer":
        setSidebarView("explorer")
        break
      case "fullscreen":
        toggleFullscreen()
        break
      case "run-build":
        handleBuildClick()
        break
      case "run-tests":
        setTestStatus("running")
        setTerminalOutput((prev) => [...prev, "", "$ npm test", "Running test suite...", ""])
        setBottomPanelTab("terminal")

        setTimeout(() => {
          setTerminalOutput((prev) => [
            ...prev,
            "✓ All tests passed (42/42)",
            "✓ Code coverage: 98.5%",
            "✓ No linting errors found",
            "",
            "Test Suites: 12 passed, 12 total",
            "Tests: 42 passed, 42 total",
            "Duration: 2.8s",
          ])
          setTestStatus("success")

          setTimeout(() => {
            setTestStatus("idle")
          }, 5000)
        }, 2500)
        break

      case "new-terminal":
        setBottomPanelTab("terminal")
        setTerminalOutput(["> New terminal session started"])
        break
      case "clear-terminal":
        setTerminalOutput([])
        break
      case "about-dev":
        setShowModal(true)
        break
      case "documentation":
        window.open("https://github.com/hadarknafo", "_blank")
        break
      case "check-updates":
        setTerminalOutput([
          "🔄 Checking for updates...",
          "",
          "✅ Candidate is always learning and updated to the latest tech stack!",
        ])
        break
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleGoLive = async () => {
    setViewMode("transitioning")
    setBottomPanelTab("terminal")
    setTerminalOutput([])
    setBuildProgress(0)

    const messages = [
      "> npm run build:production",
      "",
      "📦 Compiling production build...",
      "⚡ Optimizing assets...",
      "🎨 Generating static pages...",
      "✅ Build complete!",
      "",
      "🚀 Deploying to production...",
    ]

    for (let i = 0; i < messages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setTerminalOutput((prev) => [...prev, messages[i]])
      setBuildProgress(((i + 1) / messages.length) * 100)
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    setViewMode("production")
  }

  const handleBackToIDE = () => {
    setViewMode("ide")
    setBuildProgress(0)
  }

  const createEphemeralFile = () => {
    setActiveFile("scratchpad.md")
    setIsEphemeralOpen(true)
    setEphemeralFileContent("")
    if (!openTabs.includes("scratchpad.md")) {
      setOpenTabs((prev) => [...prev, "scratchpad.md"])
    }
  }

  const updateEphemeralContent = (content: string) => {
    setEphemeralFileContent(content)
  }

  const closeEphemeralFile = () => {
    if (isEphemeralOpen) {
      setIsEphemeralOpen(false)
      setEphemeralFileContent("")
      setOpenTabs((prev) => prev.filter((tab) => tab !== "scratchpad.md"))
      showToastNotification("scratchpad.md removed — nothing to commit.")
      if (activeFile === "scratchpad.md") {
        setActiveFile("AboutMe.js")
      }
    }
  }

  const colors = getColorScheme(isDarkMode)
  const currentLines = fileContent[activeFile]?.split("\n") ?? [""]

  const commands = [
    { label: "Change Theme", action: () => toggleTheme() },
    { label: "Run Build", action: () => handleRunMain() },
    { label: "Run Current File", action: () => handleRunCurrentFile() },
    {
      label: "Go to AboutMe.js",
      action: () => {
        setActiveFile("AboutMe.js")
        addTab("AboutMe.js")
      },
    },
    {
      label: "Go to Skills.py",
      action: () => {
        setActiveFile("Skills.py")
        addTab("Skills.py")
      },
    },
    {
      label: "Go to Projects.json",
      action: () => {
        setActiveFile("Projects.json")
        addTab("Projects.json")
      },
    },
    {
      label: "Go to Experience.cpp",
      action: () => {
        setActiveFile("Experience.cpp")
        addTab("Experience.cpp")
      },
    },
    {
      label: "Go to settings.json",
      action: () => {
        setActiveFile("settings.json")
        addTab("settings.json")
      },
    },
    { label: "Go Live", action: () => handleGoLive() },
    { label: "Clear Terminal", action: () => setTerminalOutput([]) },
    { label: "Open Search", action: () => setSidebarView("search") },
    { label: "Open Source Control", action: () => setSidebarView("source-control") },
    { label: "Open Extensions", action: () => setSidebarView("extensions") },
  ]

  const filteredCommands = commands.filter((cmd) => cmd.label.toLowerCase().includes(commandQuery.toLowerCase()))

  // Define addTab function
  const addTab = (file: FileType) => {
    if (!openTabs.includes(file)) {
      setOpenTabs((prev) => [...prev, file])
    }
  }

  const runNpmScript = async (name: string) => {
    setBottomPanelTab("terminal")

    if (name === "build") {
      await handleRunMain()
      return
    }

    if (name === "test") {
      setActiveFile("Skills.py")
      addTab("Skills.py")
      await handleRunCurrentFile("Skills.py")
      return
    }

    // dev - launch the game
    if (name === "dev") {
      setTerminalOutput((prev) => [
        ...prev,
        "$ npm run dev",
        "",
        "🎮 Starting Junior Dev Snake: Career Growth Edition...",
        "🐍 Growing Hadar's Tech Stack",
        "",
        "Controls: Arrow Keys or WASD | SPACE to pause",
        "Goal: Collect 10 career achievements to win!",
        "",
      ])
      await sleep(500)
      setIsGameRunning(true)
      return
    }
  }

  // Define handleEditorClick and handleEditorKeyUp
  const handleEditorClick = () => {
    // Placeholder for editor click logic
  }

  const handleEditorKeyUp = (e: React.KeyboardEvent) => {
    // Placeholder for editor key up logic
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      // Example of updating cursorPos
      if (e.key === "ArrowUp") {
        setCursorPos((prev) => {
          const nextLn = Math.max(1, prev.ln - 1)
          setFocusedLine(nextLn - 1)
          return { ...prev, ln: nextLn }
        })
      } else {
        setCursorPos((prev) => {
          const nextLn = prev.ln + 1
          setFocusedLine(nextLn - 1)
          return { ...prev, ln: nextLn }
        })
      }
    }
  }

  const renderSettingsEditor = () => {
    return (
      <SettingsRenderer
        workMode={workMode}
        isDarkMode={isDarkMode}
        colors={colors}
        onWorkModeChange={handleWorkModeChange}
      />
    )
  }

  const handleRunMain = async () => {
    setIsTyping(true)
    setBottomPanelTab("terminal")
    setTerminalOutput([])

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
      "📄 Downloading CV...",
      "SUCCESS_LINK",
    ]

    for (let i = 0; i < messages.length; i++) {
      await sleep(400)
      setTerminalOutput((prev) => [...prev, messages[i]])
      
      // Download CV when reaching the download message
      if (messages[i] === "📄 Downloading CV...") {
        const link = document.createElement('a')
        link.href = '/files/Hadar_Knafo_CV.pdf'
        link.download = 'Hadar_Knafo_CV.pdf'
        link.click()
      }
    }

    setIsTyping(false)
  }

  const handleRunCurrentFile = async (fileOverride?: FileType) => {
    setIsTyping(true)
    setBottomPanelTab("terminal")
    const file = fileOverride ?? activeFile
    setTerminalOutput([])

    if (file === "Skills.py") {
      const table = [
        "> python Skills.py",
        "",
        "================================================",
        "🛠️  Software Development Skill Set",
        "================================================",
        "Focus: Backend & Full-Stack Software Development",
        "",
        "",
        "Programming Languages",
        "---------------------",
        "  ✓ Java",
        "  ✓ JavaScript",
        "  ✓ Python",
        "  ✓ C",
        "  ✓ C#",
        "  ✓ C++",
        "",
        "Backend & Full-Stack Development",
        "--------------------------------",
        "  ✓ RESTful API design and implementation",
        "  ✓ Server-side logic and business rules",
        "  ✓ Database integration and query design",
        "  ✓ Modular and object-oriented system design",
        "",
        "Frameworks & Runtime",
        "--------------------",
        "  ✓ Node.js",
        "  ✓ Vue.js",
        "",
        "Databases",
        "---------",
        "  ✓ SQL (relational database design)",
        "  ✓ PostgreSQL",
        "  ✓ MongoDB",
        "",
        "Core Engineering Skills",
        "-----------------------",
        "  ✓ Data structures and algorithmic thinking",
        "  ✓ Object-Oriented Programming (OOP)",
        "  ✓ System-level problem solving",
        "  ✓ Code readability and maintainability",
        "  ✓ Debugging and troubleshooting",
        "",
        "Tools & Workflow",
        "----------------",
        "  ✓ Git (version control & collaboration)",
        "  ✓ Docker (containerized environments)",
        "  ✓ Bash (command-line workflows)",
        "  ✓ IDE-based development and debugging",
        "",
        "Collaboration & Work Practices",
        "------------------------------",
        "  ✓ Team-based software development",
        "  ✓ Code reviews and peer feedback",
        "  ✓ Writing clear and structured documentation",
        "  ✓ Breaking requirements into implementable tasks",
        "",
        "================================================",
        "End of skills.",
        "================================================",
      ]

      for (const line of table) {
        await sleep(140)
        setTerminalOutput((prev) => [...prev, line])
      }
      setIsTyping(false)
      return
    }

    if (file === "Experience.cpp") {
      const timeline = [
        "> ./experience_timeline",
        "",
        "Professional Experience Timeline",
        "--------------------------------",
        "2018–2020 | Air Intelligence Team Leader",
        "  - Led and mentored a technical team in a security-critical environment. Managed secure information systems and designed computing and data-analysis processes to improve operational efficiency.",
        "",
        "2016–2018 | Air Intelligence Technician",
        "  - Provided technical support, troubleshooting, and system maintenance. Developed automation scripts to streamline daily technical workflows.",
        "",
        "2023–Present | Reserve Service – Air Intelligence",
        "  - Active reserve service during the Iron Swords War, providing operational technical support.",
        "",
        "// TODO: Implement next role",
        "// Title: Software Engineering Intern",
        "// Status: Open to opportunities",
      ]

      for (const line of timeline) {
        await sleep(150)
        setTerminalOutput((prev) => [...prev, line])
      }
      setIsTyping(false)
      return
    }

    if (file === "Projects.json") {
      const projectCards = [
        "> node projects.json",
        "",
        "========================================",
        "📁 Academic Projects",
        "========================================",
        "",
        "📌 Recipe Management Web Application",
        "----------------------------------------",
        "Course: Web Development Environments",
        "",
        "Description:",
        "Designed and developed a full-stack web application for searching,",
        "saving, and managing recipes, with emphasis on backend logic,",
        "data persistence, and external API integration.",
        "",
        "Tech Stack:",
        "  • JavaScript",
        "  • Node.js",
        "  • REST APIs",
        "  • SQL",
        "",
        "Key Features:",
        "  ✓ Server-side business logic implementation",
        "  ✓ Relational database schema design",
        "  ✓ External Spoonacular API integration",
        "  ✓ End-to-end feature development",
        "",
        "----------------------------------------",
        "",
        "📌 Super-Lee Suppliers Management System",
        "----------------------------------------",
        "Course: Software Systems Analysis and Design",
        "",
        "Description:",
        "Implemented a backend supplier management module handling agreements,",
        "delivery constraints, and pricing rules as part of a larger system.",
        "",
        "Tech Stack:",
        "  • Java",
        "  • Object-Oriented Programming",
        "  • Data Structures",
        "  • Git",
        "",
        "Methodology:",
        "  Modular, object-oriented system design in a collaborative team",
        "  environment.",
        "",
        "========================================",
        "End of projects.",
        "========================================" ,
      ]

      for (const line of projectCards) {
        await sleep(140)
        setTerminalOutput((prev) => [...prev, line])
      }
      setIsTyping(false)
      return
    }

    if (file === "AboutMe.js") {
      const aboutCard = [
        "> node aboutme.js",
        "",
        "==============================================",
        "👩‍💻 Developer Profile",
        "==============================================",
        "",
        "Name:",
        "  Hadar Knafo",
        "",
        "Headline:",
        "  Fourth-Year Software & Information Systems Engineering Student",
        "  Backend & Full-Stack Focus",
        "",
        "----------------------------------------------",
        "🎓 Education",
        "----------------------------------------------",
        "Degree:",
        "  B.Sc. in Software and Information Systems Engineering",
        "",
        "Institution:",
        "  Ben-Gurion University of the Negev",
        "",
        "Status:",
        "  Fourth-year student",
        "",
        "GPA:",
        "  85",
        "",
        "Honors:",
        "  • Moshal Program Member – leadership and excellence track",
        "",
        "Academic Strengths:",
        "  ✓ Operating Systems",
        "  ✓ Algorithms",
        "  ✓ Advanced Topics in Software Development",
        "",
        "----------------------------------------------",
        "🧠 About",
        "----------------------------------------------",
        "I am a fourth-year Software and Information Systems Engineering student",
        "at Ben-Gurion University of the Negev, with a strong academic foundation",
        "and a clear focus on software development.",
        "",
        "My primary interests lie in backend and full-stack development, where",
        "I enjoy designing system logic, working with data and APIs, and building",
        "end-to-end features that translate real requirements into reliable,",
        "maintainable software.",
        "",
        "----------------------------------------------",
        "⭐ Highlights",
        "----------------------------------------------",
        "  ✓ Strong academic performance in core CS courses",
        "  ✓ Hands-on backend and full-stack development experience",
        "  ✓ Moshal Program – leadership & excellence",
        "  ✓ STEM Aspire Mentorship at Dell Technologies",
        "  ✓ Outstanding Soldier award recipient",
        "  ✓ Technical leadership & automation background",
        "",
        "----------------------------------------------",
        "📬 Contact",
        "----------------------------------------------",
        "Email:      Hadarknafo@gmail.com",
        "LinkedIn:   linkedin.com/in/hadar-knafo",
        "Phone:      054-3552316",
        "Location:   Israel (GMT+2)",
        "",
        "----------------------------------------------",
        "🚀 Availability",
        "----------------------------------------------",
        "Target Role:",
        "  Software Engineering Intern / Student Developer",
        "",
        "Start Date:",
        "  Immediate",
        "",
        "Work Mode:",
        "  On-site | Hybrid | Remote",
        "",
        "==============================================",
        "End of profile.",
        "==============================================",
      ]

      for (const line of aboutCard) {
        await sleep(140)
        setTerminalOutput((prev) => [...prev, line])
      }
      setIsTyping(false)
      return
    }

    // Fallback to main build if file not matched
    await handleRunMain()
  }

  const renderMenuDropdownUI = (menuName: MenuType) => {
    return (
      <MenuDropdown
        menuName={menuName}
        activeMenu={activeMenu}
        isDarkMode={isDarkMode}
        colors={colors}
        onMenuAction={handleMenuAction}
      />
    )
  }

  // Render production view
  if (viewMode === "production") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white font-sans">
        {/* Floating Back Button */}
        <button
          onClick={handleBackToIDE}
          className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 group"
        >
          <Code2 className="w-4 h-4" />
          <span className="text-sm font-medium">View Source Code</span>
        </button>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium animate-fade-in">
              ✅ Available for Hire
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-fade-in-up">
              Hadar Knafo
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up delay-200">
              Fourth-Year Software & Information Systems Engineering Student
            </p>

            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-300">
              Backend & Full-Stack Developer | Passionate about building modular systems and reliable APIs
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up delay-300">
              <button
                onClick={() => {
                  window.location.href = "mailto:hadarknafo@gmail.com"
                }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50"
              >
                Schedule Interview
              </button>
              <button
                onClick={handleBackToIDE}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-lg font-semibold transition-all duration-300"
              >
                View Code
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 max-w-xl mx-auto animate-fade-in-up delay-400">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">85</div>
                <div className="text-sm text-gray-400">GPA Average</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400 mb-2">BGU</div>
                <div className="text-sm text-gray-400">Ben-Gurion University</div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Technical Expertise
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Java", level: "Proficient", color: "from-red-400 to-orange-400" },
                { name: "JavaScript", level: "Proficient", color: "from-yellow-400 to-yellow-200" },
                { name: "Node.js", level: "Proficient", color: "from-green-400 to-emerald-400" },
                { name: "Python", level: "Proficient", color: "from-blue-400 to-blue-600" },
                { name: "SQL", level: "Proficient", color: "from-orange-400 to-red-400" },
                { name: "PostgreSQL", level: "Proficient", color: "from-blue-600 to-blue-800" },
                { name: "Git", level: "Proficient", color: "from-red-500 to-orange-500" },
                { name: "Vue.js", level: "Familiar", color: "from-green-500 to-teal-500" },
              ].map((skill, index) => (
                <div
                  key={skill.name}
                  className="group relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}
                  ></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
                    <p className="text-sm text-gray-400">{skill.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Featured Projects
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Recipe Management Web Application",
                  description:
                    "Full-stack web application for searching, saving, and managing recipes with backend logic, database integration, and external Spoonacular API consumption.",
                  tech: ["JavaScript", "Node.js", "SQL", "REST APIs"],
                  gradient: "from-blue-500 to-purple-500",
                },
                {
                  title: "Super-Lee Suppliers Management System",
                  description: "Backend supplier management module handling agreements, delivery constraints, and pricing rules developed collaboratively in a team environment.",
                  tech: ["Java", "OOP", "Git", "Data Structures"],
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  title: "Academic Projects Portfolio",
                  description: "Multiple projects focusing on algorithms, data structures, operating systems, and software development best practices.",
                  tech: ["C", "C++", "C#", "Python"],
                  gradient: "from-pink-500 to-red-500",
                },
              ].map((project, index) => (
                <div
                  key={project.title}
                  className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>

                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Let's Build Something Together
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Seeking a Software Engineering Internship where I can contribute to real-world systems, grow as a developer, and build strong engineering foundations.
            </p>
            <div className="flex flex-col items-center gap-2 mb-8 text-gray-400">
              <p>📧 hadarknafo@gmail.com</p>
              <p>📱 054-3552316</p>
              <p>🔗 linkedin.com/in/hadar-knafo</p>
            </div>
            <button
              onClick={() => {
                window.location.href = "mailto:hadarknafo@gmail.com"
              }}
              className="px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              Get In Touch
            </button>
          </div>
        </section>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.8s ease-out;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out;
          }

          .delay-200 {
            animation-delay: 0.2s;
            animation-fill-mode: backwards;
          }

          .delay-300 {
            animation-delay: 0.3s;
            animation-fill-mode: backwards;
          }

          .delay-400 {
            animation-delay: 0.4s;
            animation-fill-mode: backwards;
          }

          .delay-1000 {
            animation-delay: 1s;
          }
        `}</style>
      </div>
    )
  }

  // Render boot sequence screens
  if (bootStage === 'welcome') {
    return <WelcomeScreen isDarkMode={isDarkMode} highlightedOption={highlightedOption} />
  }

  if (bootStage === 'modal') {
    return (
      <>
        <WelcomeScreen isDarkMode={isDarkMode} highlightedOption={2} />
        <OpenFolderModal isDarkMode={isDarkMode} typedText={typedText} />
      </>
    )
  }

  if (bootStage === 'loading') {
    return <LoadingWorkspace isDarkMode={isDarkMode} progress={loadingProgress} />
  }

  // Render IDE view
  return (
    <div
      className={`flex flex-col h-screen ${colors.bg} ${colors.text} font-sans overflow-hidden transition-all duration-300 ${viewMode === "transitioning" ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}
    >
      {/* Menu Bar */}
      <div
        ref={menuRef}
        className={`flex items-center h-[35px] ${colors.menuBar} border-b ${colors.borderDark} px-2 text-[13px] transition-colors duration-300`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* VS Code Logo */}
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
              <path
                d="M95.6 19.4L74.2 6.7c-1.8-1.1-4.1-1.1-5.9 0L29.7 31.8 12.5 18.6c-1.5-1.2-3.7-.9-4.9.5L2.4 25c-1.2 1.4-1.1 3.5.2 4.8l14.3 12.7L2.6 55.2c-1.3 1.3-1.4 3.4-.2 4.8l5.2 5.9c1.2 1.4 3.4 1.7 4.9.5l17.2-13.2 38.6 25.1c.9.6 1.9.9 2.9.9s2-.3 2.9-.9l21.4-12.7c1.8-1.1 2.9-3 2.9-5.1V24.5c.1-2.1-1-4-2.8-5.1zM68.4 67.3L40.7 48.4l27.7-18.9v37.8z"
                fill="#007acc"
              />
            </svg>
          </div>
          <div className={`flex items-center gap-3 ml-4 ${isDarkMode ? "text-[#cccccc]/90" : "text-[#1e1e1e]/90"}`}>
            {(["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"] as MenuType[]).map((menuName) => (
              <div key={menuName} className="relative">
                <span
                  onClick={() => setActiveMenu(activeMenu === menuName ? null : menuName)}
                  className={`${isDarkMode ? "hover:text-white" : "hover:text-black"} cursor-pointer ${activeMenu === menuName ? (isDarkMode ? "text-white" : "text-black") : ""}`}
                >
                  {menuName}
                </span>
                {renderMenuDropdownUI(menuName)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div
            className={`flex items-center gap-2 ${colors.searchBg} ${colors.inputBorder} rounded px-3 py-1 w-96 transition-colors duration-300`}
          >
            <Search className="w-3 h-3 opacity-50" />
            <input
              type="text"
              placeholder="portfolio"
              value={searchQuery}
              onChange={(e) => handleTopSearchChange(e.target.value)} // Use new handler
              className={`bg-transparent outline-none text-[13px] flex-1 ${isDarkMode ? "placeholder:text-[#858585]" : "placeholder:text-[#6e6e6e]"}`}
            />
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded ${colors.hover} transition-colors duration-300`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Window controls */}
        <div className="flex items-center gap-2 ml-4">
          <button className={`p-1 ${colors.hover} rounded`}>
            <Minus className="w-3 h-3" />
          </button>
          <button onClick={toggleFullscreen} className={`p-1 ${colors.hover} rounded`}>
            <Square className="w-3 h-3" />
          </button>
          <button className={`p-1 hover:bg-red-600 rounded`}>
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {showToast && (
        <div
          className={`fixed top-16 right-4 ${isDarkMode ? "bg-[#323233]" : "bg-[#f3f3f3]"} border ${isDarkMode ? "border-[#454545]" : "border-[#d4d4d4]"} rounded shadow-lg px-4 py-3 z-50 flex items-center gap-3 animate-in slide-in-from-right`}
        >
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-[13px]">{toastMessage}</span>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className={`${isDarkMode ? "bg-[#252526]" : "bg-[#f3f3f3]"} border ${isDarkMode ? "border-[#454545]" : "border-[#d4d4d4]"} rounded-lg shadow-2xl p-6 max-w-md`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Info className="w-5 h-5" />
                About the Developer
              </h2>
              <button onClick={() => setShowModal(false)} className={`${colors.hover} p-1 rounded`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-[13px]">
              <p>
                <strong>Name:</strong> Hadar Knafo
              </p>
              <p>
                <strong>Role:</strong> 4th-year Software & Information Systems Engineering student (BGU)
              </p>
              <p>
                <strong>Location:</strong> Israel
              </p>
              <p className="pt-2">
                Fourth-year Software & Information Systems Engineering student building real systems. I focus on backend
                and full-stack development, building end-to-end features, working with APIs and databases, and designing
                systems that actually solve problems—not just academic exercises. I value clean, maintainable code and
                learn new technologies quickly. Whether it's backend logic, data integration, or connecting components
                into working applications, I focus on delivering solutions that work.
              </p>
              <p className="pt-2">
                <strong>Looking For:</strong> Software Engineering Intern / Student Developer roles
              </p>
              <p>
                <strong>Motivation:</strong> Hands-on experience in development teams, real responsibility, and growth
              </p>
              <div className="pt-4 flex gap-2">
                <Button
                  onClick={() => window.open("mailto:hadarknafo@gmail.com", "_blank")}
                  className={`flex-1 h-8 text-[13px] ${isDarkMode ? "bg-[#0e639c] hover:bg-[#1177bb]" : "bg-[#0078d4] hover:bg-[#006cc1]"}`}
                >
                  Contact Me
                </Button>
                <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1 h-8 text-[13px]">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div
          className={`w-12 ${colors.activityBar} border-r ${colors.borderDark} flex flex-col items-center py-2 gap-4 transition-colors duration-300`}
        >
          <button
            onClick={() => setSidebarView("explorer")}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer relative transition-colors ${
              sidebarView === "explorer"
                ? "text-white"
                : isDarkMode
                  ? "text-[#858585] hover:text-white"
                  : "text-[#6e6e6e] hover:text-white"
            }`}
          >
            {sidebarView === "explorer" && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>}
            <Files className="w-6 h-6" />
          </button>
          <button
            onClick={() => setSidebarView("search")}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer relative transition-colors ${
              sidebarView === "search"
                ? "text-white"
                : isDarkMode
                  ? "text-[#858585] hover:text-white"
                  : "text-[#6e6e6e] hover:text-white"
            }`}
          >
            {sidebarView === "search" && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>}
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarView("source-control")}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer relative transition-colors ${
              sidebarView === "source-control"
                ? "text-white"
                : isDarkMode
                  ? "text-[#858585] hover:text-white"
                  : "text-[#6e6e6e] hover:text-white"
            }`}
          >
            {sidebarView === "source-control" && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>}
            <GitMerge className="w-5 h-5" />
            {isDirty && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-[#007acc] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                1
              </div>
            )}
          </button>
          <button
            onClick={() => setSidebarView("run")}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer relative transition-colors ${
              sidebarView === "run"
                ? "text-white"
                : isDarkMode
                  ? "text-[#858585] hover:text-white"
                  : "text-[#6e6e6e] hover:text-white"
            }`}
          >
            {sidebarView === "run" && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>}
            <PlayCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarView("extensions")}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer relative transition-colors ${
              sidebarView === "extensions"
                ? "text-white"
                : isDarkMode
                  ? "text-[#858585] hover:text-white"
                  : "text-[#6e6e6e] hover:text-white"
            }`}
          >
            {sidebarView === "extensions" && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>}
            <Boxes className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSidebarView("account")}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer relative transition-colors ${
              sidebarView === "account"
                ? "text-white"
                : isDarkMode
                  ? "text-[#858585] hover:text-white"
                  : "text-[#6e6e6e] hover:text-white"
            }`}
          >
            {sidebarView === "account" && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>}
            <User2 className="w-5 h-5" />
          </button>

          {/* Database Button for Grades */}
          <button
            onClick={() => setSidebarView("database")}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer relative transition-colors ${
              sidebarView === "database"
                ? "text-white"
                : isDarkMode
                  ? "text-[#858585] hover:text-white"
                  : "text-[#6e6e6e] hover:text-white"
            }`}
            title="Download Grades"
          >
            {sidebarView === "database" && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>}
            <Database className="w-5 h-5" />
          </button>

          {/* Service Button */}
          <button
            onClick={() => setSidebarView("service")}
            className={`w-10 h-10 flex items-center justify-center cursor-pointer relative transition-colors ${
              sidebarView === "service"
                ? "text-white"
                : isDarkMode
                  ? "text-[#858585] hover:text-white"
                  : "text-[#6e6e6e] hover:text-white"
            }`}
            title="Services & Links"
          >
            {sidebarView === "service" && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white"></div>}
            <Zap className="w-5 h-5" />
          </button>
          <div className="relative mt-auto" ref={settingsMenuRef}>
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className={`w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 relative group ${
                showSettingsMenu || activeFile === "settings.json"
                  ? "text-white bg-[#37373d]"
                  : isDarkMode
                    ? "text-[#858585] hover:text-white hover:bg-[#2a2d2e]"
                    : "text-[#6e6e6e] hover:text-white hover:bg-[#e8e8e8]"
              }`}
            >
              <Settings className={`w-5 h-5 transition-transform duration-300 ${showSettingsMenu ? "rotate-90" : "group-hover:rotate-45"}`} />
            </button>
            
            {showSettingsMenu && (
              <div
                className={`absolute bottom-full left-12 mb-0 ${isDarkMode ? "bg-[#252526]" : "bg-[#f3f3f3]"} border ${isDarkMode ? "border-[#454545]" : "border-[#d4d4d4]"} rounded shadow-2xl min-w-[280px] py-1 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-200`}
              >
                <div className={`px-4 py-2 text-[11px] font-semibold ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} uppercase tracking-wider`}>
                  Settings
                </div>
                <button
                  onClick={() => {
                    setActiveFile("settings.json")
                    addTab("settings.json")
                    setSidebarView("explorer")
                    setShowSettingsMenu(false)
                  }}
                  className={`w-full px-4 py-2 text-[13px] text-left ${isDarkMode ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8e8e8]"} flex items-center gap-3 transition-colors`}
                >
                  <FileCode className="w-4 h-4" />
                  <span>Settings (JSON)</span>
                  <span className={`ml-auto text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>Ctrl+,</span>
                </button>
                <button
                  onClick={() => {
                    setSidebarView("extensions")
                    setShowSettingsMenu(false)
                  }}
                  className={`w-full px-4 py-2 text-[13px] text-left ${isDarkMode ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8e8e8]"} flex items-center gap-3 transition-colors`}
                >
                  <Boxes className="w-4 h-4" />
                  <span>Extensions</span>
                  <span className={`ml-auto text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>Ctrl+Shift+X</span>
                </button>
                <div className={`h-px ${isDarkMode ? "bg-[#454545]" : "bg-[#d4d4d4]"} my-1`} />
                <button
                  onClick={() => {
                    toggleTheme()
                    setShowSettingsMenu(false)
                  }}
                  className={`w-full px-4 py-2 text-[13px] text-left ${isDarkMode ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8e8e8]"} flex items-center gap-3 transition-colors`}
                >
                  {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span>Theme: {isDarkMode ? "Dark" : "Light"}</span>
                </button>
                <button
                  onClick={() => {
                    setShowCommandPalette(true)
                    setShowSettingsMenu(false)
                  }}
                  className={`w-full px-4 py-2 text-[13px] text-left ${isDarkMode ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8e8e8]"} flex items-center gap-3 transition-colors`}
                >
                  <Search className="w-4 h-4" />
                  <span>Command Palette</span>
                  <span className={`ml-auto text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>Ctrl+Shift+P</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`${sidebarCollapsed ? 'w-0' : 'w-64'} border-r ${colors.borderDark} flex flex-col text-[13px] overflow-y-auto transition-all duration-500 ease-out`}
          style={{ 
            overflow: sidebarCollapsed ? 'hidden' : 'auto',
            backgroundColor: isDarkMode ? '#252526' : '#f3f3f3'
          }}
        >
          {!sidebarCollapsed && (
            <>
              {sidebarView === "explorer" ? (
            <ExplorerView
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              activeFile={activeFile}
              handleFileClick={handleFileClick}
              colors={colors}
              isDarkMode={isDarkMode}
              getFileIcon={getFileIcon}
              onFocusLine={focusEditorLine}
              onTimelineSelect={handleTimelineSelect}
              onRunScript={runNpmScript}
              onCreateEphemeralFile={createEphemeralFile}
            />
          ) : sidebarView === "search" ? (
            <SearchView
              searchQuery={searchQuery}
              onSearchChange={handleSidebarSearchChange}
              searchResults={searchResults}
              isDarkMode={isDarkMode}
              colors={colors}
              onResultClick={(file, line) => {
                setActiveFile(file)
                if (!openTabs.includes(file)) {
                  setOpenTabs([...openTabs, file])
                }
              }}
            />
          ) : sidebarView === "source-control" ? (
            <SourceControlView
              isDirty={isDirty}
              isDarkMode={isDarkMode}
              colors={colors}
              onCommit={handleCommit}
            />
          ) : sidebarView === "run" ? (
            <div className="p-3 flex flex-col gap-3">
              <div className={`text-[11px] uppercase tracking-wide ${colors.text}`}>Run & Debug</div>
              <button
                onClick={handleRunMain}
                className={`w-full px-3 py-2 rounded text-left flex items-center gap-2 text-[13px] ${isDarkMode ? "bg-[#0e639c] hover:bg-[#1177bb]" : "bg-[#0078d4] hover:bg-[#006cc1]"} text-white transition-colors`}
              >
                <Play className="w-4 h-4" /> Run Main
              </button>
              <button
                onClick={() => handleRunCurrentFile()}
                className={`w-full px-3 py-2 rounded text-left flex items-center gap-2 text-[13px] ${colors.hover} transition-colors`}
              >
                <Play className="w-4 h-4" /> Run Current File
              </button>
              <div className={`text-[12px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>
                Quick access to run flows, similar to VS Code Run & Debug panel.
              </div>
            </div>
          ) : sidebarView === "account" ? (
            <div className="p-3 flex flex-col gap-3">
              <div className={`text-[11px] uppercase tracking-wide ${colors.text}`}>Account</div>
              <div className={`p-3 rounded ${colors.hover} text-[13px] flex items-center gap-3`}>
                <User2 className="w-5 h-5" />
                <div>
                  <div className="font-semibold">Hadar Knafo</div>
                  <div className={`text-[12px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>
                    Software Engineering Student
                  </div>
                </div>
              </div>
              <div className={`text-[12px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>
                Future spot for auth/profile actions, mirroring VS Code accounts.
              </div>
            </div>
          ) : sidebarView === "database" ? (
            <div className="p-3 flex flex-col gap-4">
              <div className={`text-[11px] uppercase tracking-wide ${colors.text} flex items-center gap-2`}>
                <Database className="w-4 h-4" />
                Grades Database
              </div>
              <div className={`p-4 rounded border ${isDarkMode ? "border-[#3e3e42] bg-[#2d2d30]" : "border-[#d4d4d4] bg-[#f5f5f5]"} text-[13px] space-y-3`}>
                <div>
                  <div className="font-semibold mb-2">Academic Grades</div>
                  <div className={`text-[12px] ${isDarkMode ? "text-[#cccccc]" : "text-[#333333]"} mb-3`}>
                    Download your BGU grades and academic record
                  </div>
                  <button
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = '/files/AcademicRecord.pdf'
                      link.download = 'AcademicRecord.pdf'
                      link.click()
                      showToastNotification('✓ Academic record downloaded successfully!')
                    }}
                    className={`w-full px-3 py-2 rounded text-left flex items-center gap-2 text-[13px] ${isDarkMode ? "bg-[#0e639c] hover:bg-[#1177bb]" : "bg-[#0078d4] hover:bg-[#006cc1]"} text-white transition-colors`}
                  >
                    <Download className="w-4 h-4" />
                    Download as CSV
                  </button>
                </div>
              </div>
            </div>
          ) : sidebarView === "service" ? (
            <div className="p-3 flex flex-col gap-4">
              <div className={`text-[11px] uppercase tracking-wide ${colors.text} flex items-center gap-2`}>
                <Zap className="w-4 h-4" />
                Services & Integration
              </div>
              
              {/* Contact Section */}
              <div className={`p-4 rounded border ${isDarkMode ? "border-[#3e3e42] bg-[#2d2d30]" : "border-[#d4d4d4] bg-[#f5f5f5]"} text-[13px] space-y-3`}>
                <div className="font-semibold mb-3">📧 Contact Information</div>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open("mailto:Hadarknafo@gmail.com")}
                    className={`w-full px-3 py-2 rounded flex items-center gap-2 text-[12px] ${isDarkMode ? "hover:bg-[#3c3c3c]" : "hover:bg-[#efefef]"} transition-colors`}
                  >
                    <Mail className="w-4 h-4 text-[#007acc]" />
                    Hadarknafo@gmail.com
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </button>
                  <button
                    onClick={() => window.open("tel:054-3552316")}
                    className={`w-full px-3 py-2 rounded flex items-center gap-2 text-[12px] ${isDarkMode ? "hover:bg-[#3c3c3c]" : "hover:bg-[#efefef]"} transition-colors`}
                  >
                    <Zap className="w-4 h-4 text-[#07a41e]" />
                    054-3552316 (Israel)
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className={`p-4 rounded border ${isDarkMode ? "border-[#3e3e42] bg-[#2d2d30]" : "border-[#d4d4d4] bg-[#f5f5f5]"} text-[13px] space-y-3`}>
                <div className="font-semibold mb-3">🔗 Social & Professional</div>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open("https://linkedin.com/in/hadar-knafo")}
                    className={`w-full px-3 py-2 rounded flex items-center gap-2 text-[12px] ${isDarkMode ? "hover:bg-[#3c3c3c]" : "hover:bg-[#efefef]"} transition-colors`}
                  >
                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                    LinkedIn Profile
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </button>
                  <button
                    onClick={() => window.open("https://github.com")}
                    className={`w-full px-3 py-2 rounded flex items-center gap-2 text-[12px] ${isDarkMode ? "hover:bg-[#3c3c3c]" : "hover:bg-[#efefef]"} transition-colors`}
                  >
                    <Github className="w-4 h-4" />
                    GitHub Profile
                    <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                  </button>
                </div>
              </div>

              {/* API & Services */}
              <div className={`p-4 rounded border ${isDarkMode ? "border-[#3e3e42] bg-[#2d2d30]" : "border-[#d4d4d4] bg-[#f5f5f5]"} text-[13px] space-y-3`}>
                <div className="font-semibold mb-3">⚙️ Available Services</div>
                <div className="space-y-2">
                  <div className={`px-3 py-2 rounded ${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"} text-[12px]`}>
                    <div className="font-semibold text-[#07a41e] mb-1">✓ Portfolio API</div>
                    <div className={isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}>REST API for portfolio data</div>
                  </div>
                  <div className={`px-3 py-2 rounded ${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"} text-[12px]`}>
                    <div className="font-semibold text-[#07a41e] mb-1">✓ Contact Service</div>
                    <div className={isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}>Direct messaging & contact</div>
                  </div>
                  <div className={`px-3 py-2 rounded ${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"} text-[12px]`}>
                    <div className="font-semibold text-[#07a41e] mb-1">✓ Resume Download</div>
                    <div className={isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}>PDF & CV available</div>
                  </div>
                </div>
              </div>
            </div>
          ) : sidebarView === "extensions" ? (
            <ExtensionsView techStack={techStack} isDarkMode={isDarkMode} colors={colors} />
          ) : null}
            </>
          )}
        </div>

        {/* Main Editor Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs */}
          <div
            className={`flex items-center ${colors.tabBg} ${colors.border} border-b h-[35px] transition-colors duration-300`}
          >
            {openTabs.map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveFile(tab)}
                className={`group flex items-center gap-2 px-3 h-full ${colors.border} border-r cursor-pointer transition-colors ${
                  activeFile === tab ? colors.tabActive : `${colors.tabInactive} ${colors.hover}`
                }`}
              >
                {getFileIcon(tab)}
                <span className="text-[13px]">{tab}</span>
                {tab === "settings.json" && isDirty ? (
                  <div className="w-2 h-2 rounded-full bg-white ml-1"></div>
                ) : (
                  <X
                    className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (tab === "scratchpad.md") {
                        closeEphemeralFile()
                      } else {
                        setOpenTabs(openTabs.filter((f) => f !== tab))
                        if (activeFile === tab && openTabs.length > 1) {
                          setActiveFile(openTabs[openTabs.indexOf(tab) - 1] || openTabs[openTabs.indexOf(tab) + 1])
                        } else if (activeFile === tab && openTabs.length === 1) {
                          setActiveFile(files[0]) // Default to first file if it's the only one
                        }
                      }
                    }}
                  />
                )}
              </div>
            ))}

            <div className={`ml-auto mr-2 flex items-stretch relative rounded border ${isDarkMode ? "border-[#1177bb]" : "border-[#006cc1]"}`} ref={runMenuRef}>
              <Button
                onClick={handleRunMain}
                disabled={isTyping}
                className={`h-7 px-3 text-[13px] rounded-none ${isDarkMode ? "bg-[#0e639c] hover:bg-[#1177bb]" : "bg-[#0078d4] hover:bg-[#006cc1]"} text-white font-medium transition-colors border-0`}
              >
                <Play className="w-3 h-3 mr-1" />
                Run
              </Button>
              <div className={`w-px ${isDarkMode ? "bg-[#1177bb]" : "bg-[#006cc1]"}`}></div>
              <Button
                onClick={() => setShowRunMenu((prev) => !prev)}
                disabled={isTyping}
                variant="outline"
                className={`h-7 px-2 rounded-none ${isDarkMode ? "bg-[#0e639c] hover:bg-[#1177bb]" : "bg-[#0078d4] hover:bg-[#006cc1]"} transition-colors text-white border-0`}
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${showRunMenu ? "rotate-180" : ""}`} />
              </Button>

              {showRunMenu && (
                <div
                  className={`${isDarkMode ? "bg-[#252526]" : "bg-white"} ${colors.border} border rounded shadow-lg absolute right-0 top-full mt-1 min-w-[180px] z-40`}
                >
                  <button
                    onClick={() => {
                      setShowRunMenu(false)
                      handleRunMain()
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] ${isDarkMode ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8e8e8]"}`}
                  >
                    Run Main
                  </button>
                  <button
                    onClick={() => {
                      setShowRunMenu(false)
                      handleRunCurrentFile()
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] ${isDarkMode ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8e8e8]"}`}
                  >
                    Run Current File
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={`flex items-center gap-1 px-4 h-[22px] ${isDarkMode ? "bg-[#2d2d30]" : "bg-[#f3f3f3]"} ${colors.border} border-b text-[12px]`}
          >
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className={`${isDarkMode ? "text-[#cccccc]" : "text-[#1e1e1e]"} cursor-pointer hover:underline`}>
              hadar-portfolio
            </span>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <div className="relative" ref={breadcrumbRef}>
              <span
                className={`${isDarkMode ? "text-[#cccccc]" : "text-[#1e1e1e]"} cursor-pointer hover:underline`}
                onClick={() => setShowBreadcrumbDropdown(!showBreadcrumbDropdown)}
              >
                src
              </span>
              {showBreadcrumbDropdown && (
                <div
                  className={`absolute top-full left-0 mt-1 ${isDarkMode ? "bg-[#3c3c3c]" : "bg-white"} ${colors.border} border rounded shadow-lg z-50 min-w-[200px]`}
                >
                  {files.map((file) => (
                    <div
                      key={file}
                      onClick={() => {
                        setActiveFile(file)
                        // addTab(file) // No need to call addTab here, handled by handleFileClick
                        setShowBreadcrumbDropdown(false)
                      }}
                      className={`flex items-center gap-2 px-3 py-2 text-[13px] cursor-pointer ${colors.hover} transition-colors`}
                    >
                      {getFileIcon(file)}
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className={`${isDarkMode ? "text-[#3794ff]" : "text-[#0078d4]"} font-semibold`}>{activeFile}</span>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Line Numbers Container */}
            <div className={`${colors.lineNumberBg} flex-shrink-0 w-12 ${colors.border} border-r overflow-hidden relative`}>
              <div
                ref={lineNumbersRef}
                className={`${colors.lineNumberText} text-right pr-2 pt-2 text-[13px] leading-[21px] select-none`}
                style={{ 
                  transform: `translateY(-${scrollOffset}px)`,
                  willChange: 'transform'
                }}
              >
                {Array.from({ length: Math.max(currentLines.length, 1) }, (_, i) => {
                  const lineNum = i + 1
                  const isFocused = focusedLine === i
                  return (
                    <div
                      key={lineNum}
                      className={`${isFocused ? (isDarkMode ? 'bg-[#3c3c3c]' : 'bg-[#e0e0e0]') : ''}`}
                    >
                      {lineNum}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Main Editor Area */}
            <div
              ref={editorContainerRef}
              className="flex-1 overflow-auto pt-2 px-4"
              onClick={handleEditorClick}
              onKeyUp={handleEditorKeyUp}
              tabIndex={0}
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: isDarkMode ? '#424242 transparent' : '#c9c9c9 transparent'
              }}
            >
              {activeFile === "settings.json" ? (
                renderSettingsEditor()
              ) : activeFile === "scratchpad.md" && isEphemeralOpen ? (
                <textarea
                  value={ephemeralFileContent}
                  onChange={(e) => updateEphemeralContent(e.target.value)}
                  className={`w-full h-full font-mono text-[14px] resize-none border-none outline-none p-0 ${
                    isDarkMode
                      ? "bg-[#1e1e1e] text-[#d4d4d4]"
                      : "bg-[#ffffff] text-[#1e1e1e]"
                  }`}
                  placeholder="Start typing..."
                  autoFocus
                />
              ) : (
                <div className="font-mono text-[13px] leading-[21px] whitespace-pre-wrap space-y-0">
                  {currentLines.map((line, idx) => {
                    const isFocused = focusedLine === idx
                    const focusClass = isFocused
                      ? isDarkMode
                        ? "bg-[#2d2d30]"
                        : "bg-[#e8e8e8]"
                      : ""

                    return (
                      <div
                        key={idx}
                        onMouseUp={(e) => handleLineClick(idx, e)}
                        onClick={(e) => handleLineClick(idx, e)}
                        className={`relative px-2 py-0 rounded transition-colors duration-75 ${focusClass}`}
                      >
                        <span
                          className={isDarkMode ? "text-[#d4d4d4]" : "text-[#1e1e1e]"}
                          dangerouslySetInnerHTML={{ __html: renderSyntaxHighlightedCode(line, isDarkMode).slice(0, 120) }}
                        />
                        {isFocused && (
                          <span
                            className={`inline-block w-[2px] h-4 ${isDarkMode ? "bg-[#3794ff]" : "bg-[#0078d4]"} animate-pulse align-middle ml-0.5`}
                          ></span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            }
            </div>

            {/* Minimap - Compact Code Preview */}
            <div
              className={`w-16 ${colors.minimapBg} border-l ${colors.borderDark} overflow-hidden transition-colors duration-300 flex flex-col`}
            >
              <div className="p-1 font-mono text-[6px] leading-[8px] opacity-50 select-none whitespace-pre flex-1 overflow-y-auto">
                {currentLines.slice(0, 500).map((line, i) => (
                  <div key={i} className="truncate text-[5px] h-1">
                    <span
                      dangerouslySetInnerHTML={{ __html: renderSyntaxHighlightedCode(line, isDarkMode).slice(0, 80) }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div
        style={{ height: `${panelHeight}px` }}
        className={`${colors.terminalBg} border-t ${colors.borderDark} flex flex-col transition-colors duration-300 relative`}
      >
        <div
          onMouseDown={handleMouseDown}
          className={`absolute top-0 left-0 right-0 h-1 cursor-ns-resize hover:bg-[#3794ff] transition-colors ${
            isResizing ? "bg-[#3794ff]" : ""
          }`}
        />

        <div
          className={`flex items-center h-[35px] ${colors.tabBg} px-3 border-b ${colors.borderDark} transition-colors duration-300`}
        >
          <div className="flex items-center gap-4 text-[13px]">
            <button
              onClick={() => setBottomPanelTab("terminal")}
              className={`flex items-center gap-2 pb-[9px] pt-[9px] ${
                bottomPanelTab === "terminal"
                  ? `border-b-2 ${isDarkMode ? "border-[#3794ff]" : "border-[#0078d4]"}`
                  : `${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} hover:text-white cursor-pointer`
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>TERMINAL</span>
            </button>
            <button
              onClick={() => setBottomPanelTab("problems")}
              className={`flex items-center gap-2 pb-[9px] pt-[9px] ${
                bottomPanelTab === "problems"
                  ? `border-b-2 ${isDarkMode ? "border-[#3794ff]" : "border-[#0078d4]"}`
                  : `${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} hover:text-white cursor-pointer`
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>PROBLEMS</span>
              <span className={`px-1.5 py-0.5 rounded text-[11px] ${isDarkMode ? "bg-[#3c3c3c]" : "bg-[#e5e5e5]"}`}>
                1
              </span>
            </button>
            <button
              onClick={() => setBottomPanelTab("output")}
              className={`pb-[9px] pt-[9px] ${
                bottomPanelTab === "output"
                  ? `border-b-2 ${isDarkMode ? "border-[#3794ff]" : "border-[#0078d4]"}`
                  : `${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} hover:text-white cursor-pointer`
              }`}
            >
              OUTPUT
            </button>
            <button
              onClick={() => setBottomPanelTab("debug")}
              className={`pb-[9px] pt-[9px] ${
                bottomPanelTab === "debug"
                  ? `border-b-2 ${isDarkMode ? "border-[#3794ff]" : "border-[#0078d4]"}`
                  : `${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} hover:text-white cursor-pointer`
              }`}
            >
              DEBUG CONSOLE
            </button>
          </div>
        </div>

        <div ref={terminalRef} className="flex-1 overflow-y-auto p-2 font-mono text-[13px] leading-[19px]">
          {bottomPanelTab === "terminal" && (
            <>
              {!isGameRunning && meltdownPhase !== "idle" && (
                <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999] font-mono">
                  {/* Phase 1: The Meltdown - Rapidly scrolling red errors */}
                  {meltdownPhase === "panic" && (
                    <div className="w-full h-full bg-black flex flex-col items-start justify-start p-8 overflow-hidden">
                      <div className="text-red-500 text-sm whitespace-pre-wrap animate-pulse leading-relaxed">
                        {meltdownMessage}
                      </div>
                    </div>
                  )}

                  {/* Phase 2 & 3: Resolution with green text and CTA */}
                  {meltdownPhase === "resolution" && (
                    <div className="w-full h-full bg-black flex flex-col items-center justify-center p-8 space-y-12">
                      {/* Green solution message */}
                      <div className="text-green-400 text-xl md:text-2xl text-center max-w-3xl font-mono">
                        {">"} {meltdownMessage}
                        <span className="animate-pulse">_</span>
                      </div>

                      {/* CTA Button - only show after message is fully typed */}
                      {meltdownMessage.length > 60 && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                          <button
                            onClick={() => {
                              handleRunMain()
                              closeMeltdown()
                            }}
                            className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-lg transition-all duration-300 hover:scale-105 border-2 border-green-400 shadow-lg shadow-green-500/50"
                          >
                            Hire me & Download CV
                          </button>

                          {/* Emergency Exit link */}
                          <div className="text-center">
                            <button
                              onClick={closeMeltdown}
                              className="text-gray-400 hover:text-white text-sm underline transition-colors"
                            >
                              Emergency Exit
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Corner X button for quick exit */}
                      <button
                        onClick={closeMeltdown}
                        className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors p-2"
                        title="Close"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Snake Game Modal - Opens in separate window */}
              {isGameRunning && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
                  <div 
                    className={`relative ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'} rounded-lg shadow-2xl p-6 w-[85vw] max-w-5xl`}
                    style={{ maxHeight: '85vh' }}
                  >
                    {/* Close button */}
                    <button
                      onClick={() => {
                        setIsGameRunning(false)
                        setTerminalOutput((prev) => [...prev, "", "🎮 Game closed.", ""])
                      }}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50 z-10"
                      title="Close (ESC)"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    {/* Game title */}
                    <div className={`text-center mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      <h2 className="text-2xl font-bold mb-2">🐍 Junior Dev Snake: Career Growth Edition</h2>
                      <p className="text-sm text-gray-400">Collect all 10 career items to become Production Ready!</p>
                    </div>

                    {/* Game container with proper scaling */}
                    <div className="flex items-center justify-center">
                      <JobHuntGame
                        isDarkMode={isDarkMode}
                        colors={colors}
                        onGameEnd={(won) => {
                          setIsGameRunning(false)
                        }}
                        onLog={(message) => {
                          setTerminalOutput((prev) => [...prev, message])
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {terminalOutput.map((line, index) => {
                if (line === "THEME_WARNING") {
                  return (
                    <div key={index} className="font-bold my-1">
                      <div className="text-[#f48771]">
                        [SYSTEM WARNING]: Light theme detected. My eyes! They burn! 🕶️
                      </div>
                      <div className="text-[#dcdcaa]">
                        [ADVICE]: Switching back to Dark Mode is highly recommended for your
                      </div>
                      <div className="text-[#dcdcaa]">long-term health and developer reputation.</div>
                    </div>
                  )
                }

                if (line.startsWith("LINK::")) {
                  const [, url, label] = line.split("::")
                  return (
                    <div key={index} className="text-[#4ec9b0] font-semibold">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-[#6ee7d7] transition-colors"
                      >
                        {label || url}
                      </a>
                    </div>
                  )
                }

                if (line === "SUCCESS_LINK") {
                  return (
                    <div key={index} className="text-[#4ec9b0] font-bold animate-pulse">
                      <span className="drop-shadow-[0_0_8px_rgba(78,201,176,0.8)]">
                        SUCCESS: Ready for Interview. {""}
                        <a
                          href="mailto:hadarknafo@gmail.com"
                          className="underline hover:text-[#6ee7d7] transition-colors cursor-pointer"
                        >
                          Click here to Schedule
                        </a>
                        .
                      </span>
                    </div>
                  )
                }

                const isComment = line.startsWith("#")
                const isPrompt = line.startsWith("guest@portfolio")

                return (
                  <div
                    key={index}
                    className={
                      isComment
                        ? isDarkMode
                          ? "text-[#6a9955]"
                          : "text-[#008000]"
                        : isPrompt
                          ? colors.text
                          : line.includes("[OK]") || line.includes("[DONE]")
                            ? "text-[#4ec9b0]"
                            : line.startsWith("✓") || line.startsWith("✅")
                              ? "text-[#4ec9b0]"
                              : line.startsWith("⚠️") || line.includes("[STATUS]") || line.includes("Warning:")
                                ? "text-[#ce9178]"
                                : line.startsWith("💯")
                                  ? "text-[#dcdcaa]"
                                  : line.startsWith(">")
                                    ? colors.text
                                    : line.startsWith("PS")
                                      ? colors.text
                                      : colors.text
                    }
                  >
                    {line}
                    {index === terminalOutput.length - 1 && isTyping && (
                      <span
                        className={`inline-block w-2 h-4 ${isDarkMode ? "bg-[#cccccc]" : "bg-[#1e1e1e]"} ml-1 animate-pulse`}
                      ></span>
                    )}
                  </div>
                )
              })}

              {!isTyping && (
                <div className="flex items-center">
                  <span className={colors.text}>guest@portfolio:~$ </span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleTerminalCommandInternal(terminalInput)
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault()
                        if (terminalHistory.length > 0) {
                          const newIndex = historyIndex + 1
                          if (newIndex < terminalHistory.length) {
                            setHistoryIndex(newIndex)
                            setTerminalInput(terminalHistory[terminalHistory.length - 1 - newIndex])
                          }
                        }
                      } else if (e.key === "ArrowDown") {
                        e.preventDefault()
                        const newIndex = historyIndex - 1
                        if (newIndex >= 0) {
                          setHistoryIndex(newIndex)
                          setTerminalInput(terminalHistory[terminalHistory.length - 1 - newIndex])
                        } else {
                          setHistoryIndex(-1)
                          setTerminalInput("")
                        }
                      }
                    }}
                    className={`flex-1 bg-transparent border-none outline-none ml-1 ${colors.text} font-mono text-[13px]`}
                    autoFocus
                  />
                  <span
                    className={`inline-block w-2 h-4 ${isDarkMode ? "bg-[#cccccc]" : "bg-[#1e1e1e]"} animate-pulse`}
                  ></span>
                </div>
              )}
            </>
          )}

          {bottomPanelTab === "problems" && (
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-2 hover:bg-[#2a2d2e] cursor-pointer rounded">
                <AlertTriangle className="w-4 h-4 text-[#cca700] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className={`${isDarkMode ? "text-[#cccccc]" : "text-[#1e1e1e]"} text-[13px]`}>
                    Warning: Candidate is not yet on your payroll.
                  </div>
                  <div
                    className={`${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} text-[11px] mt-1 flex items-center gap-2`}
                  >
                    <span>hadar-portfolio/src</span>
                    <button
                      onClick={handleBuildClick}
                      className={`${isDarkMode ? "text-[#3794ff] hover:underline" : "text-[#0078d4] hover:underline"} cursor-pointer`}
                    >
                      Quick Fix
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {bottomPanelTab === "output" && (
            <div className={`${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} text-[13px]`}>
              No output available.
            </div>
          )}

          {bottomPanelTab === "debug" && (
            <div className={`${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} text-[13px]`}>
              Debug console is ready. Start debugging to see output.
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div
        className={`flex items-center justify-between h-[22px] ${colors.statusBar} px-3 text-white text-[12px] transition-colors duration-300`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <GitMerge className="w-3 h-3" />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1">
            <X className="w-3 h-3" />
            <span>0</span>
            <AlertTriangle className="w-3 h-3 ml-2" />
            <span>1</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Ln {cursorPos.ln}, Col {cursorPos.col}
          </span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>LF</span>
          <span>{activeFile.split(".").pop()?.toUpperCase()}</span>
          {testStatus === "running" && (
            <div className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Running tests...</span>
            </div>
          )}
          {testStatus === "success" && (
            <div className="flex items-center gap-1.5 text-[#89d185]">
              <Check className="w-3 h-3" />
              <span>Tests Passed</span>
            </div>
          )}
          <button
            onClick={handleGoLive}
            disabled={viewMode === "transitioning"}
            className="flex items-center gap-1.5 px-2 py-0.5 hover:bg-white/10 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wifi className="w-3 h-3" /> {/* Changed icon to Wifi */}
            <span>Go Live</span>
          </button>
        </div>
      </div>

      {viewMode === "transitioning" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] border border-[#3c3c3c] rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Building Production Version...</h3>
            <div className="w-full h-2 bg-[#3c3c3c] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${buildProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">{Math.round(buildProgress)}% complete</p>
          </div>
        </div>
      )}

      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-[100]">
          <div
            ref={commandPaletteRef}
            className={`w-[600px] ${isDarkMode ? "bg-[#252526]" : "bg-white"} ${colors.border} border rounded-lg shadow-2xl overflow-hidden`}
          >
            <div className="flex items-center gap-2 p-3 border-b border-[#3c3c3c]">
              <Search className="w-4 h-4 opacity-50" />
              <input
                type="text"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Type a command..."
                autoFocus
                className={`flex-1 ${isDarkMode ? "bg-transparent text-[#cccccc]" : "bg-white text-[#1e1e1e]"} outline-none text-[14px]`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && filteredCommands.length > 0) {
                    filteredCommands[0].action()
                    setShowCommandPalette(false)
                    setCommandQuery("")
                  }
                }}
              />
              <span className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>Esc to close</span>
            </div>
            <div className="max-h-[400px] overflow-auto">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      cmd.action()
                      setShowCommandPalette(false)
                      setCommandQuery("")
                    }}
                    className={`px-4 py-2 text-[13px] cursor-pointer ${colors.hover} transition-colors flex items-center gap-2`}
                  >
                    <ChevronRight className="w-3 h-3 opacity-50" />
                    <span>{cmd.label}</span>
                  </div>
                ))
              ) : (
                <div
                  className={`px-4 py-8 text-center text-[13px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}
                >
                  No commands found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
