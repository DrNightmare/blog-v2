import Link from "next/link";

export default function Projects() {
    const projects = [
        {
            slug: "scoundrel",
            title: "Scoundrel",
            summary: "A solitaire card dungeon crawler. Navigate the room, equip weapons, and slay monsters to clear the deck.",
            date: "Dec 30, 2024",
            type: "Game"
        }
    ];

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
                    {projects.map((project) => (
                        <Link
                            key={project.slug}
                            href={`/projects/${project.slug}`}
                            className="group relative flex flex-col p-6 bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <time className="text-sm text-text-subtle font-medium bg-border-light px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-400">
                                    {project.date}
                                </time>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">
                                    {project.type}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-indigo-600 transition-colors">
                                {project.title}
                            </h2>
                            <p className="text-text-secondary leading-relaxed mb-4 flex-grow">
                                {project.summary}
                            </p>
                            <div className="mt-auto pt-4 flex items-center text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 duration-200">
                                Launch Project →
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
