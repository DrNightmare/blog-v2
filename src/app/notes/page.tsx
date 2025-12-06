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
        <div>
            <main className="flex gap-8 items-center justify-center sm:items-start">
                <div className="flex flex-col prose px-4 sm:px-0">
                    <span className="text-3xl text-center">Notes <span className="text-sea-blue text-2xl">{notes.length}</span></span>
                    <span className="mb-6 text-center">A collection of initial thoughts, brainstorming, and in-progress learnings.</span>
                    {notes.slice().reverse().map((note, index) => (
                        <div className="not-prose my-2" key={note.slug}>
                            <div className="mb-5">
                                <p className="text-lg font-medium text-crimson">{note.metadata.title}</p>
                                <span className="text-sm font-thin text-gray-600">{note.metadata.date}</span>
                                <article className="prose"><MDXRemote source={note.content} components={components} /></article>
                            </div>
                            {index < notes.length - 1 && <hr />}
                        </div>
                    )
                    )}
                </div>
            </main >
        </div >
    );
}
