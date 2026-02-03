import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

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

      // ENTRANCE (0-30%) - gentler
      scrollTl.fromTo(
        imageRef.current,
        { x: '-45vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        textRef.current,
        { x: '35vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.06
      );

      // SETTLE (30-70%): Very subtle scale on image
      const imgElement = imageRef.current?.querySelector('img');
      if (imgElement) {
        scrollTl.fromTo(
          imgElement,
          { scale: 1 },
          { scale: 1.015, ease: 'none' },
          0.3
        );
      }

      // EXIT (70-100%) - gentler
      scrollTl.fromTo(
        imageRef.current,
        { y: 0, opacity: 1 },
        { y: '-12vh', opacity: 0, ease: 'power1.in' },
        0.7
      );

      scrollTl.fromTo(
        textRef.current,
        { y: 0, opacity: 1 },
        { y: '-8vh', opacity: 0, ease: 'power1.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-pinned z-40"
    >
      <div className="flex flex-col lg:flex-row items-center h-full px-6 lg:px-[10vw] gap-6 lg:gap-14">
        {/* Portrait Image */}
        <div
          ref={imageRef}
          className="w-full lg:w-[32vw] h-[35vh] lg:h-[58vh] flex-shrink-0"
        >
          <img
            src="/images/about-portrait.jpg"
            alt="The poet at dawn"
            className="w-full h-full object-cover rounded-[20px]"
            loading="lazy"
          />
        </div>

        {/* Text Content */}
        <div ref={textRef} className="flex-1 max-w-[90vw] lg:max-w-[36vw]">
          <span className="label-small block mb-3">About</span>
          <h2
            className="font-serif text-white mb-5 text-shadow-strong"
            style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', lineHeight: 1.1 }}
          >
            I write at the edge of dawn.
          </h2>
          
          <div className="space-y-3 text-white/85 leading-relaxed text-sm lg:text-base text-shadow">
            <p>
              I'm a poet based in the hills, collecting moments before the world 
              rushes in. My mornings begin with coffee, a notebook, and the quiet 
              company of birds.
            </p>
            <p>
              My work lives between silence and sound—short verses, long shadows, 
              and the warmth of early light. I believe poetry belongs in everyday 
              moments: a commute, a lunch break, the pause before sleep.
            </p>
            <p>
              When not writing, I lead workshops for emerging poets and collaborate 
              with artists who share my love for the in-between hours.
            </p>
          </div>

          <button
            onClick={() => {
              const contactSection = document.querySelector('#contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="mt-6 inline-flex items-center gap-2 text-sunrise-accent hover:text-sunrise-accent/80 font-medium text-sm group transition-colors duration-300"
          >
            Read the full story
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
