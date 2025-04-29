import HeroSection from "@/components/hero-section";
import FooterSection from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <HeroSection />
      <FooterSection />
    </div>
  );
}
