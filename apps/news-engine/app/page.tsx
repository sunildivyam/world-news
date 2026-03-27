import ApiPlayground from "@/components/ApiPlayground";
import Cta from "@/components/Cta";
import Endpoints from "@/components/Endpoints";
import Features from "@/components/Features";
import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-16">
      <Hero />
      <ApiPlayground />
      <Features />
      <Endpoints />
      <Cta />
    </main>
  );
}
