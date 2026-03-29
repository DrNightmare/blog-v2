import Link from "next/link";
import type { SitemapNode } from "@/app/utils";

const rowBaseClass =
    "flex items-center gap-2 rounded-lg px-2 -mx-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

const linkClass =
    `${rowBaseClass} py-1.5 text-sm text-foreground transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800/80`;

const summaryClass =
    `${rowBaseClass} py-1.5 cursor-pointer list-none text-sm text-foreground transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800/80 marker:content-none [&::-webkit-details-marker]:hidden`;

function SitemapTreeNode({ node }: { node: SitemapNode }) {
    const hasChildren = node.children && node.children.length > 0;

    if (!hasChildren) {
        if (!node.url) return null;
        return (
            <li>
                <Link href={node.url} className={linkClass}>
                    {/* Keep leaf rows aligned with branch rows that have a caret. */}
                    <span className="inline-block w-[0.85rem] opacity-0" aria-hidden>
                        ▸
                    </span>
                    <span>{node.title}</span>
                </Link>
            </li>
        );
    }

    return (
        <li>
            <details className="group">
                <summary className={summaryClass}>
                    <span className="inline-block text-text-muted transition-transform duration-200 group-open:rotate-90" aria-hidden>
                        ▸
                    </span>
                    {node.title}
                </summary>
                <ul className="ml-1 mt-1 space-y-1 border-l border-border/60 pl-4">
                    {node.children!.map((child, idx) => (
                        <SitemapTreeNode
                            key={`${child.url ?? child.title}-${idx}`}
                            node={child}
                        />
                    ))}
                </ul>
            </details>
        </li>
    );
}

type Props = {
    root: SitemapNode;
};

export default function SitemapTree({ root }: Props) {
    const sections = root.children ?? [];

    return (
        <nav aria-label="Site structure" className="w-full">
            <ul className="space-y-2">
                {root.url ? (
                    <li>
                        <Link href={root.url} className={linkClass}>
                            <span className="inline-block w-[0.85rem] opacity-0" aria-hidden>
                                ▸
                            </span>
                            <span>{root.title}</span>
                        </Link>
                    </li>
                ) : null}
                {sections.map((node, idx) => (
                    <SitemapTreeNode
                        key={`${node.url ?? node.title}-${idx}`}
                        node={node}
                    />
                ))}
            </ul>
        </nav>
    );
}
