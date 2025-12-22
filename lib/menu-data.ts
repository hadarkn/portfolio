import type { MenuType } from "@/lib/portfolio-types"

export interface MenuItem {
  label?: string
  action?: string
  divider?: boolean
  submenu?: Array<{ label: string; action: string }>
}

export const menuItems: Record<Exclude<MenuType, null>, MenuItem[]> = {
  File: [
    { label: "New Interview Request", action: "new-interview" },
    { label: "Open Resume.pdf", action: "open-resume" },
    { divider: true },
    { label: "Save Candidate to Favorites", action: "save-favorite" },
    { divider: true },
    { label: "Exit", action: "exit" },
  ],
  Edit: [
    { label: "Copy Email Address", action: "copy-email" },
    { label: "Select All Skills", action: "select-all-skills" },
    { divider: true },
    { label: "Undo Last Rejection", action: "undo-rejection" },
  ],
  Selection: [
    { label: "Select for Software Engineer Role", action: "select-engineer" },
    { label: "Add to Shortlist", action: "add-shortlist" },
  ],
  View: [
    {
      label: "Appearance",
      submenu: [{ label: "Toggle Theme", action: "toggle-theme" }],
    },
    { divider: true },
    { label: "Explorer", action: "focus-explorer" },
    { label: "Full Screen", action: "fullscreen" },
  ],
  Go: [
    { label: "Go to About", action: "select-all-skills" },
    { label: "Go to Projects", action: "select-all-skills" },
  ],
  Run: [
    { label: "Start Build / Deployment", action: "run-build" },
    { label: "Run Unit Tests", action: "run-tests" },
  ],
  Terminal: [
    { label: "New Terminal", action: "new-terminal" },
    { label: "Clear History", action: "clear-terminal" },
  ],
  Help: [
    { label: "About the Developer", action: "about-dev" },
    { label: "Documentation", action: "documentation" },
    { divider: true },
    { label: "Check for Updates", action: "check-updates" },
  ],
}
