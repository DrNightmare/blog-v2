import { getNotes } from "../utils";

export default function Notes() {
    const notes = getNotes();

    return (
        <div>
            <main className="flex gap-8 items-center justify-center sm:items-start">
                <div className="flex flex-col prose">
                    <span className="text-3xl text-center">Notes <span className="text-sea-blue text-2xl">{notes.length}</span></span>
                    <span className="mb-6 text-center">A collection of initial thoughts, brainstorming, and in-progress learnings.</span>
                    {notes.map((note, index) => (
                        <div className="not-prose my-2" key={note.slug}>
                            <div className="mb-2">
                                <p className="text-lg font-medium text-crimson">{note.metadata.title}</p>
                                <span className="text-sm font-thin text-gray-600">{note.metadata.date}</span>
                                <p className="text-md font-thin text-gray-600">{note.content}</p>
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