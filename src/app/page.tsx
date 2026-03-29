import Link from "next/link";
import { homeMetadata } from "@/lib/sitePageMetadata";

export const metadata = homeMetadata;

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center font-[family-name:var(--font-geist-sans)] px-4">
      <main className="max-w-3xl w-full text-center sm:text-left space-y-8">

        {/* Hero Section */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground tracking-tight">
            Hi, I'm Arvind.
          </h2>
          <p className="text-xl sm:text-2xl text-text-secondary font-light leading-relaxed max-w-2xl">
            Head of Engineering at <span className="text-primary font-medium">Karya</span>.
            I enjoy solving complex problems, building elegant systems, and exploring the intersection of art and code.
          </p>
        </div>

        {/* Links / CTA */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center sm:justify-start">
          <Link
            href="/essays"
            className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-medium hover:bg-primary-subtle hover:text-primary transition-colors"
          >
            Read Essays
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
          >
            Browse Projects
          </Link>
          <Link
            href="/notes"
            className="px-6 py-3 rounded-xl bg-surface border border-border text-text-secondary font-medium hover:border-primary-light hover:text-primary transition-colors"
          >
            Browse Notes
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-xl text-text-muted hover:text-text-main transition-colors"
          >
            More about me →
          </Link>
        </div>

      </main>
    </div>
  );
}
