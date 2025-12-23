export type FileType =
  | "AboutMe.js"
  | "Skills.py"
  | "Projects.json"
  | "Experience.cpp"
  | "settings.json"
  | "DANGER_DO_NOT_OPEN.sh"
  | "scratchpad.md"

export type SidebarView = "explorer" | "extensions" | "search" | "source-control" | "run" | "account" | "database" | "service"

export type BottomPanelTab = "terminal" | "problems" | "output" | "debug"

export type MenuType = "File" | "Edit" | "Selection" | "View" | "Go" | "Run" | "Terminal" | "Help" | null

export type ViewMode = "ide" | "production" | "transitioning"

export interface TechStackItem {
  name: string
  version: string
  description: string
  icon: string
  verified: boolean
  special?: boolean
}

export interface ColorScheme {
  bg: string
  text: string
  menuBar: string
  activityBar: string
  sidebar: string
  editorBg: string
  border: string
  borderDark: string
  tabBg: string
  tabActive: string
  tabInactive: string
  hover: string
  lineNumberBg: string
  lineNumberText: string
  minimapBg: string
  statusBar: string
  terminalBg: string
  searchBg: string
  inputBorder: string
  accentBlue: string
}

export interface SearchResult {
  file: string
  line: number
  content: string
  isSpecial?: boolean
}

export interface CursorPos {
  ln: number
  col: number
}
