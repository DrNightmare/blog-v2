import AboutContent from '@/app/about/content.mdx';

export default function About() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <main className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            About Me
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <article className="prose prose-slate prose-lg max-w-none prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline">
            <AboutContent />
          </article>
        </div>
      </main>
    </div>
  );
}
