import gsap from "gsap"
import { RefObject, useLayoutEffect, useRef, useState } from "react"

interface UseLoaderAnimationReturn {
  isLoading: boolean
  loaderContainerRef: RefObject<HTMLDivElement | null>
  logoRef: RefObject<HTMLDivElement | null>
}

interface UseLoaderAnimationOptions {
  minDelay?: number
  animationDuration?: number
  ease?: string
}

export function useLoaderAnimation(options: UseLoaderAnimationOptions = {}): UseLoaderAnimationReturn {
  const { minDelay = 3000, animationDuration = 0.8, ease = "power3.inOut" } = options

  const [isLoading, setIsLoading] = useState(true)
  const loaderContainerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      const animateOut = () => {
        tl.to(logoRef.current, {
          y: -50,
          opacity: 0,
          duration: animationDuration,
          ease
        })
        tl.to(
          loaderContainerRef.current,
          {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut",
            onComplete: () => setIsLoading(false)
          },
          "-=0.4"
        )
      }

      const minDelayPromise = new Promise((resolve) => {
        setTimeout(resolve, minDelay)
      })

      const loadPromise = new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve(true)
        } else {
          window.addEventListener("load", () => resolve(true), { once: true })
        }
      })

      Promise.all([minDelayPromise, loadPromise]).then(() => {
        animateOut()
      })
    }, loaderContainerRef)

    return () => ctx.revert()
  }, [minDelay, animationDuration, ease])

  return {
    isLoading,
    loaderContainerRef,
    logoRef
  }
}
