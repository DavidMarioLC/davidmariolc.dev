import { BadgeCheck } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="absolute top-8 z-20 w-full mx-auto px-4">
      <nav className="border border-[rgba(255,255,255,0.1)] bg-[rgba(20,115,102,0.1)] backdrop-blur-md rounded-[50px] lg:max-w-[50%] mx-auto py-4 px-6 flex items-center justify-between">
        <Link href="/" className="flex gap-2 items-center">
          <BadgeCheck className="text-[#209679]" />
          David Licla
        </Link>
        <ul className="flex gap-4">
          <li>
            <Link href="/projects">Proyectos</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
