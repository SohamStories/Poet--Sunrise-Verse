import { useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FlyingBirds } from '@/components/FlyingBirds';

gsap.registerPlugin(ScrollTrigger);

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface HeroSectionProps {
  onSubscribeClick: () => void;
}

export function HeroSection({ onSubscribeClick }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Load animation (on mount)
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Just make everything visible immediately
      gsap.set([headlineRef.current, subheadRef.current, ctaRef.current], {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ 
        defaults: { ease: 'power2.out' },
        delay: 0.2 
      });

      // Headline words stagger - gentler
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 }
        );
      }

      // Subheadline
      tl.fromTo(
        subheadRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4'
      );

      // CTAs
      tl.fromTo(
        ctaRef.current?.children || [],
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        '-=0.3'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Scroll-driven animation - much gentler
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
          onLeaveBack: () => {
            // Reset all elements to visible when scrolling back to top
            gsap.set([headlineRef.current, subheadRef.current, ctaRef.current], {
              opacity: 1,
              x: 0,
              y: 0,
            });
          },
        },
      });

      // EXIT (70-100%) - much gentler
      scrollTl.fromTo(
        [headlineRef.current, subheadRef.current, ctaRef.current],
        { x: 0, opacity: 1 },
        { x: '-25vw', opacity: 0, ease: 'power1.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToPoems = () => {
    const poemsSection = document.querySelector('#poems');
    if (poemsSection) {
      poemsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section-pinned z-10"
    >
      {/* Flying Birds in hero */}
      <FlyingBirds />

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col justify-center px-6 lg:px-[10vw]"
      >
        <h1
          ref={headlineRef}
          className="font-serif text-white leading-[1.08] max-w-[90vw] lg:max-w-[55vw] text-shadow-strong"
          style={{
            fontSize: 'clamp(32px, 5.5vw, 72px)',
            marginTop: '6vh',
          }}
        >
          <span className="word inline-block">Words</span>{' '}
          <span className="word inline-block">that</span>{' '}
          <span className="word inline-block">rise</span>{' '}
          <span className="word inline-block">like</span>{' '}
          <span className="word inline-block">the</span>{' '}
          <span className="word inline-block">sun.</span>
        </h1>

        <p
          ref={subheadRef}
          className="mt-5 text-white/90 max-w-[80vw] lg:max-w-[38vw] leading-relaxed text-shadow"
          style={{
            fontSize: 'clamp(15px, 1.4vw, 19px)',
          }}
        >
          Poems for quiet mornings and wild hearts.
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-3 mt-7">
          <Button
            onClick={scrollToPoems}
            className="bg-sunrise-accent hover:bg-sunrise-accent/90 text-white rounded-full px-7 py-5 text-sm lg:text-base font-medium group transition-all duration-300"
          >
            Read Poems
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button
            onClick={onSubscribeClick}
            variant="outline"
            className="border-white/40 text-white hover:bg-white/20 rounded-full px-7 py-5 text-sm lg:text-base font-medium bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            Join Newsletter
          </Button>
        </div>
      </div>
    </section>
  );
}
