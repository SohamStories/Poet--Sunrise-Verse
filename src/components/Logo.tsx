import { Sunrise } from 'lucide-react';

interface LogoProps {
    className?: string;
}

export function Logo({ className = '' }: LogoProps) {
    return (
        <div
            className={`inline-flex items-center gap-2 group cursor-pointer ${className}`}
            onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
        >
            <div className="relative">
                <div className="absolute inset-0 bg-sunrise-accent/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Sunrise
                    className="w-6 h-6 lg:w-7 lg:h-7 text-sunrise-accent relative z-10 transition-transform duration-700 group-hover:rotate-12"
                    strokeWidth={1.5}
                />
            </div>

            <div className="flex flex-col leading-none">
                <span className="font-serif text-lg lg:text-xl font-medium text-white tracking-wide group-hover:text-sunrise-accent transition-colors duration-300">
                    Sunrise
                </span>
                <span className="font-sans text-[10px] lg:text-[11px] uppercase tracking-[0.2em] text-white/60 group-hover:text-white/80 transition-colors duration-300 ml-0.5">
                    Verse
                </span>
            </div>
        </div>
    );
}
