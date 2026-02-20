import { AboutCarousel } from "@/components/AboutCarousel";

export const About = () => {
  return (
    <section className="py-20 lg:py-32 px-4 ">
      <div className="max-w-120 mx-auto text-center">
        <h2 className="font-bold text-3xl lg:text-4xl xl:text-5xl/relaxed mb-4">
          Más sobre mí
        </h2>
        <p className="text-muted-foreground lg:text-lg/relaxed xl:text-xl/relaxed">
          Un vistazo cercano a quién soy y qué me impulsa.
        </p>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <AboutCarousel />
      </div>
    </section>
  );
};
