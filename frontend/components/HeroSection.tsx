'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group' // Assuming this path is correct
import { cn } from '@/lib/utils'

// Animation variants from the first code block
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

export function HeroSection() {
    return (
        <>
            <main className="relative overflow-hidden">
                {/* Decorative background elements from the first code block */}
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />

                <section className="relative">
                    <div className="mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-2 lg:gap-x-12">
                        {/* Left side: Text content */}
                        <div className="relative z-10 py-24 sm:py-32 lg:py-48">
                            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="#link"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 lg:mx-0 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-blue-900 text-sm">Introducing Smart Financial Planning Tools</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    <h1 className="text-balance text-5xl text-blue-950 font-semibold tracking-tight md:text-6xl xl:text-7xl">
                                        Plan Smart. Invest Smarter.
                                    </h1>
                                    <p className="mt-6 text-lg text-balance text-muted-foreground">
                                        Powerful calculators and expert guidance to grow your wealth with confidence.
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
    className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
    
    {/* CORRECTED BUTTON */}
    <Link href="/calculator/home">
    <Button
        key={1}
        asChild
        size="lg"
        className="w-full rounded-[14px] border bg-blue-900 p-0.5 px-5 text-base sm:w-auto hover:bg-blue-800 transform ">
        
            <span className="text-nowrap">Start Calculating</span>
       
    </Button>
     </Link>

    <Button
        key={2}
        asChild
        size="lg"
        variant="ghost"
        className="w-full rounded-xl px-5 text-base sm:w-auto">
        <Link href="#link">
            <span className="text-nowrap">Request a Callback</span>
        </Link>
    </Button>
</AnimatedGroup>
                            </div>
                        </div>

                        {/* Right side: Image */}
                      <AnimatedGroup
                        variants={{
                            container: {
                                visible: {
                                    transition: {
                                        staggerChildren: 0.05,
                                        delayChildren: 0.4, // starts right after text animation
                                    },
                                },
                            },
                            ...transitionVariants,
                        }}
                        className="relative flex items-center justify-center lg:justify-end mt-12 lg:mt-0"
                    >
                        <div className="relative w-[110%] max-w-2xl lg:max-w-3xl">
                            <img
                                src="/heroimage.png"
                                alt="Financial Planning Illustration"
                                width={1200}
                                height={900}
                                className="w-full h-auto object-contain drop-shadow-2xl transition-transform duration-700 ease-out hover:scale-105"
                            />
                        </div>
                    </AnimatedGroup>
                    </div>
                </section>
            </main>
        </>
    )
}