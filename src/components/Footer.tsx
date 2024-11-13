import CustomLink from './CustomLink';

export default function Footer() {
    return (
        <footer className="mt-auto">
            <hr className="mt-5" />
            <div className="flex justify-center p-8 pb-20 sm:p-10">
                <span>Made with NextJS and Tailwind.  <CustomLink href="https://github.com/DrNightmare/blog-v2" target="_blank">Link to Github repo</CustomLink></span>
            </div>
        </footer>
    );
}
