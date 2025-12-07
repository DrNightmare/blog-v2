import { MDXRemote } from "next-mdx-remote/rsc";
import { getNotes } from "../utils";
import CustomLink from "@/components/CustomLink";

const components = {
    a: (props: any) => (
        <CustomLink {...props}>
            {props.children}
        </CustomLink>
    )
};

export default function Notes() {
    const notes = getNotes();

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <main className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Notes
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        A collection of initial thoughts, brainstorming, and in-progress learnings.
                        <span className="ml-2 inline-flex items-center justify-center bg-primary-light text-primary text-xs font-bold px-2 py-1 rounded-full">
                            {notes.length}
                        </span>
                    </p>
                </div>

                <div className="space-y-8">
                    {notes.slice().reverse().map((note) => (
                        <div key={note.slug} className="bg-surface rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-foreground">{note.metadata.title}</h2>
                                <time className="text-sm text-text-subtle font-medium bg-border-light px-3 py-1 rounded-full dark:bg-slate-800 dark:text-slate-400">
                                    {note.metadata.date}
                                </time>
                            </div>
                            <article className="prose prose-slate prose-lg max-w-none prose-a:text-primary prose-a:no-underline hover:prose-a:underline dark:prose-invert">
                                <MDXRemote source={note.content} components={components} />
                            </article>
                        </div>
                    ))}
                </div>
            </main >
        </div >
    );
}
