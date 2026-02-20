"use client";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const AboutCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <Carousel
      plugins={[Fade(), Autoplay({ delay: 8000 })]}
      opts={{ loop: true }}
      setApi={setApi}
    >
      <CarouselContent>
        <CarouselItem>
          <div className="flex flex-col justify-center lg:items-center lg:flex-row gap-10 pt-20 max-w-360 lg:mx-auto">
            <div className="basis-full relative md:basis-1/2 flex justify-center items-center aspect-square max-w-md">
              <div className="flex relative w-full h-full  mask-[url('/about-mask.svg')]  mask-no-repeat mask-contain mask-center">
                <Image
                  className="absolute inset-0 w-full h-full object-cover"
                  src={"/avatar-test.webp"}
                  alt="Avatar"
                  width={1200}
                  height={1200}
                />
              </div>
            </div>
            <div className="basis-full md:basis-1/2">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl  leading-relaxed text-foreground/90">
                Soy un ingeniero de software con{" "}
                <strong className="font-bold text-foreground whitespace-nowrap relative inline-block pr-2.5 underline-custom">
                  +3 años de experiencia{" "}
                </strong>{" "}
                construyendo y escalando aplicaciones web.
                <br />
                Trabajo principalmente con{" "}
                <span className="font-bold text-foreground relative inline-block pr-2.5 underline-custom">
                  <Image
                    unoptimized
                    src="/technologies/react.svg"
                    alt="React"
                    width={30}
                    height={30}
                    className="inline-block align-middle me-1"
                  />
                  React
                </span>
                ,
                <span className="font-bold text-foreground relative inline-block pr-2.5 underline-custom">
                  <Image
                    unoptimized
                    src="/technologies/nextjs.svg"
                    alt="React"
                    width={30}
                    height={30}
                    className="inline-block align-middle me-1"
                  />
                  Next.js
                </span>
                y{" "}
                <span className="font-bold text-foreground relative inline-block pr-2.5 underline-custom">
                  <Image
                    unoptimized
                    src="/technologies/typescript.svg"
                    alt="TypeScript"
                    width={30}
                    height={30}
                    className="inline-block align-middle me-1"
                  />{" "}
                  TypeScript
                </span>
                , para entregar aplicaciones web de alta calidad.
              </p>
            </div>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex flex-col justify-center lg:items-center lg:flex-row gap-10 pt-20 max-w-360 lg:mx-auto">
            <div className="basis-full relative md:basis-1/2 flex justify-center items-center aspect-square max-w-md">
              <div className="flex relative w-full h-full  mask-[url('/about-mask.svg')]  mask-no-repeat mask-contain mask-center">
                <Image
                  className="absolute inset-0 w-full h-full object-cover"
                  src={"/gdg-team.webp"}
                  alt="Avatar"
                  width={1200}
                  height={1200}
                />
              </div>
            </div>
            <div className="basis-full md:basis-1/2">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl  leading-relaxed text-foreground/90">
                <strong className="font-bold text-foreground whitespace-nowrap relative inline-block pr-2.5 underline-custom">
                  Organizador
                </strong>{" "}
                de la comunidad
                <span className="font-bold text-foreground relative inline-block pr-2.5 underline-custom">
                  <Image
                    unoptimized
                    src="/gdg.svg"
                    alt="GDG"
                    width={30}
                    height={30}
                    className="inline-block align-middle me-2"
                  />
                  GDG (Google Developer Group)
                </span>
                en mi ciudad, donde lidero eventos y talleres para fomentar el
                aprendizaje y la colaboración entre desarrolladores locales.
              </p>
            </div>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious className="lg:left-auto lg:right-24 lg:top-auto lg:bottom-0 lg:translate-y-0 -bottom-12 left-[calc(50%-4rem)] top-auto translate-y-0" />
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 lg:left-auto lg:right-12 lg:translate-x-0 lg:bottom-0 flex items-center h-8 text-sm text-muted-foreground font-medium">
        {current} / {count}
      </div>
      <CarouselNext className="lg:right-0 lg:top-auto lg:bottom-0 lg:translate-y-0 -bottom-12 right-[calc(50%-4rem)] top-auto translate-y-0" />
    </Carousel>
  );
};
