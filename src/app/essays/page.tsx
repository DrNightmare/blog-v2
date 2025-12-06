import Link from "next/link";
import { getEssays } from "../utils";

export default function Essays() {
    const essays = getEssays().sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <main className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Essays
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Long form writing on topics I'm passionate about.
                        <span className="ml-2 inline-flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                            {essays.length}
                        </span>
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {essays.map((essay) => (
                        <Link key={essay.slug} href={`/essays/${essay.slug}`} className="group relative flex flex-col p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200">
                            <div className="mb-2">
                                <time className="text-sm text-slate-400 font-medium">
                                    {essay.metadata.date}
                                </time>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                {essay.metadata.title}
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-4 flex-grow">
                                {essay.metadata.summary}
                            </p>
                            <div className="mt-auto pt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200">
                                Read more →
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
