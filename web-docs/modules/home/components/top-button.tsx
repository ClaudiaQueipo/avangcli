"use client"

import { Icon } from "@iconify/react"
import React, { useEffect, useState } from "react"

const TopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", position: "absolute", overflow: "hidden" }}
        width="0"
        height="0"
      >
        <defs>
          <clipPath id="clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0H0.53A0.16,0.16,0,0,1,0.69,0.16V0.14A0.16,0.16,0,0,0,0.85,0.3H0.84A0.16,0.16,0,0,1,1,0.46V0.5A0.5,0.5,0,0,1,0.5,1H0.5A0.5,0.5,0,0,1,0,0.5V0.5A0.5,0.5,0,0,1,0.5,0Z" />
          </clipPath>
        </defs>
      </svg>

      <button
        onClick={scrollToTop}
        className={`
                    fixed bottom-3 right-4 md:right-3 z-50
                    w-[70px] h-[70px]
                    rounded-full
                    flex items-center justify-center
                    cursor-pointer
                    transition-all duration-300
                    hover:scale-110
                    active:scale-95
                    ${isVisible ? "opacity-100 translate-y-0 animate-gentle-bounce" : "opacity-0 translate-y-10 pointer-events-none"}
                `}
        style={{
          clipPath: "url(#clip)",
          backgroundColor: "#BBF451",
          aspectRatio: "1 / 1"
        }}
        aria-label="Volver arriba"
      >
        <Icon icon="mdi:arrow-up" className="text-black" width="40" height="40" />
      </button>

      <style jsx>{`
        @keyframes gentle-bounce {
          0%,
          100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-8px);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-gentle-bounce {
          animation: gentle-bounce 2s ease-in-out infinite;
        }

        .animate-gentle-bounce:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

export default TopButton
