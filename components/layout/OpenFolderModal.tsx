import React from "react"
import { motion } from "framer-motion"

interface OpenFolderModalProps {
  isDarkMode: boolean
  typedText: string
}

export function OpenFolderModal({ isDarkMode, typedText }: OpenFolderModalProps) {
  const bgColor = isDarkMode ? "#252526" : "#f3f3f3"
  const textColor = isDarkMode ? "#cccccc" : "#333333"
  const inputBg = isDarkMode ? "#3c3c3c" : "#ffffff"
  const borderColor = isDarkMode ? "#454545" : "#c0c0c0"

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-lg shadow-2xl overflow-hidden"
        style={{
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          width: "550px",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-3 border-b flex items-center justify-between"
          style={{ borderColor, backgroundColor: isDarkMode ? "#2d2d30" : "#f9f9f9" }}
        >
          <h3 className="text-base font-semibold" style={{ color: textColor }}>
            Open Folder
          </h3>
          <button
            className="text-xl hover:opacity-60 transition-opacity flex items-center justify-center w-6 h-6"
            style={{ color: textColor }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs mb-2 block font-semibold uppercase" style={{ color: isDarkMode ? "#858585" : "#666666" }}>
              Folder path:
            </label>
            <div
              className="px-4 py-3 rounded font-mono text-sm border flex items-center"
              style={{
                backgroundColor: inputBg,
                borderColor,
                color: textColor,
              }}
            >
              <span className="text-sm" style={{ color: "#858585" }}>~/</span>
              <span className="ml-1">{typedText}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-[2px] h-[18px] ml-[2px] bg-current align-middle"
              />
            </div>
          </div>

          <div className="text-xs" style={{ color: isDarkMode ? "#858585" : "#666666" }}>
            Recent locations appear here...
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 border-t flex justify-end gap-3"
          style={{ borderColor, backgroundColor: isDarkMode ? "#2d2d30" : "#f9f9f9" }}
        >
          <button
            className="px-5 py-2 rounded text-sm font-medium hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: isDarkMode ? "#3c3c3c" : "#e0e0e0",
              color: textColor,
            }}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#007acc" }}
          >
            Select Folder
          </button>
        </div>
      </motion.div>
    </div>
  )
}
