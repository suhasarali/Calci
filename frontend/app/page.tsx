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
      <div className="flex justify-center mt-5">
        <NavbarDemo />
      </div>
      <div className="flex justify-center">
        <HeroSection />
      </div>
      <Logos3Demo />
      <Features />
      <CTA/>
      <Footer4Col/>
      {/* Your landing page content will go here */}
    </div>
  );
}
//
