'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Star, BookOpen } from 'lucide-react';
import Logo from './logo';
import gsap from 'gsap';
import { Icon } from '@iconify/react';

const GITHUB_REPO_URL = 'https://github.com/ClaudiaQueipo/avangcli';
const GITHUB_API_URL = 'https://api.github.com/repos/ClaudiaQueipo/avangcli';

const formatStarCount = (count: number): string => {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
};

const NAV_ITEMS = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'features', label: 'Features', href: '#features' },
    { id: 'scaffolding', label: 'Scaffolding', href: '#scaffolding' },
    { id: 'roadmap', label: 'Roadmap', href: '#roadmap' },
    { id: 'creators', label: 'Creators', href: '#creators' },
    { id: 'cta', label: 'Start project', href: '#cta' },
];

const Navbar = () => {
    const [starCount, setStarCount] = useState<number | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchStarCount() {
            try {
                const response = await fetch(GITHUB_API_URL, {
                    headers: { 'User-Agent': 'Next.js App' }
                });
                
                if (!response.ok) {
                    console.error('Error de red al obtener las estrellas de GitHub.');
                    setStarCount(0);
                    return;
                }

                const data = await response.json();
                setStarCount(data.stargazers_count);
                
            } catch (error) {
                console.error("No se pudo cargar el conteo de estrellas:", error);
                setStarCount(0);
            }
        }

        fetchStarCount();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            // Detectar sección activa
            const sections = NAV_ITEMS.map(item => item.id);
            const currentSection = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 150 && rect.bottom >= 150;
                }
                return false;
            });

            if (currentSection) {
                setActiveSection(currentSection);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Actualizar posición del indicador cuando cambia la sección activa
    useEffect(() => {
        const activeIndex = NAV_ITEMS.findIndex(item => item.id === activeSection);
        const activeRef = navRefs.current[activeIndex];
        
        if (activeRef) {
            const container = activeRef.parentElement;
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const activeRect = activeRef.getBoundingClientRect();
                
                setIndicatorStyle({
                    left: activeRect.left - containerRect.left,
                    width: activeRect.width,
                });
            }
        }
    }, [activeSection, isScrolled]);

    // Animación del menú móvil con GSAP
    useEffect(() => {
        if (mobileMenuRef.current) {
            if (isMenuOpen) {
                gsap.to(mobileMenuRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                    pointerEvents: 'auto'
                });
            } else {
                gsap.to(mobileMenuRef.current, {
                    opacity: 0,
                    y: -20,
                    duration: 0.3,
                    ease: 'power2.in',
                    pointerEvents: 'none'
                });
            }
        }
    }, [isMenuOpen]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const element = document.getElementById(targetId);
        
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        // Cerrar el menú móvil si está abierto
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav 
            className={`
                w-full z-50
                ${isScrolled 
                    ? 'fixed top-4 left-1/2 -translate-x-1/2 max-w-7xl' 
                    : 'relative max-w-7xl mx-auto'
                }
            `}
        >
            <div 
                className={`
                    grid grid-cols-[80%_20%]  md:grid-cols-[20%_60%_20%]  items-center px-6
                    ${isScrolled 
                        ? 'bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-full py-3 shadow-[0_8px_30px_rgba(0,0,0,0.4)]' 
                        : 'bg-transparent py-0'
                    }
                `}
            >
                {/* Logo - 20% */}
                <div className='flex relative justify-start min-w-[150px]'>
                    <Logo className='w-15 h-8'></Logo>
                    <span className="text-2xl font-bold tracking-wide text-white absolute left-8 ">
                        vangCLI
                    </span> 
                </div>
                

                {/* Navigation Links - 60% */}
                <div className="hidden md:flex justify-center">
                    <div 
                        className={`
                            inline-flex items-center gap-2 p-1 rounded-full backdrop-blur-md border relative
                            ${isScrolled 
                                ? 'bg-[#252525]/50 border-white/5' 
                                : 'bg-[#1a1a1a]/50 border-white/5'
                            }
                        `}
                    >
                        {/* Indicador activo animado */}
                        <div
                            className="absolute bg-[#333] rounded-full shadow-sm transition-all duration-300 ease-out pointer-events-none"
                            style={{
                                left: `${indicatorStyle.left}px`,
                                width: `${indicatorStyle.width}px`,
                                height: 'calc(100% - 8px)',
                                top: '4px',
                            }}
                        />

                        {NAV_ITEMS.map((item, index) => (
                            <a
                                key={item.id}
                                ref={(el) => { 
                                    navRefs.current[index] = el; 
                                }}
                                href={item.href}
                                onClick={(e) => handleNavClick(e, item.href)}
                                className={`
                                    px-5 py-2 rounded-full text-sm transition-colors relative z-10
                                    ${activeSection === item.id 
                                        ? 'text-white' 
                                        : 'text-gray-400 hover:text-white'
                                    }
                                `}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Buttons Group - 20% */}
                <div className="flex items-center justify-end gap-3 ">
                    {/* Botón de menú para móvil */}
                    <button 
                        className="md:hidden flex items-center justify-center text-white"
                        onClick={toggleMenu}
                    >
                        <Icon 
                            icon={isMenuOpen ? "mdi:close" : "mdi:menu"} 
                            className="w-6 h-6" 
                        />
                    </button>

                    {/* Botones para desktop */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Botón Docs */}
                        <Link
                            href="/docs"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span>Docs</span>
                        </Link>

                        {/* Botón GitHub */}
                        <Link
                            href={GITHUB_REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-lime-400/50 text-lime-400 hover:bg-lime-400 hover:text-black transition-all text-sm font-medium"
                        >
                            <span className="flex items-center gap-1.5 border-r border-lime-400/50 pr-3">
                                GitHub
                            </span>
                            
                            <span className="flex items-center gap-1 font-bold">
                                <Star className="w-4 h-4" />
                                {starCount !== null ? (
                                    formatStarCount(starCount)
                                ) : (
                                    <span className="w-6 h-4 bg-lime-400/20 rounded animate-pulse"></span>
                                )}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Menú móvil desplegable */}
            <div 
                ref={mobileMenuRef}
                className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 opacity-0 pointer-events-none"
            >
                <div className="flex flex-col gap-3">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.id}
                            href={item.href}
                            onClick={(e) => handleNavClick(e, item.href)}
                            className={`
                                px-4 py-3 rounded-xl text-base transition-colors
                                ${activeSection === item.id 
                                    ? 'bg-[#252525] text-white' 
                                    : 'text-gray-400 hover:text-white'
                                }
                            `}
                        >
                            {item.label}
                        </a>
                    ))}
                    
                    <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-white/10">
                        <Link
                            href="/docs"
                            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-all text-base font-medium"
                        >
                            <BookOpen className="w-5 h-5" />
                            <span>Docs</span>
                        </Link>

                        <Link
                            href={GITHUB_REPO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-lime-400/50 text-lime-400 hover:bg-lime-400 hover:text-black transition-all text-base font-medium"
                        >
                            <span className="flex items-center gap-1.5 border-r border-lime-400/50 pr-3">
                                GitHub
                            </span>
                            
                            <span className="flex items-center gap-1 font-bold">
                                <Star className="w-5 h-5" />
                                {starCount !== null ? (
                                    formatStarCount(starCount)
                                ) : (
                                    <span className="w-6 h-4 bg-lime-400/20 rounded animate-pulse"></span>
                                )}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;