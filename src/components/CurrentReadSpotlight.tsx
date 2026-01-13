'use client';

type CurrentReadProps = {
    title: string;
    author: string;
};

export default function CurrentReadSpotlight({ title, author }: CurrentReadProps) {
    return (
        <div className="relative w-full mb-8 sm:mb-12">
            {/* Pulsing Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl sm:rounded-2xl blur-xl animate-pulse" />

            {/* Main Card */}
            <div className="relative bg-surface/80 backdrop-blur-sm border-2 border-primary/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg overflow-hidden">
                {/* Animated Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer"
                    style={{
                        backgroundSize: '200% 100%',
                    }}
                />

                <div className="relative z-10 space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-primary"></span>
                        </div>
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-primary">
                            Currently Reading
                        </span>
                    </div>

                    {/* Book Info */}
                    <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                            {title}
                        </h3>
                        <p className="text-sm sm:text-base text-text-secondary">
                            by {author}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
