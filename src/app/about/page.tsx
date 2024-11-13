import AboutContent from '@/app/about/content.mdx';

export default function About() {
  return (
    <div>
      <main className="flex gap-8 items-center justify-center sm:items-start">
          <article className="prose">
            <AboutContent />
          </article>
      </main>
    </div>
  );
}
