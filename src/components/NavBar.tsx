import Link from "next/link";
import NavBarClient from "./NavBarClient";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-surface/70 border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between h-16">
          <div className="flex-shrink-0 z-50">
            <Link
              href="/"
              className="font-bold text-xl tracking-tight text-text-main hover:text-primary transition-colors"
            >
              Arvind Prakash
            </Link>
          </div>
          <NavBarClient />
        </div>
      </div>
    </nav>
  );
}
