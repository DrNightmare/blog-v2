import CustomLink from './CustomLink';

export default function Footer() {
    return (
        <footer className="mt-auto py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-slate-400 text-sm">
                    Designed & Built by <CustomLink href="https://github.com/DrNightmare/blog-v2" target="_blank">Arvind Prakash</CustomLink>
                </p>
            </div>
        </footer>
    );
}
