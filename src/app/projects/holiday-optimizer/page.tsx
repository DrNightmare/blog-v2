import { Metadata } from 'next';
import HolidayOptimizerContainer from './holiday-optimizer-container';

export const metadata: Metadata = {
    title: 'Long Weekend Planner | Holiday Optimizer',
    description: 'Maximize your long weekends by strategically planning leave around holidays and weekends.',
};

export default function HolidayOptimizerPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto mb-8 text-center">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    LONG WEEKEND PLANNER
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Get more long weekends with smarter leave planning
                </p>
            </div>

            <HolidayOptimizerContainer />
        </main>
    );
}
