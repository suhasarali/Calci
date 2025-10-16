// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { ArrowRight } from "lucide-react";
// import { motion, useInView, useSpring, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { AnimatedGroup } from "@/components/ui/animated-group";
// import { cn } from "@/lib/utils";

// import Lottie from "lottie-react";
// import animationData from "@/components/ui/heroimage1.json";
// import animationData2 from "@/components/ui/heroimage2.json";
// import animationData3 from "@/components/ui/heroimage3.json";

// const transitionVariants = {
//   item: {
//     hidden: {
//       opacity: 0,
//       filter: "blur(12px)",
//       y: 12,
//     },
//     visible: {
//       opacity: 1,
//       filter: "blur(0px)",
//       y: 0,
//       transition: {
//         type: "spring",
//         bounce: 0.3,
//         duration: 1.5,
//       },
//     },
//   },
// };

// function AnimatedCounter({
//   value,
//   suffix = "",
// }: {
//   value: number;
//   suffix?: string;
// }) {
//   const ref = useRef<HTMLSpanElement>(null);
//   const isInView = useInView(ref, { once: true, margin: "-100px" });

//   const animatedValue = useSpring(0, {
//     damping: 50,
//     stiffness: 200,
//     mass: 1,
//   });

//   useEffect(() => {
//     if (isInView) {
//       animatedValue.set(value);
//     }
//   }, [isInView, value, animatedValue]);

//   useEffect(() => {
//     const unsubscribe = animatedValue.on("change", (latest) => {
//       if (ref.current) {
//         ref.current.textContent = Math.round(latest).toLocaleString() + suffix;
//       }
//     });
//     return () => unsubscribe();
//   }, [animatedValue, suffix]);

//   return <span ref={ref}>0{suffix}</span>;
// }

// export function HeroSection() {
//   const stats = [
//     {
//       value: 15,
//       suffix: "+",
//       label: "Smart Calculators",
//       color: "text-blue-600",
//     },
//     {
//       value: 50,
//       suffix: "+",
//       label: "Knowledge Quizzes",
//       color: "text-green-500",
//     },
//     {
//       value: 100,
//       suffix: "k+",
//       label: "Happy Investors",
//       color: "text-blue-600",
//     },
//   ];

//   const animations = [animationData, animationData2, animationData3];
//   const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentAnimationIndex(
//         (prevIndex) => (prevIndex + 1) % animations.length
//       );
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [animations.length]);

//   return (
//     <>
//       <main className="relative overflow-hidden ">
//         {/* Decorative background elements */}
        

//         <section className="relative pb-32">
//           {/* === MODIFIED: Changed from lg:grid to flex for responsive ordering === */}
//           <div className="mx-auto flex max-w-7xl flex-col-reverse items-center px-6 lg:flex-row lg:gap-x-12">
//             {/* === MODIFIED: Adjusted padding for mobile and set width for desktop === */}
//             {/* Left side: Text content */}
//             <div className="relative z-10 w-full lg:w-1/2 pt-12 pb-16 text-center lg:py-48 lg:text-left">
//               <div className="mx-auto max-w-2xl gap-4 lg:mx-0">
//                 <AnimatedGroup variants={transitionVariants}>
//                   <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
//                   <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
//                     <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
//                       <span className="flex size-6"></span>
//                       <span className="flex size-6"></span>
//                     </div>
//                   </div>

//                   <h1 className="text-wrap text-5xl font-bold tracking-tight text-gray-800 md:text-xl xl:text-6xl">
//                     Master Your Financial Future with
//                     <span className=" text-wrap flex justify-center text-blue-900 font-bold lg:justify-start">
//                       PaisaMastery
//                     </span>
//                   </h1>
//                   <p className="mt-6 text-md sm:text-lg text-balance text-gray-900 font-medium">
//                     Empower your investment journey with smart calculators,
//                     knowledge quizzes, and powerful analysis tools designed for
//                     Indian investors.
//                   </p>
//                 </AnimatedGroup>

