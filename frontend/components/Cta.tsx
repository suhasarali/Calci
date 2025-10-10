import { MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function CTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="w-full py-16 lg:py-22"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 lg:p-12 shadow-xl text-center border-1 border-blue-900">
          <Badge className="mx-auto">Get started</Badge>

          <h2 id="cta-heading" className="mt-6 text-2xl md:text-4xl font-semibold tracking-tight">
            Supercharge your small business finances
          </h2>

          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop juggling spreadsheets and manual calculations. Our tools help you plan, track and grow  with simple, smart Calculators that save time.
          </p>

            <ul className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-zinc-700">
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

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 rounded">
            <Button
              aria-label="Schedule a call"
              variant="outline"
              className="flex items-center gap-2 rounded-4xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600"
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
