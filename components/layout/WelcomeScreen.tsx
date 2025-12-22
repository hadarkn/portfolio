import React from "react"
import { motion } from "framer-motion"

interface WelcomeScreenProps {
  isDarkMode: boolean
  highlightedOption: number | null
}

export function WelcomeScreen({ isDarkMode, highlightedOption }: WelcomeScreenProps) {
  const bgColor = isDarkMode ? "#1e1e1e" : "#ffffff"
  const menuBarBg = isDarkMode ? "#2d2d30" : "#f3f3f3"
  const textColor = isDarkMode ? "#e0e0e0" : "#2d2d30"
  const highlightBg = isDarkMode ? "#2d2d30" : "#f0f0f0"
  const accentColor = "#007acc"
  const subtleText = isDarkMode ? "#858585" : "#666666"
  const borderColor = isDarkMode ? "#3e3e42" : "#e0e0e0"

  return (
    <div className="flex flex-col w-screen h-screen" style={{ backgroundColor: bgColor, color: textColor, fontFamily: 'Segoe UI, -apple-system, sans-serif' }}>
      {/* Menu Bar */}
      <div
        className="flex items-center h-10 px-4 border-b"
        style={{ backgroundColor: menuBarBg, borderColor }}
      >
        <div className="flex items-center gap-4">
          <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
            <path
              d="M95.6 19.4L74.2 6.7c-1.8-1.1-4.1-1.1-5.9 0L29.7 31.8 12.5 18.6c-1.5-1.2-3.7-.9-4.9.5L2.4 25c-1.2 1.4-1.1 3.5.2 4.8l14.3 12.7L2.6 55.2c-1.3 1.3-1.4 3.4-.2 4.8l5.2 5.9c1.2 1.4 3.4 1.7 4.9.5l17.2-13.2 38.6 25.1c.9.6 1.9.9 2.9.9s2-.3 2.9-.9l21.4-12.7c1.8-1.1 2.9-3 2.9-5.1V24.5c.1-2.1-1-4-2.8-5.1zM68.4 67.3L40.7 48.4l27.7-18.9v37.8z"
              fill={accentColor}
            />
          </svg>
        </div>
        <div className="flex items-center gap-6 text-sm ml-4">
          <span>File</span>
          <span>Edit</span>
          <span>Selection</span>
          <span>View</span>
          <span>Go</span>
          <span>Run</span>
          <span>Terminal</span>
          <span>Help</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <div className="w-full max-w-3xl space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div>
              <p className="text-xl font-semibold" style={{ color: subtleText }}>
                Portfolio Edition
              </p>
            </div>
          </div>

          {/* Start Section */}
          <div>
            <h2 className="text-xs font-semibold mb-8 uppercase tracking-widest" style={{ color: subtleText }}>
              Start
            </h2>
            <div className="space-y-4">
              {/* New File */}
              <motion.div
                className="flex items-start gap-6 p-5 rounded-lg cursor-pointer transition-all"
                style={{
                  backgroundColor: highlightedOption === 0 ? highlightBg : "transparent",
                }}
                animate={{
                  backgroundColor: highlightedOption === 0 ? highlightBg : "transparent",
                }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="mt-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-semibold" style={{ color: textColor }}>New File...</div>
                  <div className="text-sm mt-1" style={{ color: subtleText }}>
                    Create a new file in the workspace
                  </div>
                </div>
                <div className="ml-auto text-xs font-mono" style={{ color: subtleText }}>Ctrl+N</div>
              </motion.div>

              {/* Open File */}
              <motion.div
                className="flex items-start gap-6 p-5 rounded-lg cursor-pointer transition-all"
                style={{
                  backgroundColor: highlightedOption === 1 ? highlightBg : "transparent",
                }}
                animate={{
                  backgroundColor: highlightedOption === 1 ? highlightBg : "transparent",
                }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="mt-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-semibold" style={{ color: textColor }}>Open File...</div>
                  <div className="text-sm mt-1" style={{ color: subtleText }}>
                    Open a file from your computer
                  </div>
                </div>
                <div className="ml-auto text-xs font-mono" style={{ color: subtleText }}>Ctrl+O</div>
              </motion.div>

              {/* Open Folder - This will be highlighted */}
              <motion.div
                className="flex items-start gap-6 p-5 rounded-lg cursor-pointer transition-all"
                style={{
                  backgroundColor: highlightedOption === 2 ? highlightBg : "transparent",
                  borderLeft: highlightedOption === 2 ? `4px solid ${accentColor}` : "4px solid transparent",
                }}
                animate={{
                  backgroundColor: highlightedOption === 2 ? highlightBg : "transparent",
                  scale: highlightedOption === 2 ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="mt-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={highlightedOption === 2 ? accentColor : accentColor} strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-semibold" style={{ color: highlightedOption === 2 ? accentColor : textColor }}>
                    Open Folder...
                  </div>
                  <div className="text-sm mt-1" style={{ color: subtleText }}>
                    Open a folder as a workspace
                  </div>
                </div>
                <div className="ml-auto text-xs font-mono" style={{ color: subtleText }}>Ctrl+K Ctrl+O</div>
              </motion.div>
            </div>
          </div>

          {/* Recent Section */}
          <div>
            <h2 className="text-xs font-semibold mb-8 uppercase tracking-widest" style={{ color: subtleText }}>
              Recent
            </h2>
            <div className="text-sm italic" style={{ color: subtleText }}>
              No recent folders
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 mt-12 border-t" style={{ borderColor }}>
            <div className="text-xs text-center space-y-2" style={{ color: subtleText }}>
              <p>Welcome to VS Code - Let's get your workspace ready</p>
              <p>📧 Hadarknafo@gmail.com | 🔗 linkedin.com/in/hadar-knafo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
