import { ReactNode } from "react"

interface ClippedShapeProps {
  width?: number
  height?: number
  color?: string
  bubbleContent?: ReactNode
  children?: ReactNode
  className?: string
}

export default function ClippedShape({
  width = 100,
  height = 100,
  color = "#FBBF45",
  bubbleContent,
  children,
  className = ""
}: ClippedShapeProps) {
  const bubbleSize = width * 0.25
  const bubblePosition = {
    top: height * 0.05,
    right: width * 0.05
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="block absolute" width="0" height="0">
        <defs>
          <clipPath id="clip" clipPathUnits="objectBoundingBox">
            <path d="M0.1,0H0.57A0.1,0.1,0,0,1,0.67,0.1V0.2A0.1,0.1,0,0,0,0.77,0.3H0.9A0.1,0.1,0,0,1,1,0.4V0.9A0.1,0.1,0,0,1,0.9,1H0.1A0.1,0.1,0,0,1,0,0.9V0.1A0.1,0.1,0,0,1,0.1,0Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className="w-full h-full relative overflow-hidden"
        style={{
          clipPath: "url(#clip)",
          backgroundColor: color
        }}
      >
        <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[120%] h-[100px] bg-lime-500/20 rounded-[100%] blur-2xl pointer-events-none" />

        <div className="relative z-10 w-full h-full pt-6 flex items-center justify-center">{children}</div>
      </div>

      {bubbleContent && (
        <div
          className="absolute rounded-full overflow-hidden border-4 border-lime-400/50 shadow-[0_0_15px_rgba(163,230,53,0.5)]"
          style={{
            width: bubbleSize,
            height: bubbleSize,
            top: bubblePosition.top,
            right: bubblePosition.right,
            zIndex: 20
          }}
        >
          {bubbleContent}
        </div>
      )}
    </div>
  )
}
