import { Metadata } from 'next';
import Link from 'next/link';
import { TRAVEL_LOCATIONS, TRAVEL_ROUTES, TRAVEL_ACTIVITIES } from '@/data/travel-locations';
import TravelMap from '@/components/TravelMapLazy';
import { getNoteListPageForSlug } from '@/app/utils';

export const metadata: Metadata = {
    title: "Travel | Arvind Prakash",
    description: "A map of places I've visited.",
};

const RELATED_NOTES = [
    { slug: 'note3' as const, title: 'Travel tracking', blurb: 'Where the idea of mapping visits started.' },
    { slug: 'note5' as const, title: 'Kenya', blurb: 'Trip write-up; Nairobi and the Mara on the map.' },
];

export default async function TravelPage() {
    const pages = await Promise.all(
        RELATED_NOTES.map((n) => getNoteListPageForSlug(n.slug))
    );

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <main className="max-w-6xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        Travel Log
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Collecting memories, one city at a time.
                    </p>
                </div>

                <TravelMap
                    locations={TRAVEL_LOCATIONS}
                    routes={TRAVEL_ROUTES}
                    activities={TRAVEL_ACTIVITIES}
                />

                <aside className="max-w-2xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/50 px-4 py-4 sm:px-5 sm:py-4 text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                        Related notes
                    </p>
                    <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                        {RELATED_NOTES.map((note, i) => (
                            <li key={note.slug}>
                                <Link
                                    href={`/notes?page=${pages[i]}#${note.slug}`}
                                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                                >
                                    {note.title}
                                </Link>
                                <span className="text-slate-500 dark:text-slate-400"> — {note.blurb}</span>
                            </li>
                        ))}
                    </ul>
                </aside>
            </main>
        </div>
    );
}
