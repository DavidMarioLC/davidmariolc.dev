import LogoLoop from "@/components/LogoLoop";

const imageLogos = [
  {
    src: "/clients/agrozzi-logo.png",
    alt: "Agrozzi",
    href: "https://agrozzi.cl/",
  },
  {
    src: "/clients/aintech-logo.png",
    alt: "Aintech",
    href: "https://aintech.cl/",
  },
  {
    src: "/clients/uc-chile-logo.png",
    alt: "UC Chile",
    href: "https://artesania.uc.cl/",
  },
  {
    src: "/clients/eurocorp-logo.png",
    alt: "Eurocorp",
    href: "https://euroinmobiliaria.cl/",
  },
  {
    src: "/clients/forma-logo.png",
    alt: "Forma",
    href: "https://www.somosforma.com/",
  },
  {
    src: "/clients/matra-logo.png",
    alt: "Matra",
    href: "https://www.matra.co.cr/",
  },
  {
    src: "/clients/mobilink-logo.png",
    alt: "Mobilink",
    href: "https://www.mobilink.cl/",
  },
  {
    src: "/clients/neta-logo.png",
    alt: "Neta",
    href: "https://neta.somosforma.dev/",
  },
  {
    src: "/clients/nuevaurbe-logo.png",
    alt: "Nueva Urbe",
    href: "https://rentas.inu.cl/",
  },
  {
    src: "/clients/radioextra-logo.png",
    alt: "Radio Extra",
    href: "https://www.extraradiocr.com/",
  },
  {
    src: "/clients/sinergia-logo.png",
    alt: "Sinergia",
    href: "https://isinergia.cl/",
  },
  {
    src: "/clients/sqm-logo.png",
    alt: "SQM",
    href: "https://www.sqmnutrition.com/",
  },
  {
    src: "/clients/tale-detail-logo.png",
    alt: "Tale Detail",
    href: "https://www.taledetail.design/",
  },
  {
    src: "/clients/viaschile-logo.png",
    alt: "Viaschile",
    href: "https://www.viaschile.cl/",
  },
];

export const Clients = () => {
  return (
    <div className="overflow-hidden relative py-15 md:py-30">
      <section className="text-center px-4 pb-20 max-w-180 mx-auto">
        <h2 className="font-bold text-3xl lg:text-4xl xl:text-5xl/relaxed mb-4">
          Empresas con las que colaboré
        </h2>
        <p className="text-muted-foreground lg:text-lg/relaxed xl:text-xl/relaxed">
          He tenido la oportunidad de aplicar mis habilidades de desarrollo
          Frontend en proyectos para clientes de primer nivel, enfocándome en
          crear interfaces intuitivas y eficientes.
        </p>
      </section>
      <div className="h-50 relative overflow-hidden flex flex-col gap-10">
        <LogoLoop
          logos={imageLogos}
          speed={100}
          direction="left"
          logoHeight={50}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          ariaLabel="Technology partners"
          fadeOutColor="#151312"
        />
        <LogoLoop
          logos={imageLogos}
          speed={100}
          direction="right"
          logoHeight={50}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          ariaLabel="Technology partners"
          fadeOutColor="#151312"
        />
      </div>
    </div>
  );
};
