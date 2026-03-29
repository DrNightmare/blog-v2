import Image from 'next/image';
import booksData from './data.json';
import CurrentReadSpotlight from '@/components/CurrentReadSpotlight';
import LibraryJsonLd from '@/components/LibraryJsonLd';
import { listPageMetadata } from '@/lib/sitePageMetadata';

export const metadata = listPageMetadata({
  title: 'Library',
  description: 'Reading list and books by genre.',
  path: '/library',
});

type Book = {
    title: string;
    author: string;
    genre?: string;
    progressPercentage?: number;
    currentlyReading?: boolean;
    coverUrl?: string;
    openLibraryUrl?: string;
    series?: { name: string; volume: number };
};

/** Stable React key; title+author is unique in this list. */
function bookKey(book: Book): string {
    return `${book.title}|${book.author}`;
}

// Type assertion for imported JSON
const books: Book[] = booksData as Book[];

const groupByGenre = (books: Book[]) => {
    const genres: Record<string, Book[]> = {};

    books.forEach(book => {
        const genre = book.genre || 'Uncategorized';
        if (!genres[genre]) {
            genres[genre] = [];
        }
        genres[genre].push(book);
    });

    return genres;
};

const booksByGenre = groupByGenre(books);
const currentRead = books.find(book => book.currentlyReading);

export default function Library() {
    const libraryJsonLdItems = books.map((book, i) => ({
        title: book.title,
        author: book.author,
        position: i + 1,
        ...(book.openLibraryUrl ? { url: book.openLibraryUrl } : {}),
    }));

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <LibraryJsonLd items={libraryJsonLdItems} />
            <main className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Library
                    </h1>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Books I own, both digital and physical.
                        <span className="ml-2 inline-flex items-center justify-center bg-primary-light text-primary text-xs font-bold px-2 py-1 rounded-full">
                            {books.length}
                        </span>
                    </p>
                </div>

                {currentRead && (
                    <CurrentReadSpotlight
                        title={currentRead.title}
                        author={currentRead.author}
                        coverUrl={currentRead.coverUrl}
                        openLibraryUrl={currentRead.openLibraryUrl}
                    />
                )}

                <div className="space-y-12">
                    {Object.entries(booksByGenre).map(([genre, genreBooks]) => (
                        <BookList key={genre} title={genre} books={genreBooks} />
                    ))}
                </div>
            </main>
        </div>
    );
}

const BookList = ({ title, books }: { title: string; books: Book[] }) => (
    <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <span className="text-xs font-bold bg-primary-light text-primary px-2 py-1 rounded-full">
                {books.length}
            </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
                    {books.map((book) => (
                <div
                    key={bookKey(book)}
                    className="flex gap-3 p-4 rounded-xl bg-surface hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {book.coverUrl ? (
                        <div className="flex-shrink-0 w-16 sm:w-[72px]">
                            <Image
                                src={book.coverUrl}
                                alt={`${book.title} cover`}
                                width={72}
                                height={108}
                                loading={book.currentlyReading ? 'eager' : 'lazy'}
                                className="rounded-md border border-border object-cover w-16 h-24 sm:w-[72px] sm:h-[108px]"
                                sizes="72px"
                            />
                        </div>
                    ) : null}
                    <div className="min-w-0 flex-1 flex flex-col">
                        <p className="font-semibold text-foreground mb-1">
                            {book.openLibraryUrl ? (
                                <a
                                    href={book.openLibraryUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    {book.title}
                                </a>
                            ) : (
                                book.title
                            )}
                        </p>
                        <p className="text-sm text-text-secondary">{book.author}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
