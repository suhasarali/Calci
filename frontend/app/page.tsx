"use client";

import { NavbarDemo } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Logos3Demo } from "@/components/ui/logos3-demo";
import { Features } from "@/components/ui/features";
import  Footer4Col from "@/components/footer-column";
import { CTA } from "@/components/Cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <NavbarDemo />
      <HeroSection />
      
    </div>
  );
}
//
