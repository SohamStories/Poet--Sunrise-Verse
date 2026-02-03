import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Instagram, Twitter, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 92%',
            end: 'top 75%',
            scrub: 0.6,
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative z-[70] py-14 lg:py-18"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/45 to-transparent pointer-events-none" />
      
      <div
        ref={contentRef}
        className="relative px-6 lg:px-[10vw] max-w-[1400px] mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-14 mb-10">
          {/* Brand */}
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-serif text-xl lg:text-2xl font-medium text-white tracking-tight inline-block mb-3 text-shadow"
            >
              Sunrise Verse
            </a>
            <p className="text-white/70 text-sm leading-relaxed text-shadow">
              Poems for quiet mornings and wild hearts.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="label-small mb-3">Navigation</h4>
            <nav className="space-y-2.5">
              {[
                { label: 'Poems', href: '#poems' },
                { label: 'Newsletter', href: '#newsletter' },
                { label: 'About', href: '#about' },
                { label: 'Contact', href: '#contact' },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="block text-white/70 hover:text-white transition-colors duration-300 text-sm text-shadow"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-small mb-3">Connect</h4>
            <div className="space-y-2.5">
              <a
                href="mailto:hello@sunriseverse.poetry"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 text-sm text-shadow"
              >
                <Mail className="w-4 h-4" />
                hello@sunriseverse.poetry
              </a>
              <div className="flex gap-2.5 mt-3">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Instagram coming soon!');
                  }}
                  className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-sunrise-accent hover:text-white transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Twitter coming soon!');
                  }}
                  className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-sunrise-accent hover:text-white transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Blog coming soon!');
                  }}
                  className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-sunrise-accent hover:text-white transition-all duration-300"
                  aria-label="Blog"
                >
                  <BookOpen className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/50 text-xs text-shadow">
            © 2026 Sunrise Verse. All rights reserved.
          </p>
          <button
            onClick={() => alert('Privacy policy coming soon!')}
            className="text-white/50 hover:text-white/80 transition-colors duration-300 text-xs text-shadow"
          >
            Privacy
          </button>
        </div>
      </div>
    </footer>
  );
}
