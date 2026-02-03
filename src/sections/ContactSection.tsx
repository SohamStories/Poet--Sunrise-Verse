import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Download, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';



// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

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
        textRef.current,
        { x: '-25vw', opacity: 0 }, // Reduced from -40vw
        { x: 0, opacity: 1, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        imageRef.current,
        { x: '25vw', opacity: 0 }, // Reduced from 40vw
        { x: 0, opacity: 1, ease: 'none' },
        0.05
      );

      // SETTLE (30-70%): Very subtle parallax on image
      const imgElement = imageRef.current?.querySelector('img');
      if (imgElement) {
        scrollTl.fromTo(
          imgElement,
          { y: 0 },
          { y: '-1vh', ease: 'none' },
          0.3
        );
      }

      // EXIT (70-100%) - gentler
      scrollTl.fromTo(
        textRef.current,
        { x: 0, opacity: 1 },
        { x: '-10vw', opacity: 0, ease: 'power1.in' }, // Reduced from -15vw
        0.7
      );

      scrollTl.fromTo(
        imageRef.current,
        { x: 0, opacity: 1 },
        { x: '10vw', opacity: 0, ease: 'power1.in' }, // Reduced from 15vw
        0.7
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsSent(true);
    toast.success('Message sent! I\'ll get back to you soon.');
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-pinned z-50"
    >
      <div className="flex flex-col lg:flex-row items-center h-full px-6 lg:px-[10vw] gap-6 lg:gap-14">
        {/* Text Content */}
        <div ref={textRef} className="flex-1 w-full lg:max-w-[38vw]">
          <span className="label-small block mb-3">Contact</span>
          <h2
            className="font-serif text-white mb-3 text-shadow-strong"
            style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', lineHeight: 1.1 }}
          >
            Book a reading or collaboration.
          </h2>
          <p className="text-white/85 mb-6 leading-relaxed text-sm lg:text-base text-shadow">
            Available for workshops, events, and custom commissions.
          </p>

          {isSent ? (
            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-5 rounded-xl">
              <Check className="w-5 h-5" />
              <div>
                <p className="font-medium text-sm">Message sent!</p>
                <p className="text-xs">I'll get back to you within 48 hours.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/95 border-sunrise-text/10 rounded-xl px-4 py-4 text-sm"
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/95 border-sunrise-text/10 rounded-xl px-4 py-4 text-sm"
                />
              </div>

              <select
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full bg-white/95 border border-sunrise-text/10 rounded-xl px-4 py-3 text-sm text-sunrise-text focus:outline-none focus:ring-2 focus:ring-sunrise-accent"
              >
                <option value="general">General inquiry</option>
                <option value="collaboration">Collaboration</option>
                <option value="event">Event invite</option>
                <option value="publishing">Publishing</option>
              </select>

              <Textarea
                placeholder="Your message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="bg-white/95 border-sunrise-text/10 rounded-xl px-4 py-3 resize-none text-sm"
              />

              <div className="flex flex-wrap gap-2.5">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-sunrise-accent hover:bg-sunrise-accent/90 text-white rounded-full px-5 py-4 font-medium text-sm transition-all duration-300"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send a message
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/20 rounded-full px-5 py-4 bg-white/10 backdrop-blur-sm text-sm transition-all duration-300"
                  onClick={() => toast.info('Press kit coming soon!')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Press kit
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Image */}
        <div
          ref={imageRef}
          className="w-full lg:w-[32vw] h-[35vh] lg:h-[58vh] flex-shrink-0 hidden lg:block"
        >
          <img
            src="/images/contact-workspace.jpg"
            alt="Creative workspace"
            className="w-full h-full object-cover rounded-[20px]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
