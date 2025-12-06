import { promises as fs } from 'fs';
import path from 'path';

type Book = {
    index: number;
    title: string;
    author: string;
    genre?: string;
    progressPercentage?: number;
};

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

export default async function Library() {
    const file = await fs.readFile(path.join(process.cwd(), 'src', 'app', 'library', 'data.json'), 'utf8');
    const books: Book[] = JSON.parse(file);
    const booksByGenre = groupByGenre(books);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6">
            <main className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Library
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Books I own, both digital and physical.
                        <span className="ml-2 inline-flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                            {books.length}
                        </span>
                    </p>
                </div>

                <div className="space-y-12">
                    {Object.entries(booksByGenre).map(([genre, books]) => (
                        <BookList key={genre} title={genre} books={books} />
                    ))}
                </div>
            </main>
        </div>
    );
}

const BookList = ({ title, books }: { title: string; books: Book[] }) => (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {books.length}
            </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
            {books.map((book) => (
                <div key={book.index} className="flex flex-col p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/30 transition-colors">
                    <p className="font-semibold text-slate-900 mb-1">
                        {book.title}
                    </p>
                    <p className="text-sm text-slate-500 mb-2">{book.author}</p>
                    {book.progressPercentage !== undefined && (
                        <div className="mt-auto">
                            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1">
                                <div
                                    className="bg-indigo-500 h-1.5 rounded-full"
                                    style={{ width: `${book.progressPercentage}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-400 text-right">{book.progressPercentage}%</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);
