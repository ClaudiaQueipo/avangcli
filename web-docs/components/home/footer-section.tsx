import Link from "next/link";
import { Github, Twitter, FileText, Terminal } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="w-full bg-[#161616] border-t border-white/5 pt-12 pb-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-lime-500/5 blur-[100px] rounded-full pointer-events-none z-0" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-white tracking-tight">AvangCLI</span>
          </div>

          <div className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} AvangCLI. Built for builders.
          </div>

          <div className="flex items-center gap-6">
            <Link 
                href="#" 
                className="group flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4FC79] transition-colors duration-300"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">GitHub</span>
            </Link>
            
            <Link 
                href="#" 
                className="group flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4FC79] transition-colors duration-300"
            >
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Docs</span>
            </Link>
            
            <Link 
                href="#" 
                className="group flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4FC79] transition-colors duration-300"
            >
              <Twitter className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}