
import React from 'react';

interface ExperienceCardProps {
    role: string;
    company: string;
    location: string;
    date: string;
    descriptions: (string | { text: string; subItems: string[] })[];
}

export default function ExperienceCard({ role, company, location, date, descriptions }: ExperienceCardProps) {
    return (
        <div className="group relative border-l-2 border-border pl-6 lg:pl-8 pb-2 ml-2 transition-all hover:border-primary/50">
            {/* Timeline dot */}
            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background bg-border transition-colors group-hover:bg-primary" />

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                <h3 className="text-lg font-semibold text-text-main group-hover:text-primary transition-colors">
                    {company}
                </h3>
                <span className="text-sm font-medium text-text-muted tabular-nums">
                    {date}
                </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-4">
                <span className="inline-flex items-center rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary capitalize mb-1 sm:mb-0">
                    {role.toLowerCase()}
                </span>
                <span className="text-sm text-text-muted">
                    {location}
                </span>
            </div>

            <ul className="space-y-2 text-text-secondary leading-relaxed list-disc list-outside ml-4">
                {descriptions.map((desc, index) => (
                    <li key={index} className="pl-1 marker:text-text-muted">
                        {typeof desc === 'string' ? (
                            desc
                        ) : (
                            <>
                                {desc.text}
                                <ul className="list-[circle] list-outside ml-5 mt-1 space-y-1">
                                    {desc.subItems.map((subItem, subIndex) => (
                                        <li key={subIndex} className="pl-1 marker:text-text-muted">
                                            {subItem}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
