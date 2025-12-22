export function getColorScheme(isDarkMode: boolean) {
  return {
    bg: isDarkMode ? "bg-[#1e1e1e]" : "bg-[#ffffff]",
    text: isDarkMode ? "text-[#cccccc]" : "text-[#1e1e1e]",
    menuBar: isDarkMode ? "bg-[#323233]" : "bg-[#f3f3f3]",
    activityBar: isDarkMode ? "bg-[#333333]" : "bg-[#2c2c2c]",
    sidebar: isDarkMode ? "bg-[#252526]" : "bg-[#f3f3f3]",
    editorBg: isDarkMode ? "bg-[#1e1e1e]" : "bg-[#ffffff]",
    border: isDarkMode ? "border-[#252526]" : "border-[#e5e5e5]",
    borderDark: isDarkMode ? "border-[#252526]" : "border-[#d4d4d4]",
    tabBg: isDarkMode ? "bg-[#252526]" : "bg-[#f3f3f3]",
    tabActive: isDarkMode ? "bg-[#1e1e1e]" : "bg-[#ffffff]",
    tabInactive: isDarkMode ? "bg-[#2d2d30]" : "bg-[#ececec]",
    hover: isDarkMode ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8e8e8]",
    lineNumberBg: isDarkMode ? "bg-[#1e1e1e]" : "bg-[#f5f5f5]",
    lineNumberText: isDarkMode ? "text-[#858585]" : "text-[#237893]",
    minimapBg: isDarkMode ? "bg-[#1e1e1e]" : "bg-[#f5f5f5]",
    statusBar: isDarkMode ? "bg-[#007acc]" : "bg-[#007acc]",
    terminalBg: isDarkMode ? "bg-[#1e1e1e]" : "bg-[#ffffff]",
    searchBg: isDarkMode ? "bg-[#3c3c3c]" : "bg-[#ffffff]",
    inputBorder: isDarkMode ? "" : "border border-[#cecece]",
    accentBlue: isDarkMode ? "text-[#3794ff]" : "text-[#0078d4]",
  }
}
