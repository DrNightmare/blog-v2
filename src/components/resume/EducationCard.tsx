
import React from 'react';

interface EducationCardProps {
    institution: string;
    degree: string;
    date: string;
    location: string;
}

export default function EducationCard({ institution, degree, date, location }: EducationCardProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-4 rounded-lg bg-surface/50 hover:bg-surface transition-colors">
            <div>
                <h3 className="text-lg font-semibold text-text-main">
                    {institution}
                </h3>
                <p className="text-text-secondary mt-1">
                    {degree}
                </p>
            </div>
            <div className="flex flex-col sm:items-end mt-2 sm:mt-0 gap-1">
                <span className="text-sm font-medium text-text-muted tabular-nums">
                    {date}
                </span>
                <span className="text-sm text-text-muted hidden sm:inline">
                    {location}
                </span>
                <span className="text-sm text-text-muted sm:hidden">
                    {location}
                </span>
            </div>
        </div>
    );
}
