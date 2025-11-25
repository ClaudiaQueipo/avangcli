
export default function TechStackSection() {
  return (
    <>
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold mb-12 text-muted-foreground">Potenciado por las mejores tecnologías</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center font-bold text-2xl">N</div>
              <span className="font-medium">Next.js</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-[#009688] text-white rounded-full flex items-center justify-center font-bold text-2xl">F</div>
              <span className="font-medium">FastAPI</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-[#3178C6] text-white rounded-full flex items-center justify-center font-bold text-2xl">TS</div>
              <span className="font-medium">TypeScript</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-[#2496ED] text-white rounded-full flex items-center justify-center font-bold text-2xl">D</div>
              <span className="font-medium">Docker</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-[#38BDF8] text-white rounded-full flex items-center justify-center font-bold text-2xl">T</div>
              <span className="font-medium">Tailwind</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}