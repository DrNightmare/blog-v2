import { notFound } from "next/navigation";
import { getEssays } from "../../utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import CustomLink from "@/components/CustomLink";
import Pre from "@/components/CustomPre";
import { highlight } from "sugar-high";
import { JSX, ReactNode } from "react";

type EssayParam = {
    slug: string;
};

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
    children?: ReactNode;
}

const essays = getEssays();

export async function generateStaticParams(): Promise<EssayParam[]> {
    return essays.map(essay => ({ slug: essay.slug }));
}

function Code({ children, ...props }: CodeProps) {
    const codeHTML = highlight(children as string)
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

const components = {
    a: (props: any) => (
        <CustomLink {...props}>
            {props.children}
        </CustomLink>
    ),
    pre: Pre,
    code: Code,
};

export default async function Essay({ params }: { params: Promise<EssayParam> }) {
    const { slug } = await params;
    const essay = essays.find(essay => essay.slug === slug);
    if (!essay) {
        return notFound();
    }

    return (
        <div className="flex justify-center m-5">
            <div className="flex-col">
                <article className="prose dark:prose-invert">
                    <div className="justify-self-center">
                        <h1>{essay.metadata.title}</h1>
                    </div>
                    <MDXRemote source={essay.content} components={components} />
                </article>
            </div>
        </div>
    );
}