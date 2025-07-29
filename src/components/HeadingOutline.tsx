import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

type Heading = {
  level: number
  text: string
}

type HeadingOutlineProps = {
  headings: Heading[]
}

const HeadingOutline: React.FC<HeadingOutlineProps> = ({ headings }) => {
  const [open, setOpen] = useState(false)

  const getHeadingStyle = (level: number) => {
    const styles: Record<number, string> = {
      1: "text-base font-semibold text-gray-900 dark:text-white",
      2: "text-sm font-semibold text-gray-800 dark:text-gray-100",
      3: "text-sm font-medium text-gray-700 dark:text-gray-300",
      4: "text-xs font-medium text-gray-600 dark:text-gray-400",
      5: "text-xs font-normal text-gray-500 dark:text-gray-500",
      6: "text-[10px] font-light text-gray-400 dark:text-gray-500"
    }
    return styles[Math.min(Math.max(level, 1), 6)]
  }

  const getBulletSize = (level: number) => {
    const sizes: Record<number, string> = {
      1: "w-2 h-2",
      2: "w-2 h-2",
      3: "w-1.5 h-1.5",
      4: "w-1.5 h-1.5",
      5: "w-1 h-1",
      6: "w-1 h-1"
    }
    return sizes[Math.min(Math.max(level, 1), 6)]
  }

  const getIndent = (level: number) => {
    return `pl-${(Math.min(level, 6) - 1) * 4}`
  }

  return (
    <div className="rounded-2xl mt-6 bg-white dark:bg-zinc-900 shadow-md p-4 transition-all duration-300 w-full">
      {/* Top Header & Toggle */}
      <button
        className="flex items-center justify-between w-full mb-2"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Document Outline { !open && `(${headings?.length})` }
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Outline List */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="outline"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {headings.map((heading, index) => {
              const level = Math.min(Math.max(heading.level, 1), 6)

              return (
                <div
                  key={index}
                  className={`my-1 flex items-start gap-2 ${getIndent(level)}`}
                >
                  <span
                    className={`mt-[6px] flex-shrink-0 rounded-full bg-gray-400 dark:bg-gray-600 ${getBulletSize(
                      level
                    )}`}
                  />
                  <p className={`${getHeadingStyle(level)} truncate`}>
                    {heading.text}
                  </p>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Toggle */}
      <button
        className="mt-3 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition w-full"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <>
            <ChevronUp className="w-4 h-4 mr-1" />
            Collapse Outline
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4 mr-1" />
            Expand Outline
          </>
        )}
      </button>
    </div>
  )
}

export default HeadingOutline
