'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-surface/70 border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-4 sm:py-0">
          {/* Logo / Name */}
          <div className="flex-shrink-0 mb-4 sm:mb-0">
            <Link href="/" className="font-bold text-xl tracking-tight text-text-main hover:text-primary transition-colors">
              Arvind Prakash
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 sm:space-x-8">
            <NavLink href="/essays" activePath={pathname}>Essays</NavLink>
            <NavLink href="/notes" activePath={pathname}>Notes</NavLink>
            <NavLink href="/library" activePath={pathname}>Library</NavLink>
            <NavLink href="/activities" activePath={pathname}>Activities</NavLink>
            <NavLink href="/about" activePath={pathname}>About</NavLink>
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
