import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="w-full py-6 sm:-mt-15 lg:py-12"
    >
      <div className="container mx-auto">
        <div className="mx-auto max-w-5xl rounded-xl bg-blue-600 p-8 text-center text-white shadow-xl lg:p-12 border-1 border-blue-900">
          <Badge className="mx-auto bg-white text-black hover:bg-black hover:text-white">
            Get started
          </Badge>

          <h2 id="cta-heading" className="mt-6 text-2xl font-semibold tracking-tight text-white md:text-4xl">
            Ready to Master your Money?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-base text-white md:text-lg">
            Stop juggling spreadsheets and manual calculations. Our tools help you plan, track and grow with simple, smart Calculators that save time.
          </p>

          <ul className="mt-6 flex flex-col items-center justify-center gap-3 text-sm text-gray-50 sm:flex-row">
            <li className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary-600 text-white">✓</span>
              <span>Fast, accurate calculators</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary-600 text-white">✓</span>
              <span>Step-by-step guidance</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary-600 text-white">✓</span>
              <span>Exportable results & reports</span>
            </li>
          </ul>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded text-black sm:flex-row">
            {/* --- FIX: "Schedule a call" button --- */}
            {/* Color no longer changes on hover, but the icon now animates. */}
            <Button
              aria-label="Schedule a call"
              variant="outline"
              className="group w-full sm:w-auto rounded-full bg-white text-black focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
                Schedule a call
              </span>
            </Button>

            {/* --- FIX: "Create account" button --- */}
            {/* Reverted to its original state: background changes, icon is static. */}
            <Button
              aria-label="Create an account"
              className="w-full sm:w-auto bg-blue-950 text-white rounded-full hover:bg-white hover:text-black"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="flex items-center gap-2">
                Create account
                <MoveRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CTA };

