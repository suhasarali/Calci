'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useInView, useSpring, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'

import Lottie from 'lottie-react'
import animationData from '@/components/ui/heroimage1.json'
import animationData2 from '@/components/ui/heroimage2.json'
import animationData3 from '@/components/ui/heroimage3.json'


const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const animatedValue = useSpring(0, {
    damping: 50,
    stiffness: 200,
    mass: 1,
  })

  useEffect(() => {
    if (isInView) {
      animatedValue.set(value)
    }
  }, [isInView, value, animatedValue])

  useEffect(() => {
    const unsubscribe = animatedValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString() + suffix
      }
    })
    return () => unsubscribe()
  }, [animatedValue, suffix])

  return <span ref={ref}>0{suffix}</span>
}


export function HeroSection() {
  const stats = [
    { value: 15, suffix: '+', label: 'Smart Calculators', color: 'text-blue-600' },
    { value: 50, suffix: '+', label: 'Knowledge Quizzes', color: 'text-green-500' },
    { value: 100, suffix: 'k+', label: 'Happy Investors', color: 'text-blue-600' },
  ]

  const animations = [animationData, animationData2, animationData3];
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimationIndex((prevIndex) => (prevIndex + 1) % animations.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [animations.length]);


  return (
    <>
      <main className="relative overflow-hidden ">
        {/* Decorative background elements */}
        <div
          aria-hidden
          className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
        >
          <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />

        <section className="relative pb-32">
          {/* === MODIFIED: Changed from lg:grid to flex for responsive ordering === */}
          <div className="mx-auto flex max-w-7xl flex-col-reverse items-center px-6 lg:flex-row lg:gap-x-12">
            
            {/* === MODIFIED: Adjusted padding for mobile and set width for desktop === */}
            {/* Left side: Text content */}
            <div className="relative z-10 w-full lg:w-1/2 pt-12 pb-16 text-center lg:py-48 lg:text-left">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <AnimatedGroup variants={transitionVariants}>
                  
                    <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          
                        </span>
                        <span className="flex size-6">
                        
                        </span>
                      </div>
                    </div>
                  

                  <h1 className="text-balance text-5xl font-bold tracking-tight text-gray-800 md:text-6xl xl:text-7xl">
                    Master Your Financial Future with 
                    <span className='flex justify-center text-blue-900 font-bold lg:justify-start'>
                      PaisaMastery
                    </span>
                  </h1>
                  <p className="mt-6 text-lg text-balance text-muted-foreground">
                    Empower your investment journey with smart calculators, knowledge quizzes, and powerful analysis tools designed for Indian investors.
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
                  className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
                >
                  <Link href="/calculator/home">
                    <Button
                      key={1}
                      size="lg"
                      className="w-full rounded-[14px] border bg-blue-900 p-0.5 px-5 text-base sm:w-auto hover:bg-blue-800 transform "
                    >
                      <span className="text-nowrap">Start Calculating</span>
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
                      <span className="text-nowrap">Request a Callback</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            {/* === MODIFIED: Set width for desktop === */}
            {/* Right side: Lottie Animation */}
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
              className="relative flex w-full items-center justify-center lg:w-1/2 pt-24 lg:pt-0"
            >
              <div className="relative w-[110%] max-w-2xl lg:max-w-3xl">
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
                      className="w-full h-auto drop-shadow-2xl transition-transform duration-700 ease-out hover:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </AnimatedGroup>
          </div>

          {/* === MODIFIED: Changed -mt-24 to mt-16 lg:-mt-24 for responsive overlap === */}
          {/* Stats Section */}
          <div className="relative z-20 mx-auto mt-16 max-w-7xl px-6 lg:-mt-24 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-2xl border bg-background/80 p-8 text-center shadow-lg backdrop-blur-sm"
                >
                  <h2 className={cn('text-5xl font-bold tracking-tight', stat.color)}>
                     {stat.suffix === 'k+' ? (
                      <AnimatedCounter value={100} suffix="k+" />
                    ) : (
                       /* === Corrected component name from Animated-counter to AnimatedCounter === */
                      <AnimatedCounter value={stat.value} suffix="+" />
                   )}
                  </h2>
                  <p className="mt-2 text-base text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}