import type React from "react"
import { ChevronRight } from "lucide-react"
import { menuItems, type MenuItem } from "@/lib/menu-data"
import type { MenuType, ColorScheme } from "@/lib/portfolio-types"

interface MenuDropdownProps {
  menuName: MenuType
  activeMenu: MenuType
  isDarkMode: boolean
  colors: ColorScheme
  onMenuAction: (action: string) => void
}

export function MenuDropdown({
  menuName,
  activeMenu,
  isDarkMode,
  colors,
  onMenuAction,
}: MenuDropdownProps): React.ReactElement | null {
  if (activeMenu !== menuName || !menuName) return null

  const items = (menuName ? menuItems[menuName as Exclude<MenuType, null>] : []) || []

  return (
    <div
      className={`absolute top-full left-0 mt-1 ${isDarkMode ? "bg-[#252526]" : "bg-[#f3f3f3]"} border ${isDarkMode ? "border-[#454545]" : "border-[#d4d4d4]"} rounded shadow-lg min-w-[220px] py-1 z-50 transition-colors duration-300`}
    >
      {items.map((item: MenuItem, index: number) => {
        if (item.divider) {
          return <div key={index} className={`h-px ${isDarkMode ? "bg-[#454545]" : "bg-[#d4d4d4]"} my-1`} />
        }
        if (item.submenu) {
          return (
            <div key={index} className="relative group">
              <div
                className={`px-4 py-2 text-[13px] cursor-pointer ${isDarkMode ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8e8e8]"} flex items-center justify-between`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
              <div
                className={`absolute left-full top-0 ml-1 ${isDarkMode ? "bg-[#252526]" : "bg-[#f3f3f3]"} border ${isDarkMode ? "border-[#454545]" : "border-[#d4d4d4]"} rounded shadow-lg min-w-[180px] py-1 hidden group-hover:block`}
              >
                {item.submenu?.map((subitem, subindex) => (
                  <div
                    key={subindex}
                    onClick={() => onMenuAction(subitem.action)}
                    className={`px-4 py-2 text-[13px] cursor-pointer ${isDarkMode ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8e8e8]"}`}
                  >
                    {subitem.label}
                  </div>
                ))}
              </div>
            </div>
          )
        }
        return (
          <div
            key={index}
            onClick={() => item.action && onMenuAction(item.action)}
            className={`px-4 py-2 text-[13px] cursor-pointer ${isDarkMode ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8e8e8]"}`}
          >
            {item.label}
          </div>
        )
      })}
    </div>
  )
}
