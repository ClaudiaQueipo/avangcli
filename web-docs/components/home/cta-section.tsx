'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from "@/components/ui/button";
import { Copy, Check, Terminal, ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function CtaSection() {
  const [copied, setCopied] = useState(false);
  const command = "npx avang-cli init my-app";
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const commandBoxRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Esperar a que el componente esté montado
    if (!titleRef.current || !subtitleRef.current || !commandBoxRef.current || !buttonRef.current || !footerRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Establecer estado inicial explícitamente
      const elements = [
        titleRef.current,
        subtitleRef.current,
        commandBoxRef.current,
        buttonRef.current,
        footerRef.current
      ];

      gsap.set(elements, {
        opacity: 0,
        y: 30
      });

      // Timeline para la animación secuencial del contenido
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        defaults: {
          ease: 'power3.out'
        }
      });

      // Secuencia de animaciones
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, '-=0.4')
      .to(commandBoxRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.4)'
      }, '-=0.3')
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(2)'
      }, '-=0.2')
      .to(footerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
      }, '-=0.2');

      // Animación del glow central (independiente)
      gsap.to('.central-glow', {
        scale: 1.1,
        opacity: 0.15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Hover effects separados (sin GSAP para evitar conflictos)
  const handleCommandMouseEnter = () => {
    if (commandBoxRef.current) {
      gsap.to(commandBoxRef.current, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleCommandMouseLeave = () => {
    if (commandBoxRef.current) {
      gsap.to(commandBoxRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleButtonMouseEnter = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        y: -4,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleButtonMouseLeave = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  return (
    <section ref={sectionRef} className="py-32 px-4 text-center relative overflow-hidden bg-[#161616]" id='cta'>
      
      {/* Fondo Ambiental (Glow Central) */}
      <div className="central-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Grid Pattern Sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <div className="container mx-auto max-w-4xl relative z-10 flex flex-col items-center">
        
        {/* Título Principal */}
        <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-[1.1]">
          ¿Listo para crear tu <br />
          <span className="font-serif italic text-[#BBF451]">próximo gran proyecto?</span>
        </h2>
        
        {/* Subtítulo */}
        <p ref={subtitleRef} className="text-xl text-gray-400 mb-12 max-w-2xl font-light leading-relaxed">
          Deja de configurar entornos y empieza a desarrollar. Un solo comando te separa de una arquitectura full-stack escalable con Next.js y FastAPI.
        </p>
        
        <div className="flex flex-col items-center gap-8 w-full">
          
          {/* Bloque de Código Interactivo */}
          <div 
            ref={commandBoxRef}
            onMouseEnter={handleCommandMouseEnter}
            onMouseLeave={handleCommandMouseLeave}
            className="group relative flex items-center gap-3 bg-[#1a1a1a] border border-white/10 hover:border-lime-500/30 rounded-2xl p-2 pl-6 pr-2 shadow-2xl transition-colors duration-300 w-full max-w-md"
          >
            
            {/* Icono Terminal Decorativo */}
            <Terminal className="w-5 h-5 text-gray-500 group-hover:text-lime-400 transition-colors" />
            
            {/* Comando */}
            <code className="flex-1 text-left font-mono text-sm md:text-base text-gray-300">
              <span className="text-lime-400">npx</span> avang-cli init my-app
            </code>
            
            {/* Botón Copiar */}
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleCopy}
              className="relative text-gray-400 hover:text-white hover:bg-white/5 rounded-xl h-10 w-10 shrink-0 transition-all"
            >
              <div className={`transition-all duration-300 ${copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                 <Copy className="w-4 h-4" />
              </div>
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${copied ? 'scale-100 opacity-100 text-lime-400' : 'scale-0 opacity-0'}`}>
                 <Check className="w-4 h-4" />
              </div>
            </Button>
          </div>

          {/* Botón de Acción Principal */}
          <Button 
            ref={buttonRef}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
            size="lg" 
            className="group relative bg-[#D4FC79] hover:bg-[#c2ed56] text-black font-bold h-14 px-10 text-lg rounded-full shadow-[0_0_20px_rgba(212,252,121,0.3)] hover:shadow-[0_0_35px_rgba(212,252,121,0.5)] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Empezar ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>

          <p ref={footerRef} className="text-sm text-gray-600">
            Open Source • MIT License • No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}