"use client";

import { NavbarLanding } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Logos3Demo } from "@/components/ui/logos3-demo";
import { Features } from "@/components/ui/features";
import  Footer4Col from "@/components/footer-column";
import { CTA } from "@/components/Cta";
import { QuantityLanding } from "@/components/quantity-landing";
import { Testimonials } from "@/components/Testimonials";
import {Timeline} from '@/components/timeline';


export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground" style={{
      backgroundImage: `
        radial-gradient(circle 200px at 0% 20%, rgba(139,92,246,0.25), transparent),
        radial-gradient(circle 400px at 100% 5%, rgba(59,130,246,0.3), transparent),
        radial-gradient(circle 350px at 20% 76%, rgba(139,92,246,0.15), transparent),
        radial-gradient(circle 300px at 80% 80%, rgba(59,130,246,0.15), transparent)
      `,
      // The backgroundSize is automatically handled by the browser for radial gradients,
      // so we can remove it or leave it, but removing it is cleaner.
    }}>
      <NavbarLanding/>
      <HeroSection />
      <Features />
      <QuantityLanding/>
      <Testimonials/>
      <Timeline/>
      <CTA/>
      <Footer4Col/>

    </div>
  );
}