import { Metadata } from 'next';
import { TRAVEL_LOCATIONS, TRAVEL_ROUTES, TRAVEL_ACTIVITIES } from '@/data/travel-locations';
import TravelMap from '@/components/TravelMapLazy';

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

                <TravelMap
                    locations={TRAVEL_LOCATIONS}
                    routes={TRAVEL_ROUTES}
                    activities={TRAVEL_ACTIVITIES}
                />
            </main>
        </div>
    );
}
