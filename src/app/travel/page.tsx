import { Metadata } from 'next';
import TravelMap from '@/components/TravelMap';
import { TRAVEL_LOCATIONS } from '@/data/travel-locations';

export const metadata: Metadata = {
    title: "Travel | Arvind Prakash",
    description: "A map of places I've visited.",
};

export default function TravelPage() {
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

                <TravelMap locations={TRAVEL_LOCATIONS} />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Stats or list view could go here later */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                        <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                            {TRAVEL_LOCATIONS.length}
                        </div>
                        <div className="text-xs uppercase tracking-wider font-bold text-slate-500">
                            Cities Visited
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
