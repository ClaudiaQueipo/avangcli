import { ReactNode } from "react"

interface ClippedCardProps {
  width?: number | string
  height?: number | string
  color?: string
  children?: ReactNode
  className?: string
  showVerticalLine?: boolean
  fillContainer?: boolean
}

export default function ClippedCard({
  width = "100%",
  height = "100%",
  color = "#84cc16",
  children,
  className = "",
  showVerticalLine = false,
  fillContainer = false
}: ClippedCardProps) {
  const containerStyle = fillContainer 
    ? { width: "100%", height: "100%" } 
    : { width, height };

  return (
    <div className={`relative ${className}`} style={containerStyle}>
      <svg xmlns="http://www.w3.org/2000/svg" className="block absolute" width="0" height="0">
        <defs>
          <clipPath id="clip-card" clipPathUnits="objectBoundingBox">
            <path d="M0.1,0H0.57A0.1,0.1,0,0,1,0.67,0.1V0.1A0.1,0.1,0,0,0,0.77,0.2H0.9A0.1,0.1,0,0,1,1,0.3V0.9A0.1,0.1,0,0,1,0.9,1H0.1A0.1,0.1,0,0,1,0,0.9V0.1A0.1,0.1,0,0,1,0.1,0Z" />
          </clipPath>
        </defs>
      </svg>

      <div
        className="w-full h-full relative overflow-hidden"
        style={{
          clipPath: "url(#clip-card)",
          backgroundColor: color
        }}
      >
        <div className="absolute -bottom-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[100px] bg-white/10 rounded-[100%] blur-2xl pointer-events-none" />

        {showVerticalLine && (
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-white/20 to-transparent md:-translate-x-1/2 z-0" />
        )}

        <div className="relative z-10 w-full h-full flex items-center justify-start p-8">{children}</div>
      </div>
    </div>
  )
}