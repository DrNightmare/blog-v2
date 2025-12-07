
import React from 'react';

interface SectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export default function Section({ title, children, className = '' }: SectionProps) {
    return (
        <section className={`mb-12 ${className}`}>
            <h2 className="text-xl font-bold uppercase tracking-wider text-text-main mb-6 border-b border-border pb-2">
                {title}
            </h2>
            <div className="space-y-6">
                {children}
            </div>
        </section>
    );
}
