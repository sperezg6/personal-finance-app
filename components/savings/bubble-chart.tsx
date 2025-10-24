'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BubbleData {
  id: string
  name: string
  amount: number
  percentage: number
  gradient: string
  glowColor: string
  solidColor: string
  icon: string
}

const savingsData: BubbleData[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    amount: 12500,
    percentage: 35,
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald gradient
    glowColor: 'rgba(16, 185, 129, 0.6)',
    solidColor: '#10b981',
    icon: '💰'
  },
  {
    id: '2',
    name: 'Stocks',
    amount: 8200,
    percentage: 23,
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', // Indigo gradient
    glowColor: 'rgba(99, 102, 241, 0.6)',
    solidColor: '#6366f1',
    icon: '📈'
  },
  {
    id: '3',
    name: 'Car Fund',
    amount: 6000,
    percentage: 17,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Blue gradient
    glowColor: 'rgba(59, 130, 246, 0.6)',
    solidColor: '#3b82f6',
    icon: '🚗'
  },
  {
    id: '4',
    name: 'House',
    amount: 5500,
    percentage: 15,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // Violet gradient
    glowColor: 'rgba(139, 92, 246, 0.6)',
    solidColor: '#8b5cf6',
    icon: '🏠'
  },
  {
    id: '5',
    name: 'Vacation',
    amount: 2800,
    percentage: 8,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', // Pink gradient (CHANGED from purple)
    glowColor: 'rgba(236, 72, 153, 0.6)',
    solidColor: '#ec4899',
    icon: '✈️'
  },
  {
    id: '6',
    name: 'Other',
    amount: 1000,
    percentage: 2,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Amber gradient (CHANGED from slate)
    glowColor: 'rgba(245, 158, 11, 0.6)',
    solidColor: '#f59e0b',
    icon: '📦'
  }
]

// Calculate bubble size based on amount
const getBubbleSize = (amount: number): number => {
  const maxAmount = 12500
  const minSize = 100
  const maxSize = 200
  return minSize + ((amount / maxAmount) * (maxSize - minSize))
}

// Optimized balanced grid positions - prevents overlaps and uses full vertical space
const bubblePositions: Record<string, { top: string; left: string }> = {
  // Emergency Fund (200px) - Top-left zone, primary focal point
  '1': { top: '20%', left: '18%' },

  // Stocks (160px) - Middle-right zone, secondary focal point
  '2': { top: '50%', left: '75%' },

  // Car Fund (140px) - Bottom-left zone, creates vertical balance
  '3': { top: '73%', left: '20%' },

  // House (135px) - Top-right zone, upper quadrant balance
  '4': { top: '18%', left: '65%' },

  // Vacation (110px) - Bottom-right zone, lower anchor
  '5': { top: '77%', left: '60%' },

  // Other (100px) - Middle-center zone, fills negative space
  '6': { top: '50%', left: '40%' },
}

export function BubbleChart() {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Savings Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative w-full min-h-[600px] rounded-lg overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 50%, hsl(var(--background)) 100%)',
          }}
        >
          {/* Background gradient orbs removed for static layout */}

          {/* Bubble content */}
          <div ref={containerRef} className="relative w-full h-[600px]">
            {mounted && savingsData.map((bubble, index) => {
              const bubbleSize = getBubbleSize(bubble.amount)
              const position = bubblePositions[bubble.id]
              // Increased drag constraints for more movement freedom
              const dragConstraints = {
                left: -500,
                right: 500,
                top: -300,
                bottom: 300,
              }

              return (
                <motion.div
                  key={bubble.id}
                  drag
                  dragConstraints={dragConstraints}
                  dragElastic={0.05}
                  dragMomentum={true}
                  dragTransition={{
                    power: 0.1,
                    timeConstant: 200,
                    bounceStiffness: 300,
                    bounceDamping: 20
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    scale: {
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      delay: index * 0.1,
                    },
                    opacity: {
                      duration: 0.4,
                      delay: index * 0.1,
                    },
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -1, 1, 0],
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  whileDrag={{
                    scale: 1.05,
                    rotate: 2,
                    zIndex: 50,
                    transition: { duration: 0.1 }
                  }}
                  onHoverStart={() => setHoveredBubble(bubble.id)}
                  onHoverEnd={() => setHoveredBubble(null)}
                  className="absolute cursor-grab active:cursor-grabbing"
                  style={{
                    width: bubbleSize,
                    height: bubbleSize,
                    left: position.left,
                    top: position.top,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className="w-full h-full rounded-full flex flex-col items-center justify-center text-center p-6 transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: bubble.gradient,
                      boxShadow: hoveredBubble === bubble.id
                        ? `0 0 60px ${bubble.glowColor}, 0 20px 40px rgba(0, 0, 0, 0.3), inset 0 -2px 10px rgba(0, 0, 0, 0.2)`
                        : `0 0 30px ${bubble.glowColor}, 0 10px 30px rgba(0, 0, 0, 0.2), inset 0 -2px 10px rgba(0, 0, 0, 0.2)`,
                    }}
                  >
                    {/* Shine overlay for extra depth */}
                    <div
                      className="absolute inset-0 rounded-full opacity-30"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)'
                      }}
                    />

                    {/* Icon */}
                    <div className="text-3xl mb-1 relative z-10" style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))' }}>
                      {bubble.icon}
                    </div>

                    {/* Category Name */}
                    <div
                      className="font-bold text-xs mb-1 text-white relative z-10"
                      style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
                    >
                      {bubble.name}
                    </div>

                    {/* Amount */}
                    <div
                      className="text-base font-extrabold text-white relative z-10 mb-1"
                      style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
                    >
                      ${bubble.amount.toLocaleString()}
                    </div>

                    {/* Percentage */}
                    <div
                      className="text-xs text-white/90 relative z-10"
                      style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}
                    >
                      {bubble.percentage}%
                    </div>
                  </div>

                  {/* Tooltip on Hover */}
                  <AnimatePresence>
                    {hoveredBubble === bubble.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -top-16 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-4 py-2 rounded-lg shadow-lg border border-border whitespace-nowrap z-50 pointer-events-none"
                        style={{
                          borderColor: bubble.solidColor,
                        }}
                      >
                        <div className="text-sm font-semibold">{bubble.name}</div>
                        <div className="text-xs text-muted-foreground">
                          ${bubble.amount.toLocaleString()} ({bubble.percentage}% of total)
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Drag to reposition
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}

            {/* Instructions */}
            {hoveredBubble && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-3 pointer-events-none z-50"
              >
                <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                  Drag bubbles to rearrange • Hover for details
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
