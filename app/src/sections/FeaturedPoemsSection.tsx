import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { poems } from '@/data/poems';

gsap.registerPlugin(ScrollTrigger);

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface FeaturedPoemsSectionProps {
  onPoemClick: (slug: string) => void;
}

export function FeaturedPoemsSection({ onPoemClick }: FeaturedPoemsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const linkRef = useRef<HTMLButtonElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const featuredPoems = poems.slice(0, 3);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.8,
        },
      });

      // ENTRANCE (0-30%) - gentler distances
      scrollTl.fromTo(
        [labelRef.current, headlineRef.current],
        { x: '-35vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      // Card 1 from left
      scrollTl.fromTo(
        cardsRef.current[0],
        { x: '-40vw', y: '5vh', rotation: -3, opacity: 0 },
        { x: 0, y: 0, rotation: 0, opacity: 1, ease: 'none' },
        0.05
      );

      // Card 2 from bottom
      scrollTl.fromTo(
        cardsRef.current[1],
        { y: '50vh', scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, ease: 'none' },
        0.1
      );

      // Card 3 from right
      scrollTl.fromTo(
        cardsRef.current[2],
        { x: '40vw', y: '5vh', rotation: 3, opacity: 0 },
        { x: 0, y: 0, rotation: 0, opacity: 1, ease: 'none' },
        0.05
      );

      // Archive link
      scrollTl.fromTo(
        linkRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.2
      );

      // EXIT (70-100%) - gentler
      scrollTl.fromTo(
        cardsRef.current,
        { y: 0, opacity: 1 },
        { y: '-20vh', opacity: 0, ease: 'power1.in' },
        0.7
      );

      scrollTl.fromTo(
        [labelRef.current, headlineRef.current, linkRef.current],
        { x: 0, opacity: 1 },
        { x: '-12vw', opacity: 0, ease: 'power1.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="poems"
      className="section-pinned z-20 flex flex-col justify-center"
    >
      <div className="px-6 lg:px-[10vw] w-full">
        {/* Label */}
        <span
          ref={labelRef}
          className="label-small block mb-3"
          style={{ marginTop: '-2vh' }}
        >
          Featured Verses
        </span>

        {/* Headline */}
        <h2
          ref={headlineRef}
          className="font-serif text-white max-w-[85vw] lg:max-w-[42vw] text-shadow-strong"
          style={{ fontSize: 'clamp(26px, 3.8vw, 56px)', lineHeight: 1.1 }}
        >
          Three poems to start your morning.
        </h2>

        {/* Archive Link */}
        <button
          ref={linkRef}
          onClick={() => {
            const archiveSection = document.querySelector('#archive');
            if (archiveSection) {
              archiveSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="mt-5 text-sunrise-accent hover:text-sunrise-accent/80 font-medium text-sm inline-flex items-center gap-2 group transition-colors duration-300"
        >
          Browse the archive
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 mt-8 max-w-[90vw] mx-auto lg:mx-0">
          {featuredPoems.map((poem, index) => (
            <div
              key={poem.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              onClick={() => onPoemClick(poem.slug)}
              className="group cursor-pointer glass-card rounded-[16px] overflow-hidden card-shadow hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Card Image */}
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={poem.image}
                  alt={poem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>

              {/* Card Content */}
              <div className="p-4 lg:p-5">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {poem.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-wider text-sunrise-text-secondary bg-sunrise-bg-secondary px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-serif text-lg lg:text-xl text-sunrise-text mb-1.5 group-hover:text-sunrise-accent transition-colors duration-300">
                  {poem.title}
                </h3>
                <p className="text-sunrise-text-secondary text-sm line-clamp-2 mb-3">
                  {poem.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-sunrise-accent text-sm font-medium group-hover:gap-3 transition-all duration-300">
                  Read
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
