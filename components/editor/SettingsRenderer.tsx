"use client"

import type React from "react"
import { fileContent } from "@/lib/portfolio-constants"
import type { ColorScheme } from "@/lib/portfolio-types"

interface SettingsRendererProps {
  workMode: string
  isDarkMode: boolean
  colors: ColorScheme
  onWorkModeChange: (value: string) => void
}

export function SettingsRenderer({
  workMode,
  isDarkMode,
  colors,
  onWorkModeChange,
}: SettingsRendererProps): React.ReactElement {
  const lines = fileContent["settings.json"].split("\n")

  return (
    <div className="font-mono text-[14px] leading-[21px]">
      {lines.map((line, index) => {
        // Check if this line contains work_mode
        if (line.includes('"work_mode"')) {
          return (
            <div key={index} className="flex items-center">
              <span className={isDarkMode ? "text-[#9cdcfe]" : "text-[#0451a5]"}>"work_mode"</span>
              <span className={isDarkMode ? "text-[#cccccc]" : "text-[#1e1e1e]"}>: </span>
              <select
                value={workMode}
                onChange={(e) => onWorkModeChange(e.target.value)}
                className={`${isDarkMode ? "bg-[#3c3c3c] text-[#ce9178] border-[#6e6e6e]" : "bg-[#f3f3f3] text-[#a31515] border-[#d4d4d4]"} border px-2 py-0.5 rounded text-[14px] cursor-pointer focus:outline-none focus:ring-1 ${isDarkMode ? "focus:ring-[#3794ff]" : "focus:ring-[#0078d4]"}`}
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Office">Office</option>
              </select>
              <span className={isDarkMode ? "text-[#cccccc]" : "text-[#1e1e1e]"}>,</span>
            </div>
          )
        }

        // Render normal syntax highlighting
        const coloredLine = line
          .replace(/"([^"]+)":/g, (match, p1) => {
            return `<span class="${isDarkMode ? "text-[#9cdcfe]" : "text-[#0451a5]"}">"${p1}"</span>:`
          })
          .replace(/: "([^"]+)"/g, (match, p1) => {
            return `: <span class="${isDarkMode ? "text-[#ce9178]" : "text-[#a31515]"}">"${p1}"</span>`
          })
          .replace(/: (true|false)/g, (match, p1) => {
            return `: <span class="${isDarkMode ? "text-[#569cd6]" : "text-[#0000ff]"}">${p1}</span>`
          })
          .replace(/: (\[)/g, (match, p1) => {
            return `: <span class="${isDarkMode ? "text-[#cccccc]" : "text-[#1e1e1e]"}">${p1}</span>`
          })

        return <div key={index} dangerouslySetInnerHTML={{ __html: coloredLine || "<br />" }} />
      })}
    </div>
  )
}
