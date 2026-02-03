import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

interface NavigationProps {
  onSubscribeClick: () => void;
}

export function Navigation({ onSubscribeClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Poems', href: '#poems' },
    { label: 'Newsletter', href: '#newsletter' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
          ? 'bg-black/35 backdrop-blur-md'
          : 'bg-transparent'
          }`}
      >
        <div className="w-full px-5 lg:px-[6vw] py-4 lg:py-5 flex items-center justify-between">
          {/* Brand */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 text-shadow"
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={onSubscribeClick}
              className="bg-sunrise-accent hover:bg-sunrise-accent/90 text-white rounded-full px-5 py-2 text-sm font-medium transition-all duration-300"
            >
              Subscribe
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[99] bg-black/85 backdrop-blur-lg transition-all duration-300 lg:hidden ${isMobileMenuOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className="font-serif text-2xl text-white hover:text-sunrise-accent transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
          <Button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onSubscribeClick();
            }}
            className="mt-3 bg-sunrise-accent hover:bg-sunrise-accent/90 text-white rounded-full px-7 py-5 text-base font-medium"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </>
  );
}
