import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from '@/components/ui/sonner';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/sections/HeroSection';
import { FeaturedPoemsSection } from '@/sections/FeaturedPoemsSection';
import { NewsletterSection } from '@/sections/NewsletterSection';
import { AboutSection } from '@/sections/AboutSection';
import { ContactSection } from '@/sections/ContactSection';
import { PoemArchiveSection } from '@/sections/PoemArchiveSection';
import { FooterSection } from '@/sections/FooterSection';
import { PoemModal } from '@/components/PoemModal';
import { ScreenFlyingBirds } from '@/components/FlyingBirds';
import { SoundToggle, useBirdSounds } from '@/components/SoundToggle';

gsap.registerPlugin(ScrollTrigger);

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

function App() {
  const [activePoemSlug, setActivePoemSlug] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Enable bird sounds (only on desktop)
  useBirdSounds(soundEnabled);

  useEffect(() => {
    // Wait for all content to load before initializing scroll triggers
    const timer = setTimeout(() => {
      setIsLoaded(true);
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Skip snap if reduced motion is preferred
    if (prefersReducedMotion()) return;

    // Global scroll snap for pinned sections - gentler settings
    const setupSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            // Check if within any pinned range (with buffer)
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.03 && value <= r.end + 0.03
            );
            if (!inPinned) return value; // Flowing section: free scroll

            // Find nearest pinned center
            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.2, max: 0.5 },
          delay: 0,
          ease: 'power2.inOut',
        },
      });
    };

    // Delay snap setup to ensure all triggers are created - reduced to 500ms
    const snapTimer = setTimeout(setupSnap, 500);

    return () => {
      clearTimeout(snapTimer);
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || prefersReducedMotion()) return;

    // Optimized scroll snap calculation
    const setupSnap = () => {
      // Only snap if we have enough height to scroll
      if (ScrollTrigger.maxScroll(window) <= 0) return;

      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);

      if (pinned.length === 0) return;

      ScrollTrigger.create({
        snap: {
          snapTo: (value) => {
            // simplified snap logic with directional awareness
            const pinnedRanges = pinned.map(st => ({
              start: st.start / (ScrollTrigger.maxScroll(window) || 1),
              end: st.end ? st.end / (ScrollTrigger.maxScroll(window) || 1) : st.start
            }));

            // Check if we are in a pinned section and should snap to center
            for (const r of pinnedRanges) {
              // If we are close to this section
              if (value >= r.start - 0.05 && value <= r.end + 0.05) {
                // Calculate center point
                const center = r.start + (r.end - r.start) / 2;
                return center;
              }
            }
            return value; // Don't snap if not near a pinned section
          },
          duration: { min: 0.1, max: 0.3 }, // Faster snap
          delay: 0.1, // Small delay before snap starts
          ease: 'power1.inOut', // Gentler ease
          inertia: false // Disable inertia for more predictable snapping
        }
      });
    };

    // Slight delay to ensure layout is stable
    const timer = setTimeout(setupSnap, 500);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Scroll-based Day/Night Cycle
  useEffect(() => {
    if (!isLoaded || prefersReducedMotion()) return;

    // Background elements
    const valleyBg = document.querySelector('.valley-background');
    const daySky = document.querySelector('.sky-day');
    const sunsetSky = document.querySelector('.sky-sunset');
    const nightSky = document.querySelector('.sky-night');
    const stars = document.querySelector('.stars-overlay');

    // Create a master timeline linked to total scroll distance
    const cycleTl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1, // Very subtle, instant response
      }
    });

    // 0-20%: Sunrise (Default) -> Day
    // Fade in Day Sky
    if (daySky) {
      cycleTl.fromTo(daySky, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.15);
    }

    // 20-55%: Day -> Sunset
    // Fade in Sunset Sky
    if (sunsetSky) {
      cycleTl.fromTo(sunsetSky, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.55);
    }

    // 55-80%: Sunset -> Night
    // Fade in Night Sky
    if (nightSky) {
      cycleTl.fromTo(nightSky, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.8);
    }

    // 80-100%: Night -> Deep Night + Stars
    // Fade in Stars
    if (stars) {
      cycleTl.fromTo(stars, { opacity: 0 }, { opacity: 0.8, ease: 'none' }, 0.85);
    }

    // Dim the valley image as it gets darker (Sunset/Night)
    if (valleyBg) {
      cycleTl.to(valleyBg, { opacity: 0.3, ease: 'none' }, 0.6); // Start dimming at sunset
    }

    return () => {
      cycleTl.kill();
    };
  }, [isLoaded]);

  const scrollToNewsletter = () => {
    const newsletterSection = document.querySelector('#newsletter');
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Sky Layers - stacking context is important */}
      <div className="sky-layer sky-day opacity-0" />
      <div className="sky-layer sky-sunset opacity-0" />
      <div className="sky-layer sky-night opacity-0" />
      <div className="stars-overlay opacity-0" />

      {/* Fixed Valley Background - covers entire page */}
      <div className="valley-background" />

      {/* Valley overlay for better text readability */}
      <div className="fixed inset-0 z-0 valley-overlay pointer-events-none" />

      {/* Grain Overlay - very subtle */}
      <div className="grain-overlay" />

      {/* Flying Birds Across Screen - desktop only */}
      <ScreenFlyingBirds soundEnabled={soundEnabled} />

      {/* Navigation */}
      <Navigation onSubscribeClick={scrollToNewsletter} />

      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection onSubscribeClick={scrollToNewsletter} />
        <FeaturedPoemsSection onPoemClick={setActivePoemSlug} />
        <NewsletterSection />
        <AboutSection />
        <ContactSection />
        <PoemArchiveSection onPoemClick={setActivePoemSlug} />
        <FooterSection />
      </main>

      {/* Poem Modal */}
      {activePoemSlug && (
        <PoemModal
          slug={activePoemSlug}
          onClose={() => setActivePoemSlug(null)}
          onNavigate={setActivePoemSlug}
        />
      )}

      {/* Sound Toggle - desktop only */}
      <SoundToggle onToggle={setSoundEnabled} />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(255,255,255,0.4)',
            color: '#2A2A2A',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </div>
  );
}

export default App;
