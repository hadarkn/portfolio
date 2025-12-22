import { FileCode2, FileText, Braces, Cog, Terminal } from "lucide-react"
import type React from "react"
import type { FileType, SearchResult } from "@/lib/portfolio-types"
import { fileContent, files } from "@/lib/portfolio-constants"

export function handleSidebarSearch(query: string): SearchResult[] {
  // Check for humorous empty states
  if (query.toLowerCase() === "bugs") {
    return [
      {
        file: "System Message",
        line: 0,
        content: "0 results found in 5 files. Your code is remarkably clean!",
        isSpecial: true,
      },
    ]
  }

  if (query.toLowerCase() === "coffee") {
    return [
      {
        file: "Error 418",
        line: 0,
        content: "I'm a teapot. Please refill developer to continue search.",
        isSpecial: true,
      },
    ]
  }

  if (!query.trim()) {
    return []
  }

  const results: SearchResult[] = []
  const searchLower = query.toLowerCase()

  // Search in all files
  files.forEach((file) => {
    const content = fileContent[file]
    content.split("\n").forEach((line, index) => {
      if (line.toLowerCase().includes(searchLower)) {
        results.push({ file, line: index + 1, content: line.trim() })
      }
    })
  })

  return results
}

export function getFileIcon(filename: string): React.ReactNode {
  const iconClass = "w-4 h-4"
  
  if (filename.endsWith(".js")) return <FileCode2 className={`${iconClass} text-[#f1e05a]`} />
  if (filename.endsWith(".py")) return <FileCode2 className={`${iconClass} text-[#3572A5]`} />
  if (filename.endsWith(".json")) return <Braces className={`${iconClass} text-[#cbcb41]`} />
  if (filename.endsWith(".cpp")) return <FileCode2 className={`${iconClass} text-[#f34b7d]`} />
  if (filename.endsWith(".sh")) return <Terminal className={`${iconClass} text-[#89e051]`} />
  return <FileText className={`${iconClass} text-[#858585]`} />
}

export function renderSyntaxHighlightedCode(
  code: string,
  isDarkMode: boolean,
): string {
  // Escape HTML special characters first
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

  // Helper to avoid re-highlighting inside already injected spans
  const applyHighlight = (input: string, regex: RegExp, className: string) => {
    return input
      .split(/(<span[^>]*>[\s\S]*?<\/span>)/g)
      .map((segment) => {
        if (segment.startsWith("<span")) return segment
        return segment.replace(regex, (match) => `<span class="${className}">${match}</span>`)
      })
      .join("")
  }

  const colors = {
    comment: isDarkMode ? "text-[#6a9955]" : "text-[#008000]",
    string: isDarkMode ? "text-[#ce9178]" : "text-[#a31515]",
    keyword: isDarkMode ? "text-[#569cd6]" : "text-[#0000ff]",
    literal: isDarkMode ? "text-[#569cd6]" : "text-[#0000ff]",
    number: isDarkMode ? "text-[#b5cea8]" : "text-[#098658]",
  }

  let highlighted = escaped
  highlighted = applyHighlight(highlighted, /\/\/.*$/g, colors.comment)
  highlighted = applyHighlight(highlighted, /#.*/g, colors.comment)
  highlighted = applyHighlight(highlighted, /&quot;([^&]*)&quot;/g, colors.string)
  highlighted = applyHighlight(
    highlighted,
    /\b(const|let|var|function|return|class|def|self|import|from|export|default|if|else|for|while|new|this|async|await|include|namespace|using|std|int|void|string|auto|public|private)\b/g,
    colors.keyword,
  )
  highlighted = applyHighlight(highlighted, /\b(true|false|null|undefined|None|True|False)\b/g, colors.literal)
  highlighted = applyHighlight(highlighted, /\b(\d+)\b/g, colors.number)

  return highlighted
}
