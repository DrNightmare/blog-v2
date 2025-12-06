import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-200/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-4 sm:py-0">
          {/* Logo / Name */}
          <div className="flex-shrink-0 mb-4 sm:mb-0">
            <Link href="/" className="font-bold text-xl tracking-tight text-slate-800 hover:text-indigo-600 transition-colors">
              Arvind Prakash
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-6 sm:space-x-8">
            <NavLink href="/essays">Essays</NavLink>
            <NavLink href="/notes">Notes</NavLink>
            <NavLink href="/library">Library</NavLink>
            <NavLink href="/activities">Activities</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
    >
      {children}
    </Link>
  );
}
