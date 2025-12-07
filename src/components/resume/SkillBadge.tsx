
import React from 'react';

interface SkillBadgeProps {
    children: React.ReactNode;
}

export default function SkillBadge({ children }: SkillBadgeProps) {
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-surface text-text-main mr-2 mb-2 transition-colors border border-border/50 hover:bg-surface/80 hover:border-primary/30">
            {children}
        </span>
    );
}
