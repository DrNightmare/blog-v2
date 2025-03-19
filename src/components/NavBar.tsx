import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="flex items-end justify-end p-8 pb-20 sm:p-10">
      <ul className="flex space-x-4">
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
