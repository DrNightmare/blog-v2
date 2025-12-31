'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import ThemeToggle from './ThemeToggle';
import ColorSchemeSelector from './ColorSchemeSelector';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-surface/70 border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between h-16">
          {/* Logo / Name */}
          <div className="flex-shrink-0 z-50">
            <Link href="/" className="font-bold text-xl tracking-tight text-text-main hover:text-primary transition-colors">
              Arvind Prakash
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-8">
            <div className="flex space-x-8">
              <NavLink href="/essays" activePath={pathname}>Essays</NavLink>
              <NavLink href="/notes" activePath={pathname}>Notes</NavLink>
              <NavLink href="/projects" activePath={pathname}>Projects</NavLink>
              <NavLink href="/library" activePath={pathname}>Library</NavLink>
              <NavLink href="/about" activePath={pathname}>About</NavLink>
            </div>
            <div className="flex items-center gap-2 pl-6 border-l border-border/50">
              <ColorSchemeSelector />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden z-50">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-secondary hover:text-primary p-2"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>

          {/* Mobile Overlay */}
          <div
            className={`fixed inset-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg transition-transform duration-300 ease-in-out sm:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            style={{ top: '0', height: '100dvh' }}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 p-4">
              <nav className="flex flex-col items-center space-y-6 text-lg">
                <MobileNavLink href="/essays" activePath={pathname}>Essays</MobileNavLink>
                <MobileNavLink href="/notes" activePath={pathname}>Notes</MobileNavLink>
                <MobileNavLink href="/projects" activePath={pathname}>Projects</MobileNavLink>
                <MobileNavLink href="/library" activePath={pathname}>Library</MobileNavLink>
                <MobileNavLink href="/about" activePath={pathname}>About</MobileNavLink>
              </nav>

              <div className="flex items-center gap-4 pt-8 border-t border-border/50 w-full justify-center">
                <ColorSchemeSelector />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children, activePath }: { href: string; children: React.ReactNode; activePath: string }) {
  const isActive = activePath.startsWith(href);

  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${isActive
        ? 'text-primary font-semibold'
        : 'text-text-secondary hover:text-primary'
        }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, activePath }: { href: string; children: React.ReactNode; activePath: string }) {
  const isActive = activePath.startsWith(href);

  return (
    <Link
      href={href}
      className={`text-xl font-medium transition-colors ${isActive
        ? 'text-primary font-semibold'
        : 'text-text-secondary hover:text-primary'
        }`}
    >
      {children}
    </Link>
  );
}
