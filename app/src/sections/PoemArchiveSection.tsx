import { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { poems, allTags } from '@/data/poems';

gsap.registerPlugin(ScrollTrigger);

// Check if user prefers reduced motion
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface PoemArchiveSectionProps {
  onPoemClick: (slug: string) => void;
}

export function PoemArchiveSection({ onPoemClick }: PoemArchiveSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [visibleCount, setVisibleCount] = useState(4);

  const filteredPoems = poems.filter((poem) => {
    const matchesSearch = poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         poem.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || poem.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const visiblePoems = filteredPoems.slice(0, visibleCount);
  const hasMore = filteredPoems.length > visibleCount;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Header reveal - gentler
      gsap.fromTo(
        headerRef.current,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            end: 'top 65%',
            scrub: 0.6,
          },
        }
      );

      // Cards staggered reveal - gentler
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 70%',
              scrub: 0.6,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [visiblePoems]);

  return (
    <section
      ref={sectionRef}
      id="archive"
      className="relative z-[60] py-16 lg:py-24"
    >
      {/* Background overlay for this section */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/50 to-black/45 pointer-events-none" />
      
      <div className="relative px-6 lg:px-[10vw] max-w-[1400px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h2
            className="font-serif text-white mb-5 text-shadow-strong"
            style={{ fontSize: 'clamp(28px, 3.5vw, 52px)', lineHeight: 1.1 }}
          >
            Poem Archive
          </h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sunrise-text-secondary" />
              <Input
                type="text"
                placeholder="Search poems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-white/95 border-sunrise-text/10 rounded-full py-4 text-sm"
              />
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                    selectedTag === tag
                      ? 'bg-sunrise-accent text-white'
                      : 'bg-white/90 text-sunrise-text-secondary hover:bg-sunrise-accent/10'
                  }`}
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Poem List */}
        <div className="space-y-3">
          {visiblePoems.map((poem, index) => (
            <div
              key={poem.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              onClick={() => onPoemClick(poem.slug)}
              className="group cursor-pointer glass-card rounded-[16px] p-3.5 lg:p-5 flex flex-col lg:flex-row gap-3 lg:gap-5 items-start lg:items-center hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Thumbnail */}
              <div className="w-full lg:w-20 h-24 lg:h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={poem.image}
                  alt={poem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {poem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] uppercase tracking-wider text-sunrise-text-secondary bg-sunrise-bg px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-serif text-lg lg:text-xl text-sunrise-text mb-1 group-hover:text-sunrise-accent transition-colors duration-300">
                  {poem.title}
                </h3>
                <p className="text-sunrise-text-secondary text-sm line-clamp-2">
                  {poem.excerpt}
                </p>
              </div>
              
              {/* Meta */}
              <div className="flex items-center gap-3 text-sunrise-text-secondary text-xs lg:text-sm">
                <span>{new Date(poem.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span>{poem.readTime}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="px-7 py-2.5 bg-white/90 text-sunrise-text font-medium rounded-full hover:bg-sunrise-accent hover:text-white transition-all duration-300 text-sm"
            >
              Load more poems
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredPoems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70">No poems found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  );
}
