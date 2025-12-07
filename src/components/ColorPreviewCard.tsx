import { ColorScheme } from '@/config/colorSchemes';

interface ColorPreviewCardProps {
    scheme: ColorScheme;
}

export default function ColorPreviewCard({ scheme }: ColorPreviewCardProps) {
    return (
        <div
            className="w-full p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm"
            style={{
                // @ts-ignore
                '--preview-primary': scheme.colors.primary,
                '--preview-primary-light': scheme.colors.primaryLight,
            } as React.CSSProperties}
        >
            <div className="space-y-2">
                <h3
                    className="text-sm font-bold"
                    style={{ color: 'var(--preview-primary)' }}
                >
                    Sample Heading
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                    This is how your content will look with this color scheme.
                </p>
                <div className="flex items-center gap-2">
                    <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                            backgroundColor: 'var(--preview-primary-light)',
                            color: 'var(--preview-primary)'
                        }}
                    >
                        2024-12-07
                    </span>
                    <a
                        href="#"
                        className="text-xs font-medium"
                        style={{ color: 'var(--preview-primary)' }}
                        onClick={(e) => e.preventDefault()}
                    >
                        Sample Link →
                    </a>
                </div>
            </div>
        </div>
    );
}
