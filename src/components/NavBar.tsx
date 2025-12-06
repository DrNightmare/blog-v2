import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="flex flex-col items-center p-4 sm:flex-row sm:justify-end sm:p-10">
      <ul className="flex flex-wrap justify-center space-x-4 gap-y-2">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/essays">Essays</Link></li>
        <li><Link href="/notes">Notes</Link></li>
        <li><Link href="/library">Library</Link></li>
        <li><Link href="/activities">Activities</Link></li>
        <li><Link href="/about">About</Link></li>
      </ul>
    </div>
  );
}
