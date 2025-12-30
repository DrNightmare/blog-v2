import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center font-[family-name:var(--font-geist-sans)] px-4">
      <main className="max-w-3xl w-full text-center sm:text-left space-y-8">

        {/* Hero Section */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Hi, I'm Arvind.
          </h2>
          <p className="text-xl sm:text-2xl text-slate-600 font-light leading-relaxed max-w-2xl">
            Staff Engineer at <span className="text-indigo-600 font-medium">Refyne</span>.
            I enjoy solving complex problems, building elegant systems, and exploring the intersection of art and code.
          </p>
        </div>

        {/* Links / CTA */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center sm:justify-start">
          <Link
            href="/essays"
            className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            Read Essays
          </Link>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Projects
          </Link>
          <Link
            href="/notes"
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-medium hover:border-indigo-200 hover:text-indigo-600 transition-colors"
          >
            Browse Notes
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-xl text-slate-500 hover:text-slate-800 transition-colors"
          >
            More about me →
          </Link>
        </div>

      </main>
    </div>
  );
}
