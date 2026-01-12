import { Metadata } from 'next';
import HolidayOptimizerContainer from './holiday-optimizer-container';

export const metadata: Metadata = {
    title: "Annual Leave Spacer",
    description: "Optimize your holidays with smart spacing to maximize vacation quality."
};

export default function HolidayOptimizerPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
            <HolidayOptimizerContainer />
        </div>
    );
}
