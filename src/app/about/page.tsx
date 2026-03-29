import AboutContent from '@/content/about.mdx';
import { listPageMetadata } from '@/lib/sitePageMetadata';

export const metadata = listPageMetadata({
  title: 'About',
  description: 'Background, interests, and how to get in touch.',
  path: '/about',
});

export default function About() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <main className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            About Me
          </h1>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
          <article className="prose prose-slate prose-lg max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline dark:prose-invert">
            <AboutContent />
          </article>
        </div>
      </main>
    </div>
  );
}
