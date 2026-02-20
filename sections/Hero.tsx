import Image from "next/image";
import LightRays from "@/components/LightRays";
import ShinyText from "@/components/ShinyText";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      <LightRays
        raysOrigin="top-center"
        raysColor="#28c39c"
        raysSpeed={1}
        lightSpread={0.5}
        rayLength={3}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0}
        distortion={0}
        pulsating={false}
        fadeDistance={1}
        saturation={1}
      />
      <section className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10 max-w-170 w-full px-4">
        <Image
          src="/avatar.webp"
          alt="Avatar de David Licla"
          width={150}
          height={150}
          className="mx-auto rounded-full mb-6"
        />

        <p className="text-lg lg:text-2xl xl:text-3xl/relaxed">
          Hola, Soy David Licla
        </p>
        <h1 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-[4rem]/relaxed font-bold mb-4">
          <ShinyText
            text="Software Engineer"
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </h1>

        <p className="text-md lg:text-xl/relaxed text-muted-foreground mb-5">
          Apasionado por crear geniales experiencias de usuario en la web y
          productos digitales de alto impacto.
        </p>
        <Button className="text-lg px-4 py-6 rounded-2xl" asChild>
          <a href="#contact">Contáctame</a>
        </Button>
      </section>
    </div>
  );
};
