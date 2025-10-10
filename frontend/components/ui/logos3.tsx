// This template requires the Embla Auto Scroll plugin to be installed:
//
// npm install embla-carousel-auto-scroll

"use client";

import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  heading = "Trusted by these companies",
  logos = [
    {
      id: "logo-1",
      description: "Company 1",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=150&fit=crop&crop=center",
      className: "h-16 w-auto object-cover rounded-lg",
    },
    {
      id: "logo-2",
      description: "Company 2",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=150&fit=crop&crop=center",
      className: "h-16 w-auto object-cover rounded-lg",
    },
    {
      id: "logo-3",
      description: "Company 3",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=150&fit=crop&crop=center",
      className: "h-16 w-auto object-cover rounded-lg",
    },
    {
      id: "logo-4",
      description: "Company 4",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=150&fit=crop&crop=center",
      className: "h-16 w-auto object-cover rounded-lg",
    },
    {
      id: "logo-5",
      description: "Company 5",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=150&fit=crop&crop=center",
      className: "h-16 w-auto object-cover rounded-lg",
    },
    {
      id: "logo-6",
      description: "Company 6",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=150&fit=crop&crop=center",
      className: "h-16 w-auto object-cover rounded-lg",
    },
    {
      id: "logo-7",
      description: "Company 7",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=150&fit=crop&crop=center",
      className: "h-16 w-auto object-cover rounded-lg",
    },
    {
      id: "logo-8",
      description: "Company 8",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=150&fit=crop&crop=center",
      className: "h-16 w-auto object-cover rounded-lg",
    },
  ],
}: Logos3Props) => {
  return (
    <section className="py-2">
      <div className="container flex flex-col items-center text-center">
        <h1 className="my-6 text-2xl font-bold text-pretty lg:text-4xl">
          {heading}
        </h1>
      </div>
      
      {/* First Carousel - Left to Right */}
      <div className="pt-10 md:pt-16 lg:pt-20">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-6xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true, speed: 0.5 })]}
          >
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={`ltr-${logo.id}`}
                  className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-6 flex shrink-0 items-center justify-center">
                    <div className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={logo.image}
                        alt={logo.description}
                        className={logo.className}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>

      {/* Second Carousel - Right to Left */}
      <div className="pt-10 md:pt-16 lg:pt-20">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-6xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true, speed: 0.5, direction: "backward" })]}
          >
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={`rtl-${logo.id}`}
                  className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-6 flex shrink-0 items-center justify-center">
                    <div className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={logo.image}
                        alt={logo.description}
                        className={logo.className}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export { Logos3 };

