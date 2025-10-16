"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function NavbarHome() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Calculators", link: "/calculator/home" },
    { name: "Quizzes", link: "#quizzes" },
    { name: "Analysis Tools", link: "#tools" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsMobileMenuOpen(false); // Close mobile menu on sign out
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {loading ? (
              <NavbarButton variant="secondary" disabled>Loading...</NavbarButton>
            ) : user ? (
              <>
                <p className="hidden sm:block text-sm">
                  Welcome, {user.displayName || user.email?.split('@')[0]}
                </p>
                <NavbarButton variant="secondary" onClick={handleSignOut}>
                  Sign Out
                </NavbarButton>
              </>
            ) : (
              <Link href="/login" passHref>
                <NavbarButton variant="secondary">Login</NavbarButton>
              </Link>
            )}
            {/* --- MODIFIED: Updated button color --- */}
            <NavbarButton className="bg-[#0065FF] text-white rounded-2xl hover:bg-[#0052CC]">Book a call</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenu-Open)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={closeMobileMenu}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4 mt-4">
              {loading ? (
                <NavbarButton variant="secondary" className="w-full" disabled>Loading...</NavbarButton>
              ) : user ? (
                <NavbarButton variant="secondary" className="w-full" onClick={handleSignOut}>
                  Sign Out
                </NavbarButton>
              ) : (
                <Link href="/login" passHref className="w-full">
                  <NavbarButton variant="secondary" className="w-full" onClick={closeMobileMenu}>
                    Login
                  </NavbarButton>
                </Link>
              )}
              {/* --- MODIFIED: Updated button color --- */}
              <NavbarButton
                onClick={closeMobileMenu}
                className="w-full bg-[#0065FF] text-white rounded-2xl hover:bg-[#0052CC]"
              >
                Book a call
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
