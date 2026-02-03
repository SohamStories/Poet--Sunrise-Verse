import { useEffect, useRef } from 'react';
import { X, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { poems } from '@/data/poems';
import gsap from 'gsap';

interface PoemModalProps {
  slug: string;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

export function PoemModal({ slug, onClose, onNavigate }: PoemModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const poem = poems.find((p) => p.slug === slug);
  const currentIndex = poems.findIndex((p) => p.slug === slug);
  const prevPoem = currentIndex > 0 ? poems[currentIndex - 1] : null;
  const nextPoem = currentIndex < poems.length - 1 ? poems[currentIndex + 1] : null;

  useEffect(() => {
    // Entrance animation - gentler
    gsap.fromTo(
      modalRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );
    gsap.fromTo(
      contentRef.current,
      { y: 20, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', delay: 0.08 }
    );

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    gsap.to(contentRef.current, {
      y: 20,
      opacity: 0,
      scale: 0.98,
      duration: 0.25,
      ease: 'power2.in',
    });
    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/poems/${slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: poem?.title,
          text: poem?.excerpt,
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (!poem) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[200] bg-black/65 backdrop-blur-md flex items-center justify-center p-4 lg:p-6"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="glass-card rounded-[22px] w-full max-w-2xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 glass-card border-b border-sunrise-text/5 p-4 lg:p-5 flex items-center justify-between z-10">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-sunrise-text-secondary hover:text-sunrise-text transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="rounded-full hover:bg-sunrise-bg-secondary w-9 h-9"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full hover:bg-sunrise-bg-secondary w-9 h-9"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 lg:p-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {poem.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] uppercase tracking-wider text-sunrise-text-secondary bg-sunrise-bg px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl lg:text-4xl text-sunrise-text mb-3">
            {poem.title}
          </h1>

          {/* Meta */}
          <p className="text-sunrise-text-secondary text-sm mb-6">
            {new Date(poem.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            · {poem.readTime} read
          </p>

          {/* Image */}
          <div className="aspect-video rounded-[16px] overflow-hidden mb-6">
            <img
              src={poem.image}
              alt={poem.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Poem Content */}
          <div className="prose prose-lg max-w-none">
            <pre className="font-serif text-base lg:text-lg text-sunrise-text whitespace-pre-wrap leading-relaxed bg-transparent p-0 font-medium">
              {poem.content}
            </pre>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-sunrise-text/5 p-4 lg:p-5 flex justify-between items-center">
          {prevPoem ? (
            <button
              onClick={() => onNavigate(prevPoem.slug)}
              className="flex items-center gap-2 text-sunrise-text-secondary hover:text-sunrise-text transition-colors duration-300 text-left"
            >
              <ChevronLeft className="w-4 h-4" />
              <div>
                <span className="text-[10px] block opacity-70">Previous</span>
                <span className="text-sm font-medium">{prevPoem.title}</span>
              </div>
            </button>
          ) : (
            <div />
          )}
          
          {nextPoem ? (
            <button
              onClick={() => onNavigate(nextPoem.slug)}
              className="flex items-center gap-2 text-sunrise-text-secondary hover:text-sunrise-text transition-colors duration-300 text-right"
            >
              <div>
                <span className="text-[10px] block opacity-70">Next</span>
                <span className="text-sm font-medium">{nextPoem.title}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
