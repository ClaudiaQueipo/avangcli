'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

import { FeaturesSection } from '@/components/home/features-section';
import { CtaSection } from '@/components/home/cta-section';
import ScaffoldinSection from '@/components/home/scaffolding-section';
import FooterSection from '@/components/home/footer-section';
import RoadmapSection from '@/components/home/roadmap-section';
import HeroeSection from '@/components/home/heroe-section';
import CreatorsSection from '@/components/home/creators-sections';
import TopButton from '@/components/top-button';
import LogoSkeleton from '@/components/logo-skeleton';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  const loaderContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
  let ctx = gsap.context(() => {
    const tl = gsap.timeline();

    const animateOut = () => {
      tl.to(logoRef.current, { 
        y: -50, 
        opacity: 0, 
        duration: 0.8, 
        ease: "power3.inOut" 
      });
      tl.to(loaderContainerRef.current, {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        onComplete: () => setIsLoading(false)
      }, "-=0.4");
    };

    const minDelayPromise = new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });

    const loadPromise = new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve(true);
      } else {
        window.addEventListener("load", () => resolve(true), { once: true });
      }
    });

    Promise.all([minDelayPromise, loadPromise]).then(() => {
      animateOut();
    });

  }, loaderContainerRef);

  return () => ctx.revert();
}, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#161616] text-surf-crest">
      
      {isLoading && (
        <div 
          ref={loaderContainerRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#161616]"
        >
          <div ref={logoRef} className="w-full h-full flex items-center justify-center">
            <LogoSkeleton className="w-100 h-48 " />
          </div>
        </div>
      )}

      <div className="relative z-10">
        <HeroeSection />
        <FeaturesSection />
        <ScaffoldinSection/>
        <RoadmapSection/>
        <CreatorsSection/>
        <CtaSection />
        <FooterSection/>
      </div>
      
      <TopButton />
    </main>
  );
}