import { ArrowRight } from "lucide-react"
import { ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface BentoGridProps {
  children: ReactNode
  className?: string
  firstRowHeight?: string
}

export interface BentoCardProps {
  Icon?: React.ComponentType<{ className?: string }>
  name?: string
  description?: string
  href?: string
  cta?: string
  className?: string
  background?: ReactNode
  children?: ReactNode
  variant?: "dark" | "light"
}

export const BentoGrid = ({ children, className, firstRowHeight = "22rem" }: BentoGridProps) => {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4",
        className
      )}
      style={{
        gridTemplateRows: firstRowHeight,
        gridAutoRows: "22rem"
      }}
    >
      {children}
    </div>
  )
}

export const BentoCard = ({
  Icon,
  name,
  description,
  href,
  cta,
  className,
  background,
  children,
  variant = "dark"
}: BentoCardProps) => {
  const hasContent = Icon || name || description || (cta && href) || children

  return (
    <div
      className={cn(
        "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl",
        "transition-all duration-300 hover:shadow-xl",
        variant === "dark"
          ? "bg-[#252525] border border-white/5 hover:border-white/10 shadow-2xl"
          : "bg-[#BBF451] border border-transparent text-black",
        hasContent ? "p-8" : "p-0",
        className
      )}
    >
      <div className={cn("absolute inset-0 overflow-hidden z-0", variant === "dark" ? "opacity-100" : "opacity-90")}>
        {background}
      </div>

      {hasContent && (
        <div className="relative z-20 flex flex-col h-full justify-between pointer-events-none">
          <div className="flex flex-col gap-4">
            {Icon && (
              <div
                className={cn(
                  "p-3 w-fit rounded-xl transition-all duration-300 group-hover:scale-110",
                  variant === "dark" ? "bg-white/5 text-lime-400" : "bg-black/10 text-black"
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-auto pt-10">
            {name && (
              <h3 className={cn("text-2xl font-bold tracking-tight", variant === "dark" ? "text-white" : "text-black")}>
                {name}
              </h3>
            )}

            {description && (
              <p
                className={cn(
                  "text-sm font-medium leading-relaxed max-w-[90%]",
                  variant === "dark" ? "text-gray-400" : "text-black/70"
                )}
              >
                {description}
              </p>
            )}

            {children && <div className="mt-4 pointer-events-auto">{children}</div>}

            {cta && href && (
              <div className="pt-4 pointer-events-auto">
                <a
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-2 text-sm font-bold transition-all",
                    variant === "dark"
                      ? "text-lime-400 hover:text-lime-300 hover:translate-x-1"
                      : "text-black hover:opacity-70 hover:translate-x-1"
                  )}
                >
                  {cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}