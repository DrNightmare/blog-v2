import Link from "next/link";
import { getEssays } from "../utils";

export default function Essays() {
    const essays = getEssays().sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());

    return (
        <div>
            <main className="flex gap-8 items-center justify-center sm:items-start">
                <div className="flex flex-col prose">
                    <span className="text-3xl text-center">
                        Essays <span className="text-sea-blue text-2xl">{essays.length}</span>
                    </span>
                    <span className="mb-6 text-center">Long form writing on topics I'm passionate about.</span>
                    {essays.map((essay, index) => (
                        <div className="not-prose my-2" key={essay.slug}>
                            <Link className="not-prose" href={`/essays/${essay.slug}`}>
                                <div className="group cursor-pointer mb-2">
                                    <p className="text-lg font-medium group-hover:text-crimson group-hover:font-bold">
                                        {essay.metadata.title}
                                    </p>
                                    <span className="text-sm font-thin text-gray-600">{essay.metadata.date}</span>
                                    <p className="text-md font-thin text-gray-600">{essay.metadata.summary}</p>
                                </div>
                            </Link>
                            {index < essays.length - 1 && <hr />}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
