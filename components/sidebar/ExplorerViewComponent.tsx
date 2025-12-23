import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, ChevronRight, Files, MoreVertical, Play, Clock3, List, Terminal, FileCode2 } from "lucide-react"
import type { FileType, ColorScheme } from "@/lib/portfolio-types"
import { files, fileContent } from "@/lib/portfolio-constants"

interface ExplorerViewProps {
  expandedFolders: Record<string, boolean>
  toggleFolder: (folder: string) => void
  activeFile: FileType
  handleFileClick: (file: FileType) => void
  colors: ColorScheme
  isDarkMode: boolean
  getFileIcon: (filename: string) => React.ReactNode
  onFocusLine: (file: FileType, line: number) => void
  onTimelineSelect: (year: number) => void
  onRunScript: (name: string) => void
  onCreateEphemeralFile: () => void
}

export function ExplorerView({
  expandedFolders,
  toggleFolder,
  activeFile,
  handleFileClick,
  colors,
  isDarkMode,
  getFileIcon,
  onFocusLine,
  onTimelineSelect,
  onRunScript,
  onCreateEphemeralFile,
}: ExplorerViewProps) {
  const [showActions, setShowActions] = useState(false)
  const [outlineOpen, setOutlineOpen] = useState(false)
  const [timelineOpen, setTimelineOpen] = useState(false)
  const [scriptsOpen, setScriptsOpen] = useState(false)
  const actionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setShowActions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const rootFiles: FileType[] = ["settings.json", "DANGER_DO_NOT_OPEN.sh"]
  const srcFiles: FileType[] = files.filter((file) => !rootFiles.includes(file))

  const collapseAll = () => {
    if (expandedFolders.src) toggleFolder("src")
    if (expandedFolders["hadar-portfolio"]) toggleFolder("hadar-portfolio")
    setShowActions(false)
  }

  const outline = useMemo(() => {
    const content = fileContent[activeFile] ?? ""
    const lines = content.split("\n")
    const matches: { label: string; line: number }[] = []

    const patterns = [
      { regex: /^\s*def\s+([a-zA-Z0-9_]+)\s*\(/, label: (m: RegExpMatchArray) => m[1] },
      { regex: /^\s*(class|function|const)\s+([a-zA-Z0-9_]+)/, label: (m: RegExpMatchArray) => m[2] ?? m[1] },
      { regex: /^\s*export\s+function\s+([a-zA-Z0-9_]+)/, label: (m: RegExpMatchArray) => m[1] },
    ]

    lines.forEach((line, idx) => {
      for (const { regex, label } of patterns) {
        const match = line.match(regex)
        if (match) {
          matches.push({ label: label(match), line: idx + 1 })
          break
        }
      }
    })

    // If no matches, add a friendly hint
    if (matches.length === 0) {
      matches.push({ label: "(no symbols detected)", line: 1 })
    }

    // Ensure requested virtual symbols for Skills.py
    if (activeFile === "Skills.py") {
      matches.push({ label: "get_top_grades()", line: Math.max(2, matches[matches.length - 1]?.line + 1) })
      matches.push({ label: "print_report()", line: Math.max(3, matches[matches.length - 1]?.line + 1) })
    }

    return matches
  }, [activeFile])

  const timeline = useMemo(
    () => [
      { year: 2016, label: "Technician", desc: "Air Intelligence Technician" },
      { year: 2018, label: "Team Leader", desc: "Air Intelligence Team Leader" },
      { year: 2023, label: "University Start", desc: "Started BGU Software Engineering" },
    ],
    [],
  )

  const scripts = [
    { name: "dev", label: "npm run dev" },
    { name: "test", label: "npm test" },
    { name: "build", label: "npm run build" },
  ]

  const expandSrc = () => {
    if (!expandedFolders.portfolio_2025) toggleFolder("portfolio_2025")
    if (!expandedFolders.src) toggleFolder("src")
    setShowActions(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className={`p-2 ${colors.text} font-normal uppercase tracking-wide text-[11px] h-[35px] flex items-center justify-between`}
      >
        <span>Explorer</span>
        <div className="relative" ref={actionsRef}>
          <button
            onClick={() => setShowActions((prev) => !prev)}
            className={`p-1 rounded ${colors.hover} hover:opacity-100 opacity-70 transition-colors`}
            aria-label="Explorer actions"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          {showActions && (
            <div
              className={`absolute right-0 mt-1 min-w-[140px] rounded border ${colors.borderDark} shadow-lg z-20`}
              style={{
                backgroundColor: isDarkMode ? '#252526' : '#f3f3f3'
              }}
            >
              <button
                onClick={expandSrc}
                className={`w-full text-left px-3 py-2 text-[12px] ${colors.hover}`}
              >
                Expand src
              </button>
              <button
                onClick={collapseAll}
                className={`w-full text-left px-3 py-2 text-[12px] ${colors.hover}`}
              >
                Collapse all
              </button>
              <button
                onClick={() => {
                  onCreateEphemeralFile()
                  setShowActions(false)
                }}
                className={`w-full text-left px-3 py-2 text-[12px] ${colors.hover}`}
              >
                New File
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <button
          onClick={() => toggleFolder("hadar-portfolio")}
          className={`flex items-center gap-1 px-2 py-0.5 ${colors.hover} cursor-pointer text-left w-full transition-colors duration-300`}
        >
          {expandedFolders["hadar-portfolio"] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <span className="font-semibold text-[13px]">hadar-portfolio</span>
        </button>

        {expandedFolders["hadar-portfolio"] && (
          <div className="ml-2 flex flex-col gap-1">
            <button
              onClick={() => toggleFolder("src")}
              className={`flex items-center gap-1 px-2 py-0.5 ${colors.hover} cursor-pointer text-left w-full transition-colors duration-300`}
            >
              {expandedFolders.src ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <span className="text-[13px]">src</span>
            </button>

            {expandedFolders.src && (
              <div className="ml-4 flex flex-col">
                {srcFiles.map((file) => (
                  <button
                    key={file}
                    onClick={() => handleFileClick(file)}
                    className={`flex items-center gap-2 px-2 py-0.5 ${
                      activeFile === file
                        ? colors.text === "text-[#1e1e1e]"
                          ? "bg-[#e8e8e8]"
                          : "bg-[#37373d]"
                        : colors.hover
                    } cursor-pointer text-left transition-colors duration-300`}
                  >
                    {getFileIcon(file)}
                    <span className="text-[13px]">{file}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col">
              {rootFiles.map((file) => (
                <button
                  key={file}
                  onClick={() => handleFileClick(file)}
                  className={`flex items-center gap-2 px-2 py-0.5 ${
                    activeFile === file
                      ? colors.text === "text-[#1e1e1e]"
                        ? "bg-[#e8e8e8]"
                        : "bg-[#37373d]"
                      : colors.hover
                  } cursor-pointer text-left transition-colors duration-300`}
                >
                  {getFileIcon(file)}
                  <span className="text-[13px]">{file}</span>
                </button>
              ))}
            </div>

          </div>
        )}
      </div>
      <div className="mt-auto flex flex-col gap-2 p-2">
        <div className={`border-t ${colors.borderDark} pt-2 flex flex-col gap-2`}>
          <button
            onClick={() => setOutlineOpen((v) => !v)}
            className={`flex items-center gap-2 text-[12px] font-semibold opacity-80 px-1 py-1 rounded ${colors.hover}`}
          >
            {outlineOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <List className="w-3.5 h-3.5" /> Outline
          </button>
          {outlineOpen && (
            <div className="flex flex-col gap-1">
              {outline.map((item) => (
                <button
                  key={`${item.label}-${item.line}`}
                  onClick={() => onFocusLine(activeFile, item.line)}
                  className={`text-left text-[12px] px-2 py-1 rounded ${colors.hover} flex items-center justify-between`}
                >
                  <span className="truncate max-w-[140px]">{item.label}</span>
                  <span className="opacity-60">{item.line}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`border-t ${colors.borderDark} pt-2 flex flex-col gap-2`}>
          <button
            onClick={() => setTimelineOpen((v) => !v)}
            className={`flex items-center gap-2 text-[12px] font-semibold opacity-80 px-1 py-1 rounded ${colors.hover}`}
          >
            {timelineOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <Clock3 className="w-3.5 h-3.5" /> Timeline
          </button>
          {timelineOpen && (
            <div className="flex flex-col gap-1">
              {timeline.map((event) => (
                <button
                  key={event.year}
                  onClick={() => onTimelineSelect(event.year)}
                  className={`text-left text-[12px] px-2 py-1 rounded ${colors.hover} flex items-center gap-2`}
                >
                  <span className="font-semibold">{event.year}</span>
                  <span className="truncate max-w-[140px]">{event.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`border-t ${colors.borderDark} pt-2 flex flex-col gap-2`}>
          <button
            onClick={() => setScriptsOpen((v) => !v)}
            className={`flex items-center gap-2 text-[12px] font-semibold opacity-80 px-1 py-1 rounded ${colors.hover}`}
          >
            {scriptsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <Terminal className="w-3.5 h-3.5" /> NPM Scripts
          </button>
          {scriptsOpen && (
            <div className="flex flex-col gap-1">
              {scripts.map((script) => (
                <div key={script.name} className={`flex items-center justify-between rounded ${colors.hover} px-2 py-1`}>
                  <span className="text-[12px] truncate">{script.label}</span>
                  <button
                    onClick={() => onRunScript(script.name)}
                    className={`p-1 rounded ${colors.hover} hover:opacity-100 opacity-80`}
                    aria-label={`Run ${script.name}`}
                  >
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
