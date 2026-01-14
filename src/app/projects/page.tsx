import Link from "next/link";
import { getProjects } from "../utils";

export default async function Projects() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <main className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Projects
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Interactive experiments, games, and tools.
                        <span className="ml-2 inline-flex items-center justify-center bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-1 rounded-full dark:bg-indigo-900/30 dark:text-indigo-400">
                            {projects.length}
                        </span>
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {projects.map((project: any) => {
                        const isExternal = !!project.externalUrl;
                        return (
                            <Link
                                key={project.slug}
                                href={project.externalUrl || `/projects/${project.slug}`}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="group relative flex flex-col p-6 bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <time className="text-sm text-text-subtle font-medium bg-border-light px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-400">
                                        {project.date}
                                    </time>
                                    <div className="flex items-center gap-2">
                                        {isExternal && (
                                            <span className="text-text-muted group-hover:text-foreground transition-colors">
                                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </span>
                                        )}
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">
                                            {project.type}
                                        </span>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-indigo-600 transition-colors">
                                    {project.title}
                                </h2>
                                <p className="text-text-secondary leading-relaxed mb-4 flex-grow">
                                    {project.summary}
                                </p>
                                <div className="mt-auto pt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 duration-200">
                                    {isExternal ? "View Source code →" : "Launch Project →"}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
