import { Facebook, Twitter, Instagram, Github, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer4Col() {
  return (
    <footer className="relative py-10 mt-20 overflow-hidden dark:bg-transparent">
      <div
        className="absolute inset-0 z-0"
        style={{
          // CHANGE THIS LINE: Replaced '#fff' with 'transparent'
          background:
            "radial-gradient(125% 125% at 50% 10%, transparent 40%, #6366f1 100%)",
        }}
      />

      {/* Marquee Background */}
      <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none z-0">
        <div
          className={`
            whitespace-nowrap animate-marquee font-extrabold text-transparent bg-clip-text
            bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 opacity-10 -mt-15
            select-none text-[10rem] md:text-[16rem] lg:text-[20rem] leading-none
          `}
        >
          PaisaMastery&nbsp;PaisaMastery&nbsp;PaisaMastery&nbsp;PaisaMastery&nbsp;
          PaisaMastery&nbsp;PaisaMastery&nbsp;PaisaMastery&nbsp;PaisaMastery
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-30 flex flex-col md:flex-row justify-between gap-10">
        {/* Left Column */}
        <div className="flex-1 flex flex-col items-start space-y-4">
          {/* Logo */}
          <img src="demologo.png" alt="logo" width={120} height={100} />

          {/* Description */}
          <p className="text-gray-800 max-w-sm text-sm md:text-base font-semibold">
            Simplifying finance for everyone to plan smarter, grow faster, and
            achieve your goals with ease.
          </p>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-4 text-gray-800 text-sm font-semibold">
            <Link
              href="#features"
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="hover:text-blue-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#resources"
              className="hover:text-blue-600 transition-colors"
            >
              Resources
            </Link>
            <Link href="#about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link
              href="#contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 pt-1">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="p-2 rounded-full border border-gray-200 bg-white hover:bg-blue-50 transition"
            >
              <Facebook size={16} className="text-gray-700" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="p-2 rounded-full border border-gray-200 bg-white hover:bg-blue-50 transition"
            >
              <Twitter size={16} className="text-gray-700" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="p-2 rounded-full border border-gray-200 bg-white hover:bg-blue-50 transition"
            >
              <Instagram size={16} className="text-gray-700" />
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="p-2 rounded-full border border-gray-200 bg-white hover:bg-blue-50 transition"
            >
              <Github size={16} className="text-gray-700" />
            </Link>
            <Link
              href="mailto:hello@paisamastery.com"
              className="p-2 rounded-full border border-gray-200 bg-white hover:bg-blue-50 transition"
            >
              <Mail size={16} className="text-gray-700" />
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col md:flex-row justify-between gap-10 text-gray-700 text-sm md:text-base">
          {/* Contact */}
          <div className="flex-1 flex flex-col space-y-2">
            <h3 className="font-semibold text-gray-900">Contact Us</h3>
            <p>Email: hello@paisamastery.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Address: 123 Finance Street, Mumbai, India</p>
          </div>

          {/* Quick Links */}
          <div className="flex-1 flex flex-col space-y-2">
            <h3 className="font-semibold text-gray-900">Quick Links</h3>
            <p className="hover:text-blue-600 cursor-pointer transition">
              Privacy Policy
            </p>
            <p className="hover:text-blue-600 cursor-pointer transition">
              Terms of Service
            </p>
            <p className="hover:text-blue-600 cursor-pointer transition">
              Support
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="relative z-10 mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} PaisaMastery. All rights reserved.
      </div>

      {/* Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 80s linear infinite;
        }
      `}</style>
    </footer>
  );
}