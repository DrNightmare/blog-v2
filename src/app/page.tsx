import CustomLink from "@/components/CustomLink";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-full font-[family-name:var(--font-geist-sans)]">
      <main className="flex gap-8 items-center justify-center sm:items-start">
        <div className="flex flex-col prose px-4 sm:px-0">
          <span className="text-3xl text-center">Arvind Prakash</span>
          <span className="mb-6 text-center">Currently a senior backend engineer at <CustomLink href='https://www.refyne.co.in/' target='_blank'>Refyne</CustomLink></span>

          <span>
            Check out my <CustomLink href='/essays' target={undefined}>essays</CustomLink>. These are mostly technical posts, but expect anything ;)
          </span>
          <br />
          <span>
            I also maintain a list of <CustomLink href='/notes' target={undefined}>notes</CustomLink> here. These are things that I might have thought about but didn't bother to dig deep into, and probably things that I intend to write about in the future.
          </span>
          <br />
          <span>
            If you would like to know more about me and my interests, check out my <CustomLink href='/about' target={undefined}>about page</CustomLink>.
          </span>
        </div>
      </main>
    </div>
  );
}
