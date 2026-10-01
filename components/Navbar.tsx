import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div>
      <header>
        <nav>
            <Link href="/">
            <Image src="/icons/logo.png" alt="logo" width="24" height="24" />
            </Link>

            <p>Dev Events</p>

            <ul>
                <Link href="/">Home</Link>
                <Link href="/">Events</Link>
                <Link href="/">Create Event</Link>
            </ul>
        </nav>
      </header>
    </div>
  );
}