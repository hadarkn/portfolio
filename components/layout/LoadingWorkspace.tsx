import React from "react"
import { motion } from "framer-motion"

interface LoadingWorkspaceProps {
  isDarkMode: boolean
  progress: number
}

export function LoadingWorkspace({ isDarkMode, progress }: LoadingWorkspaceProps) {
  const bgColor = isDarkMode ? "#1e1e1e" : "#ffffff"
  const textColor = isDarkMode ? "#cccccc" : "#333333"
  const accentColor = "#007acc"

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full"
      style={{ backgroundColor: bgColor }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6"
      >
        {/* VS Code Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
            <path
              d="M95.6 19.4L74.2 6.7c-1.8-1.1-4.1-1.1-5.9 0L29.7 31.8 12.5 18.6c-1.5-1.2-3.7-.9-4.9.5L2.4 25c-1.2 1.4-1.1 3.5.2 4.8l14.3 12.7L2.6 55.2c-1.3 1.3-1.4 3.4-.2 4.8l5.2 5.9c1.2 1.4 3.4 1.7 4.9.5l17.2-13.2 38.6 25.1c.9.6 1.9.9 2.9.9s2-.3 2.9-.9l21.4-12.7c1.8-1.1 2.9-3 2.9-5.1V24.5c.1-2.1-1-4-2.8-5.1zM68.4 67.3L40.7 48.4l27.7-18.9v37.8z"
              fill={accentColor}
            />
          </svg>
        </motion.div>

        {/* Loading Text */}
        <div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: textColor }}>
            Loading Workspace...
          </h2>
          <p className="text-sm" style={{ color: isDarkMode ? "#858585" : "#6e6e6e" }}>
            hadar portfolio
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: isDarkMode ? "#3c3c3c" : "#e0e0e0" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accentColor }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Loading Steps */}
        <motion.div
          className="text-xs space-y-1"
          style={{ color: isDarkMode ? "#858585" : "#6e6e6e" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 20 ? 1 : 0.3 }}
          >
            ✓ Initializing workspace
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 50 ? 1 : 0.3 }}
          >
            ✓ Loading extensions
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 80 ? 1 : 0.3 }}
          >
            {progress >= 100 ? "✓" : "○"} Opening files...
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
