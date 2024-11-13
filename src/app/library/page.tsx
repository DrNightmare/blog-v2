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

const BookList = ({ title, books }: { title: string; books: Book[] }) => (
    <div className="mt-4">
        <p className="text-xl font-semibold mb-2">{title} <span className="text-sea-blue text-xl font-normal">{books.length}</span></p>
        {books.map((book, index) => (
            <div className="not-prose my-2" key={book.index}>
                <div className="mb-2">
                    <p className="text-lg font-medium text-crimson">
                        {book.title} - <span className="text-sm text-gray-600">{book.author}</span>
                    </p>
                    {book.progressPercentage && book.progressPercentage < 100 && (
                        <p className="text-md font-thin text-gray-600">Progress: {book.progressPercentage}%</p>
                    )}
                </div>
                {index < books.length - 1 && <hr />}
            </div>
        ))}
    </div>
);

export default async function Library() {
    const file = await fs.readFile(path.join(process.cwd(), 'src', 'app', 'library', 'data.json'), 'utf8');
    const books: Book[] = JSON.parse(file);
    const booksByGenre = groupByGenre(books);

    return (
        <div>
            <main className="flex gap-8 items-center justify-center sm:items-start">
                <div className="flex flex-col prose">
                    <span className="text-3xl text-center">
                        Books <span className="text-sea-blue text-2xl">{books.length}</span>
                    </span>
                    <span className="mb-6 text-center">Books I own, both digital and physical.</span>

                    {Object.entries(booksByGenre).map(([genre, books]) => (
                        <BookList key={genre} title={genre} books={books} />
                    ))}
                </div>
            </main >
        </div >
    );
}
