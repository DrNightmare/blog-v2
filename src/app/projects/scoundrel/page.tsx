import ScoundrelContainer from './scoundrel-container';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Scoundrel | Card Dungeon',
    description: 'A solitaire dungeon crawler card game.',
};

export default function ScoundrelPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto mb-8 text-center">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">SCOUNDREL</h1>
                <p className="text-slate-500 dark:text-slate-400">A minimal dungeon crawler.</p>
            </div>

            <ScoundrelContainer />
        </main>
    );
}
