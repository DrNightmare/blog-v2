import KnucklebonesContainer from './knucklebones-container';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Knucklebones | Dice Game',
    description: 'A strategic dice game of risk and reward.',
};

export default function KnucklebonesPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto mb-8 text-center">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">KNUCKLEBONES</h1>
                <p className="text-slate-500 dark:text-slate-400">A game of tactical dice placement.</p>
            </div>

            <KnucklebonesContainer />
        </main>
    );
}
