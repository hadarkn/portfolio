import type { ColorScheme, TechStackItem } from "@/lib/portfolio-types"
import { CheckCircle2 } from "lucide-react"

interface ExtensionsViewProps {
  techStack: TechStackItem[]
  isDarkMode: boolean
  colors: ColorScheme
}

export function ExtensionsView({ techStack, isDarkMode, colors }: ExtensionsViewProps) {
  return (
    <>
      <div
        className={`p-2 ${colors.text} font-normal uppercase tracking-wide text-[11px] h-[35px] flex items-center justify-between`}
      >
        <span>Extensions</span>
        <span className={`${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>
          {techStack.length} installed
        </span>
      </div>

      <div className="flex flex-col gap-3 p-2">
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className={`p-2 rounded ${colors.hover} cursor-pointer transition-colors duration-300 ${
              tech.special ? (isDarkMode ? "border border-[#3794ff]" : "border border-[#0078d4]") : ""
            }`}
          >
            <div className="flex items-start gap-2">
              <div className="text-2xl flex-shrink-0">{tech.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[13px] truncate">{tech.name}</span>
                  {tech.verified && (
                    <CheckCircle2
                      className={`w-3 h-3 flex-shrink-0 ${isDarkMode ? "text-[#3794ff]" : "text-[#0078d4]"}`}
                    />
                  )}
                </div>
                <div className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} mt-0.5`}>
                  {tech.description}
                </div>
                <div
                  className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} mt-1 flex items-center gap-2`}
                >
                  <span>{tech.version}</span>
                  {tech.special && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${isDarkMode ? "bg-[#3794ff] text-white" : "bg-[#0078d4] text-white"}`}
                    >
                      Verified Creator
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
