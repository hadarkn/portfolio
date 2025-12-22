import { useState, useEffect, useRef } from "react"
import type { SidebarView, BottomPanelTab, MenuType, SearchResult, CursorPos } from "@/lib/portfolio-types"

export function useUIState() {
  const [sidebarView, setSidebarView] = useState<SidebarView>("explorer")
  const [bottomPanelTab, setBottomPanelTab] = useState<BottomPanelTab>("terminal")
  const [workMode, setWorkMode] = useState("Remote")
  const [activeMenu, setActiveMenu] = useState<MenuType>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [cursorPos, setCursorPos] = useState<CursorPos>({ ln: 15, col: 8 })
  const [isDirty, setIsDirty] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [commandQuery, setCommandQuery] = useState("")
  const [testStatus, setTestStatus] = useState<"idle" | "running" | "success">("idle")
  const [showBreadcrumbDropdown, setShowBreadcrumbDropdown] = useState(false)
  const commandPaletteRef = useRef<HTMLDivElement>(null)
  const breadcrumbRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const showToastNotification = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return {
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
    commandPaletteRef,
    breadcrumbRef,
    menuRef,
    showToastNotification,
  }
}
