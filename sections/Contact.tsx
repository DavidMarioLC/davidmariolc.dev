import { Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Contact = () => {
  return (
    <section
      id="contact"
      className="text-center px-4 max-w-7xl mx-auto py-10 md:pt-30 scroll-mt-2 md:-scroll-mt-40"
    >
      <h2 className="font-bold text-3xl lg:text-4xl xl:text-5xl/relaxed mb-4">
        Contactaté conmigo
      </h2>
      <p className="text-muted-foreground lg:text-lg/relaxed xl:text-xl/relaxed mb-12 max-w-170 mx-auto">
        ¿Tiene una oportunidad laboral donde mi perfil y experiencia puedan
        aportar valor? Envíame un correo electrónico o programa una llamada.
      </p>
      <footer className="bg-[#0a191e] p-8 lg:p-14 lg:pt-24  rounded-4xl  flex justify-center items-center flex-col">
        <p className="text-muted-foreground text-lg pb-5">
          Normalmente respondo en 24 horas.
        </p>
        <a
          href="mailto:hi@davidmariolc.dev"
          className="text-2xl md:text-5xl font-bold hover:opacity-70 transition-opacity duration-300 break-all px-4"
        >
          hi@davidmariolc.dev
        </a>
        <div className="flex items-center gap-4 w-full max-w-md my-6 px-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-sm opacity-60 uppercase tracking-wider">o</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        <Button
          className="rounded-2xl mb-10 lg:mb-20 text-base md:text-lg md:py-6"
          asChild
        >
          <a
            href="https://calendly.com/davidmariolc/30min"
            target="_blank"
            rel="noopener noreferrer"
          >
            Programe una llamada de 30 min
          </a>
        </Button>
        <div className="flex items-center justify-between flex-col-reverse gap-5 md:flex-row  w-full pt-8 border-t border-white/10 ">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} David Licla.
          </p>
          <ul className="flex  gap-4 ">
            <li>
              <a
                href="https://github.com/davidmariolc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Github"
                className="opacity-60 hover:opacity-100 transition-opacity duration-300"
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
                className="opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                <Linkedin strokeWidth={1.5} className="w-5 h-5" />
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </section>
  );
};
