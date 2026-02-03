import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const initGSAP = () => {
    if (typeof window === 'undefined') return;

    // Register ScrollTrigger once
    gsap.registerPlugin(ScrollTrigger);

    // Lag smoothing: prevents jumps when the main thread is heavy
    // 1st arg: threshold (ms) - if time between ticks > this, adjust.
    // 2nd arg: adjusted time (ms) - "jump" to this much time instead of the huge gap.
    // A value of (1000, 16) means if a frame takes >1000ms (huge freeze), 
    // GSAP acts as if only 16ms passed, preserving smooth animation flow.
    gsap.ticker.lagSmoothing(1000, 16);

    // Global ScrollTrigger defaults for performance
    ScrollTrigger.config({
        // Limit resize callbacks to avoid thrashing
        limitCallbacks: true,
        // Sync with React hydration/lifecycle better
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
    });

    // Optional: Normalize scroll for unified experience across devices
    // This can help with mobile address bar resizing jitters
    ScrollTrigger.normalizeScroll(true);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
