import { Github, Linkedin } from "lucide-react";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  return (
    <main>
      {children}
      <footer className="max-w-7xl mx-auto px-4 flex items-center justify-between   w-full py-10 mt-24 border-t ">
        <p className="text-sm text-white opacity-60">
          © {new Date().getFullYear()} David Licla.
        </p>
        <ul className="flex gap-4 list-none ">
          <li>
            <a
              href="https://github.com/davidmariolc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Github"
              className="text-white opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <Github strokeWidth={1.5} className="w-5 h-5" />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/davidmariolc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white opacity-60 hover:opacity-100 transition-opacity duration-300"
            >
              <Linkedin strokeWidth={1.5} className="w-5 h-5" />
            </a>
          </li>
        </ul>
      </footer>
    </main>
  );
}
