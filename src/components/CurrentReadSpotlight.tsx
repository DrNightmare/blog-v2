import Image from 'next/image';

type CurrentReadProps = {
    title: string;
    author: string;
    coverUrl?: string;
    openLibraryUrl?: string;
};

export default function CurrentReadSpotlight({ title, author, coverUrl, openLibraryUrl }: CurrentReadProps) {
    const titleNode = openLibraryUrl ? (
        <a
            href={openLibraryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
        >
            {title}
        </a>
    ) : (
        title
    );

    return (
        <div className="relative w-full mb-8 sm:mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl sm:rounded-2xl blur-xl animate-pulse" />

            <div className="relative bg-surface/80 backdrop-blur-sm border-2 border-primary/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg overflow-hidden">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer"
                    style={{
                        backgroundSize: '200% 100%',
                    }}
                />

                <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center">
                    {coverUrl ? (
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                            <Image
                                src={coverUrl}
                                alt={`${title} cover`}
                                width={96}
                                height={144}
                                priority
                                className="rounded-lg shadow-md border border-border object-cover w-[72px] h-[108px] sm:w-24 sm:h-36"
                                sizes="96px"
                            />
                        </div>
                    ) : null}

                    <div className="space-y-4 flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <div className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-primary"></span>
                            </div>
                            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-primary">
                                Currently Reading
                            </span>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
                                {titleNode}
                            </h3>
                            <p className="text-sm sm:text-base text-text-secondary">
                                by {author}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
