import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="w-full py-8 lg:py-16"
    >
      <div className="container mx-auto">
        <div className="mx-auto max-w-5xl rounded-xl bg-blue-800 text-white p-8 lg:p-12 shadow-xl text-center border-1 border-blue-900">
          <Badge className="mx-auto bg-white text-black hover:bg-black hover:text-white">Get started</Badge>

          <h2 id="cta-heading" className="mt-6 text-2xl text-white md:text-4xl font-semibold tracking-tight">
            Ready to Master your Money ?
          </h2>

          <p className="mt-3 text-base text-white md:text-lg  max-w-2xl mx-auto">
            Stop juggling spreadsheets and manual calculations. Our tools help you plan, track and grow  with simple, smart Calculators that save time.
          </p>

            <ul className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-50">
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-primary-600 text-white size-7 grid place-items-center">✓</span>
                <span>Fast, accurate calculators</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-primary-600 text-white size-7 grid place-items-center">✓</span>
                <span>Step-by-step guidance</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-full bg-primary-600 text-white size-7 grid place-items-center">✓</span>
                <span>Exportable results & reports</span>
              </li>
            </ul>

          <div className="mt-8 flex flex-col sm:flex-row text-black  items-center justify-center gap-4 rounded">
            <Button
              aria-label="Schedule a call"
              variant="outline"
              className="flex items-center gap-2 rounded-4xl hover:bg-black hover:text-white focus:outline-none "
            >
              <PhoneCall className="w-4 h-4" aria-hidden />
              Schedule a call
            </Button>

            <Button
              aria-label="Create an account"
              className="flex items-center gap-2 bg-blue-900 rounded-4xl"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Create account
              <MoveRight className="w-4 h-4" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CTA };
