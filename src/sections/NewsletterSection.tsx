import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const socialProofRef = useRef<HTMLParagraphElement>(null);

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=100%', // Reduced from 120%
          pin: true,
          scrub: 0.5,
        },
      });

      // ENTRANCE (0-30%) - gentler
      scrollTl.fromTo(
        cardRef.current,
        { x: '-40vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      // Social proof
      scrollTl.fromTo(
        socialProofRef.current,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.2
      );

      // EXIT (70-100%) - gentler
      scrollTl.fromTo(
        cardRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power1.in' },
        0.7
      );

      scrollTl.fromTo(
        socialProofRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'power1.in' },
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsSubscribed(true);
    toast.success('Welcome to Sunrise Verse! Check your inbox.');
  };

  return (
    <section
      ref={sectionRef}
      id="newsletter"
      className="section-pinned z-30"
    >
      {/* Newsletter Card */}
      <div
        ref={cardRef}
        className="absolute left-6 lg:left-[10vw] top-1/2 -translate-y-1/2 w-[calc(100%-48px)] lg:w-[38vw] max-w-[460px]"
      >
        <div
          className="glass-card rounded-[22px] p-5 lg:p-8"
          style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}
        >
          <span className="label-small block mb-3">Newsletter</span>
          <h2
            className="font-serif text-sunrise-text mb-3"
            style={{ fontSize: 'clamp(26px, 3.2vw, 44px)', lineHeight: 1.1 }}
          >
            Get a poem in your inbox.
          </h2>
          <p className="text-sunrise-text-secondary mb-6 leading-relaxed text-sm lg:text-base">
            One sunrise read per week. No noise—just words.
          </p>

          {isSubscribed ? (
            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
              <Check className="w-5 h-5" />
              <span className="font-medium text-sm">You're subscribed! Welcome aboard.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border-sunrise-text/10 rounded-full px-4 py-5 text-sm focus:ring-2 focus:ring-sunrise-accent"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-sunrise-accent hover:bg-sunrise-accent/90 text-white rounded-full px-6 py-5 font-medium text-sm transition-all duration-300"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Social Proof */}
        <p
          ref={socialProofRef}
          className="mt-5 text-white/80 text-sm text-center lg:text-left text-shadow"
        >
          Join <span className="font-medium text-white">2,000+</span> readers.
        </p>
      </div>
    </section>
  );
}
