import type { ColorScheme } from "@/lib/portfolio-types"
import { GitMerge, CheckCircle2, Check } from "lucide-react"

interface SourceControlViewProps {
  isDirty: boolean
  isDarkMode: boolean
  colors: ColorScheme
  onCommit: () => void
}

export function SourceControlView({ isDirty, isDarkMode, colors, onCommit }: SourceControlViewProps) {
  return (
    <>
      <div
        className={`p-2 ${colors.text} font-normal uppercase tracking-wide text-[11px] h-[35px] flex items-center justify-between`}
      >
        <span>Source Control</span>
        <GitMerge className="w-4 h-4" />
      </div>
      <div className="flex flex-col p-2 gap-3">
        {isDirty && (
          <div className="mb-4">
            <div
              className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} mb-2 uppercase tracking-wide`}
            >
              Changes
            </div>
            <div
              className={`flex items-center gap-2 p-2 rounded ${colors.hover} cursor-pointer transition-colors text-[13px]`}
            >
              <CheckCircle2 className="w-4 h-4 text-[#519aba]" />
              <span>settings.json</span>
              <span className={`ml-auto ${isDarkMode ? "text-[#3794ff]" : "text-[#0078d4]"} text-[11px]`}>
                M
              </span>
            </div>
            <button
              onClick={onCommit}
              className={`mt-2 w-full px-3 py-1.5 ${isDarkMode ? "bg-[#0e639c] hover:bg-[#1177bb]" : "bg-[#0078d4] hover:bg-[#005a9e]"} text-white rounded text-[13px] font-medium transition-colors`}
            >
              Commit Changes
            </button>
          </div>
        )}

        <div className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} mb-2`}>
          Repository Status
        </div>

        <div className={`flex flex-col gap-2 p-2 rounded ${colors.hover}`}>
          <div className="text-[13px] font-semibold">Branch: main</div>
          <div className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>
            Remote: github.com/hadarkn/portfolio
          </div>
          <div className={`text-[11px] ${isDarkMode ? "text-[#3794ff]" : "text-[#0078d4]"}`}>
            Up to date with origin/main
          </div>
        </div>

        <div className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} mt-4 mb-2`}>
          Recent commits
        </div>

        <div className={`flex gap-2 p-2 rounded ${colors.hover}`}>
          <div className="flex-shrink-0">
            <div className={`w-2 h-2 rounded-full mt-1 ${isDarkMode ? "bg-[#3794ff]" : "bg-[#0078d4]"}`}></div>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">feat: update Go Live content</div>
            <div className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} mt-1`}>
              Added real resume links and contact email
            </div>
            <div className={`text-[11px] ${isDarkMode ? "text-[#3794ff]" : "text-[#0078d4]"} mt-1`}>
              main • just now
            </div>
          </div>
        </div>
        <div className={`flex gap-2 p-2 rounded ${colors.hover}`}>
          <div className="flex-shrink-0">
            <div className={`w-2 h-2 rounded-full mt-1 ${isDarkMode ? "bg-[#3794ff]" : "bg-[#0078d4]"}`}></div>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">chore: dependency health</div>
            <div className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"} mt-1`}>
              Kept Next.js and UI libs aligned
            </div>
            <div className={`text-[11px] ${isDarkMode ? "text-[#3794ff]" : "text-[#0078d4]"} mt-1`}>
              main • 1 day ago
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
