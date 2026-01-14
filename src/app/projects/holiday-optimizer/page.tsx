import { Metadata } from 'next';
import VacationPlannerContainer from './vacation-planner-container';

export const metadata: Metadata = {
    title: "Vacation Planner",
    description: "Optimize your holidays with smart spacing to maximize vacation quality."
};

export default function VacationPlannerPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
            <VacationPlannerContainer />
        </div>
    );
}
