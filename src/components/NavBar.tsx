'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ThemeToggle from './ThemeToggle';
import ColorSchemeSelector from './ColorSchemeSelector';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-surface/70 border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-4 sm:py-0 gap-4 sm:gap-0">
          {/* Logo / Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl tracking-tight text-text-main hover:text-primary transition-colors">
              Arvind Prakash
            </Link>
          </div>

          {/* Navigation Links & Toggle */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <div className="flex space-x-6 sm:space-x-8">
              <NavLink href="/essays" activePath={pathname}>Essays</NavLink>
              <NavLink href="/notes" activePath={pathname}>Notes</NavLink>
              <NavLink href="/library" activePath={pathname}>Library</NavLink>
              <NavLink href="/about" activePath={pathname}>About</NavLink>
            </div>
            <div className="flex items-center gap-2 pl-6 border-l border-border/50">
              <ColorSchemeSelector />
              <ThemeToggle />
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
