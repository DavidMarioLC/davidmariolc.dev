import { About } from "@/sections/About";
import { Clients } from "@/sections/Clients";
import { Contact } from "@/sections/Contact";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Clients />
      <Contact />
    </main>
  );
}
