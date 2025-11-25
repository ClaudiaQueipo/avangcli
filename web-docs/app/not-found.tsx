'use client';

import Link from 'next/link';
import { Home, FileQuestion, ArrowRight } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#161616] p-2 flex flex-col">
            
            {/* SECCIÓN 404 */}
            <section className="relative w-full bg-[#252525] rounded-b-[2.5rem] rounded-t-xl overflow-hidden flex flex-col items-center pt-6 pb-20 shadow-2xl ring-1 ring-white/5 min-h-[98dvh]">

                {/* Efecto de blur en el fondo */}
                <div className="absolute -bottom-[40%] left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-lime-500/15 rounded-[100%] blur-[100px] pointer-events-none z-0" />

                {/* CONTENIDO PRINCIPAL */}
                <div className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-4xl mx-auto flex-1">
                    
                    {/* Número 404 */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block">
                            <h1 className="text-[120px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-lime-300 via-lime-400 to-lime-500 leading-none select-none">
                                404
                            </h1>
                            <div className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-br from-lime-300 via-lime-400 to-lime-500 -z-10" />
                        </div>
                    </div>

                    {/* Mensaje */}
                    <h2 className="text-center text-white text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        Página no encontrada
                    </h2>
                    
                    <p className="text-center text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed font-light">
                        La página que buscas no existe o fue movida a otra ubicación. 
                        Usa los enlaces de abajo para continuar navegando.
                    </p>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-5 w-full justify-center mb-10">
                        <Link
                            href="/"
                            className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-lime-300 transition-all shadow-[0_0_30px_rgba(163,230,53,0.2)] flex items-center justify-center gap-2 group transform hover:-translate-y-1"
                        >
                            <Home className="w-5 h-5" />
                            Ir al Inicio
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href="/docs/getting-started/installation"
                            className="px-8 py-4 rounded-full border-lime-400/50 text-lime-400 hover:bg-lime-400 hover:text-black font-semibold border transition-colors text-center flex items-center justify-center gap-2"
                        >
                            <FileQuestion className="w-5 h-5" />
                            Ver Documentación
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NotFound;