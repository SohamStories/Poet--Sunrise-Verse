import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface FlyingBirdsProps {
  soundEnabled?: boolean;
}

// Check if device is touch/mobile
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
};

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export function FlyingBirds(_props: FlyingBirdsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion()) return;

    const birds = containerRef.current.querySelectorAll('.bird');
    
    // Gentle entrance animation
    gsap.fromTo(
      birds,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.15,
      }
    );

    // Very subtle floating animation
    birds.forEach((bird, index) => {
      gsap.to(bird, {
        y: '+=-3',
        x: '+=2',
        duration: 5 + index * 0.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });

    return () => {
      gsap.killTweensOf(birds);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute pointer-events-none"
      style={{
        left: '18vw',
        top: '22vh',
        width: '18vw',
      }}
    >
      <svg
        viewBox="0 0 200 100"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="bird" style={{ transformOrigin: 'center' }}>
          <path
            d="M20 40 Q30 30 40 40 Q35 35 30 38 Q25 35 20 40"
            fill="#2A2A2A"
            opacity="0.6"
          />
        </g>
        <g className="bird" style={{ transformOrigin: 'center' }}>
          <path
            d="M50 35 Q62 22 74 35 Q68 28 62 32 Q56 28 50 35"
            fill="#2A2A2A"
            opacity="0.5"
          />
        </g>
        <g className="bird" style={{ transformOrigin: 'center' }}>
          <path
            d="M80 45 Q92 32 104 45 Q98 38 92 42 Q86 38 80 45"
            fill="#2A2A2A"
            opacity="0.55"
          />
        </g>
        <g className="bird" style={{ transformOrigin: 'center' }}>
          <path
            d="M110 30 Q122 17 134 30 Q128 23 122 27 Q116 23 110 30"
            fill="#2A2A2A"
            opacity="0.45"
          />
        </g>
        <g className="bird" style={{ transformOrigin: 'center' }}>
          <path
            d="M140 50 Q152 37 164 50 Q158 43 152 47 Q146 43 140 50"
            fill="#2A2A2A"
            opacity="0.4"
          />
        </g>
      </svg>
    </div>
  );
}

// Birds that fly across the entire screen - optimized version
export function ScreenFlyingBirds(_props: FlyingBirdsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsMobile(isTouchDevice());
    setReducedMotion(prefersReducedMotion());
  }, []);

  // Don't render flying birds on mobile or if reduced motion is preferred
  if (isMobile || reducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
      {/* Bird flock 1 - gentle glide */}
      <div 
        className="absolute animate-bird-glide"
        style={{ top: '12%', animationDelay: '0s' }}
      >
        <svg width="70" height="35" viewBox="0 0 70 35" fill="none">
          <g className="animate-wing-flap" style={{ transformOrigin: '18px 17px' }}>
            <path d="M8 17 Q15 10 25 17 Q20 13 16 16 Q12 13 8 17" fill="#1a1a1a" opacity="0.7"/>
          </g>
          <g className="animate-wing-flap" style={{ transformOrigin: '32px 14px', animationDelay: '0.12s' }}>
            <path d="M25 14 Q32 7 42 14 Q37 10 33 13 Q29 10 25 14" fill="#1a1a1a" opacity="0.6"/>
          </g>
          <g className="animate-wing-flap" style={{ transformOrigin: '48px 19px', animationDelay: '0.06s' }}>
            <path d="M42 19 Q49 12 59 19 Q54 15 50 18 Q46 15 42 19" fill="#1a1a1a" opacity="0.65"/>
          </g>
        </svg>
      </div>

      {/* Bird flock 2 - slower, lower */}
      <div 
        className="absolute animate-bird-glide-slow"
        style={{ top: '28%', animationDelay: '-12s' }}
      >
        <svg width="55" height="28" viewBox="0 0 55 28" fill="none">
          <g className="animate-wing-flap" style={{ transformOrigin: '14px 14px' }}>
            <path d="M6 14 Q12 8 20 14 Q16 10 12 13 Q9 10 6 14" fill="#1a1a1a" opacity="0.6"/>
          </g>
          <g className="animate-wing-flap" style={{ transformOrigin: '28px 11px', animationDelay: '0.1s' }}>
            <path d="M20 11 Q27 5 35 11 Q31 7 27 10 Q23 7 20 11" fill="#1a1a1a" opacity="0.55"/>
          </g>
          <g className="animate-wing-flap" style={{ transformOrigin: '42px 16px', animationDelay: '0.05s' }}>
            <path d="M35 16 Q42 10 50 16 Q46 12 42 15 Q38 12 35 16" fill="#1a1a1a" opacity="0.5"/>
          </g>
        </svg>
      </div>

      {/* Single bird - occasional */}
      <div 
        className="absolute animate-bird-glide-fast"
        style={{ top: '45%', animationDelay: '-6s', animationDuration: '22s' }}
      >
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
          <g className="animate-wing-flap" style={{ transformOrigin: '11px 7px' }}>
            <path d="M5 7 Q11 2 17 7 Q14 4 11 6 Q8 4 5 7" fill="#1a1a1a" opacity="0.75"/>
          </g>
        </svg>
      </div>

      {/* Another flock - medium speed */}
      <div 
        className="absolute animate-bird-glide"
        style={{ top: '62%', animationDelay: '-18s', animationDuration: '30s' }}
      >
        <svg width="60" height="32" viewBox="0 0 60 32" fill="none">
          <g className="animate-wing-flap" style={{ transformOrigin: '16px 16px' }}>
            <path d="M7 16 Q14 9 24 16 Q19 12 15 15 Q11 12 7 16" fill="#1a1a1a" opacity="0.62"/>
          </g>
          <g className="animate-wing-flap" style={{ transformOrigin: '32px 13px', animationDelay: '0.1s' }}>
            <path d="M24 13 Q31 6 41 13 Q36 9 32 12 Q28 9 24 13" fill="#1a1a1a" opacity="0.58"/>
          </g>
          <g className="animate-wing-flap" style={{ transformOrigin: '46px 18px', animationDelay: '0.07s' }}>
            <path d="M41 18 Q48 11 55 18 Q50 14 46 17 Q43 14 41 18" fill="#1a1a1a" opacity="0.55"/>
          </g>
        </svg>
      </div>
    </div>
  );
}
