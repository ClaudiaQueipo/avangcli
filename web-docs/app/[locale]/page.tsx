"use client"

import {
  CreatorsSection,
  CtaSection,
  FeaturesSection,
  FooterSection,
  HeroeSection,
  LogoSkeleton,
  RoadmapSection,
  ScaffoldinSection,
  TopButton,
  useLoaderAnimation
} from "@/modules/home"

export default function Home() {
  const { isLoading, loaderContainerRef, logoRef } = useLoaderAnimation({
    minDelay: 1000,
    animationDuration: 0.8,
    ease: "power3.inOut"
  })

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#161616] text-surf-crest">
      {isLoading && (
        <div ref={loaderContainerRef} className="fixed inset-0 z-50 flex items-center justify-center bg-[#161616]">
          <div ref={logoRef} className="w-full h-full flex items-center justify-center">
            <LogoSkeleton className="w-100 h-48 " />
          </div>
        </div>
      )}

      <div className="relative z-10">
        <HeroeSection />
        <FeaturesSection />
        <ScaffoldinSection />
        <RoadmapSection />
        <CreatorsSection />
        <CtaSection />
        <FooterSection />
      </div>

      <TopButton />
    </main>
  )
}
