import type { FileType, ColorScheme, SearchResult } from "@/lib/portfolio-types"
import { FileCode2 } from "lucide-react"

interface SearchViewProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  searchResults: SearchResult[]
  isDarkMode: boolean
  colors: ColorScheme
  onResultClick: (file: FileType, line: number) => void
}

export function SearchView({
  searchQuery,
  onSearchChange,
  searchResults,
  isDarkMode,
  colors,
  onResultClick,
}: SearchViewProps) {
  return (
    <>
      <div
        className={`p-2 ${colors.text} font-normal uppercase tracking-wide text-[11px] h-[35px] flex items-center`}
      >
        Search
      </div>
      <div className="p-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search in files..."
          className={`w-full px-2 py-1 text-[13px] rounded ${
            isDarkMode
              ? "bg-[#3c3c3c] text-[#cccccc] border border-[#3c3c3c] focus:border-[#3794ff]"
              : "bg-white text-black border border-[#d0d0d0] focus:border-[#0078d4]"
          } focus:outline-none`}
        />
      </div>
      {searchResults.length > 0 ? (
        <div className="flex flex-col p-2 gap-2">
          {searchResults[0]?.isSpecial ? (
            <div className={`p-4 text-center ${isDarkMode ? "text-[#4ec9b0]" : "text-[#0e8a16]"}`}>
              <div className="font-bold text-[13px] mb-2">{searchResults[0].file}</div>
              <div className="text-[12px]">{searchResults[0].content}</div>
            </div>
          ) : (
            <>
              <div className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} in {""}
                {new Set(searchResults.map((r) => r.file)).size} file
                {new Set(searchResults.map((r) => r.file)).size !== 1 ? "s" : ""}
              </div>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => onResultClick(result.file as FileType, result.line)}
                  className={`p-2 rounded cursor-pointer ${colors.hover} transition-colors`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] truncate">{result.file}</div>
                      <div className={`text-[11px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>
                        Line {result.line}
                      </div>
                      <div
                        className={`text-[11px] font-mono ${isDarkMode ? "text-[#cccccc]" : "text-[#333333]"} mt-1 truncate`}
                      >
                        {result.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : searchQuery ? (
        <div className={`p-4 text-center text-[12px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>
          No results found for "{searchQuery}"
        </div>
      ) : (
        <div className={`p-4 text-center text-[12px] ${isDarkMode ? "text-[#858585]" : "text-[#6e6e6e]"}`}>
          Start typing to search in files
        </div>
      )}
    </>
  )
}