//                 <AnimatedGroup
//                   variants={{
//                     container: {
//                       visible: {
//                         transition: {
//                           staggerChildren: 0.05,
//                           delayChildren: 0.75,
//                         },
//                       },
//                     },
//                     ...transitionVariants,
//                   }}
//                   className="mt-10 ml-5 flex flex-col  items-center justify-center gap-4 sm:flex-row lg:justify-start"
//                 >
//                   <Link href="/calculator/home">
//                     <Button
//                       key={1}
//                       size="lg"
//                       className="w-full rounded-[14px] border bg-blue-900 p-0.5 px-5 text-base sm:w-auto hover:bg-blue-800 transform "
//                     >
//                       <span className="text-nowrap">Explore Calculators</span>
//                     </Button>
//                   </Link>
//                   <Button
//                     key={2}
//                     asChild
//                     size="lg"
//                     variant="ghost"
//                     className="w-full rounded-xl px-5 text-base sm:w-auto"
//                   >
//                     <Link href="#link">
//                       <span className="text-nowrap">Test your Knowledge</span>
//                     </Link>
//                   </Button>
//                 </AnimatedGroup>
//               </div>
//             </div>

//             {/* === MODIFIED: Set width for desktop === */}
//             {/* Right side: Lottie Animation */}
//             <AnimatedGroup
//               variants={{
//                 container: {
//                   visible: {
//                     transition: {
//                       staggerChildren: 0.05,
//                       delayChildren: 0.4,
//                     },
//                   },
//                 },
//                 ...transitionVariants,
//               }}
//               className="relative align-middle flex w-full items-center justify-center lg:w-1/2 pt-24 lg:pt-0"
//             >
//               <div className="relative items-center w-[70%] max-w-xl lg:max-w-3xl gap-4 ">
//                 <AnimatePresence mode="wait">
//                   <motion.div
//                     key={currentAnimationIndex}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     <Lottie
//                       animationData={animations[currentAnimationIndex]}
//                       loop={true}
//                       className="w-full h-auto ml-10 drop-shadow-2xl items-center transition-transform duration-700 ease-out hover:scale-103"
//                     />
//                   </motion.div>
//                 </AnimatePresence>
//               </div>
//             </AnimatedGroup>
//           </div>

//           {/* === MODIFIED: Changed -mt-24 to mt-16 lg:-mt-24 for responsive overlap === */}
//           {/* Stats Section */}
//           <div className="relative z-20 mx-auto mt-16 max-w-7xl px-6 lg:-mt-24 lg:px-8">
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//               {stats.map((stat, index) => (
//                 <div
//                   key={index}
//                   className="flex flex-col items-center rounded-2xl border bg-background/80 p-8 text-center shadow-lg shadow-blue-200 backdrop-blur-sm"
//                 >
//                   <h2
//                     className={cn(
//                       "text-5xl font-bold tracking-tight",
//                       stat.color
//                     )}
//                   >
//                     {stat.suffix === "k+" ? (
//                       <AnimatedCounter value={100} suffix="k+" />
//                     ) : (
//                       /* === Corrected component name from Animated-counter to AnimatedCounter === */
//                       <AnimatedCounter value={stat.value} suffix="+" />
//                     )}
//                   </h2>
//                   <p className="mt-2 text-base text-muted-foreground">
//                     {stat.label}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }


"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useInView, useSpring, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { cn } from "@/lib/utils";

import Lottie from "lottie-react";
import animationData from "@/components/ui/heroimage1.json";
import animationData2 from "@/components/ui/heroimage2.json";
import animationData3 from "@/components/ui/heroimage3.json";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

function AnimatedCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const animatedValue = useSpring(0, {
    damping: 50,
    stiffness: 200,
    mass: 1,
  });

  useEffect(() => {
    if (isInView) {
      animatedValue.set(value);
    }
  }, [isInView, value, animatedValue]);

  useEffect(() => {
    const unsubscribe = animatedValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString() + suffix;
      }
    });
    return () => unsubscribe();
  }, [animatedValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function HeroSection() {
  const stats = [
    {
      value: 15,
      suffix: "+",
      label: "Smart Calculators",
      // --- MODIFIED ---
      color: "text-[#0065FF]",
    },
    {
      value: 50,
      suffix: "+",
      label: "Knowledge Quizzes",
      color: "text-green-500", // Left green as is
    },
    {
      value: 100,
      suffix: "k+",
      label: "Happy Investors",
      // --- MODIFIED ---
      color: "text-[#0065FF]",
    },
  ];

  const animations = [animationData, animationData2, animationData3];
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimationIndex(
        (prevIndex) => (prevIndex + 1) % animations.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [animations.length]);

  return (
    <>
      <main className="relative overflow-hidden ">
        <section className="relative pb-32">
          <div className="mx-auto flex max-w-7xl flex-col-reverse items-center px-6 lg:flex-row lg:gap-x-12">
            <div className="relative z-10 w-full lg:w-1/2 pt-12 pb-16 text-center lg:py-48 lg:text-left">
              <div className="mx-auto max-w-2xl gap-4 lg:mx-0">
                <AnimatedGroup variants={transitionVariants}>
                  <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                  <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6"></span>
                      <span className="flex size-6"></span>
                    </div>
                  </div>

                  <h1 className="text-wrap text-5xl font-bold tracking-tight text-gray-800 md:text-xl xl:text-6xl">
                    Master Your Financial Future with
                    {/* --- MODIFIED --- */}
                    <span className=" text-wrap flex justify-center text-[#0065FF] font-bold lg:justify-start">
                      PaisaMastery
                    </span>
                  </h1>
                  <p className="mt-6 text-md sm:text-lg text-balance text-gray-900 font-medium">
                    Empower your investment journey with smart calculators,
                    knowledge quizzes, and powerful analysis tools designed for
                    Indian investors.
                  </p>
                </AnimatedGroup>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-10 ml-5 flex flex-col  items-center justify-center gap-4 sm:flex-row lg:justify-start"
                >
                  <Link href="/calculator/home">
                    <Button
                      key={1}
                      size="lg"
                      // --- MODIFIED ---
                      className="w-full rounded-[14px] border bg-[#0065FF] p-0.5 px-5 text-base sm:w-auto hover:bg-[#0052CC] transform "
                    >
                      <span className="text-nowrap">Explore Calculators</span>
                    </Button>
                  </Link>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="w-full rounded-xl px-5 text-base sm:w-auto"
                  >
                    <Link href="#link">
                      <span className="text-nowrap">Test your Knowledge</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.4,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="relative align-middle flex w-full items-center justify-center lg:w-1/2 pt-24 lg:pt-0"
            >
              <div className="relative items-center w-[70%] max-w-xl lg:max-w-3xl gap-4 ">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAnimationIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Lottie
                      animationData={animations[currentAnimationIndex]}
                      loop={true}
                      className="w-full h-auto ml-10 drop-shadow-2xl items-center transition-transform duration-700 ease-out hover:scale-103"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </AnimatedGroup>
          </div>

          <div className="relative z-20 mx-auto mt-16 max-w-7xl px-6 lg:-mt-24 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  // --- MODIFIED ---
                  className="flex flex-col items-center rounded-2xl border bg-background/80 p-8 text-center shadow-lg shadow-[#0065FF]/30 backdrop-blur-sm"
                >
                  <h2
                    className={cn(
                      "text-5xl font-bold tracking-tight",
                      stat.color
                    )}
                  >
                    {stat.suffix === "k+" ? (
                      <AnimatedCounter value={100} suffix="k+" />
                    ) : (
                      <AnimatedCounter value={stat.value} suffix="+" />
                    )}
                  </h2>
                  <p className="mt-2 text-base text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}