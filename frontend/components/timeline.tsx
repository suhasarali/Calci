'use client';

import { useState, useEffect, useRef } from 'react';
// 1. Import icons from lucide-react
import { Search, Calculator, LineChart, CheckCircle2 } from 'lucide-react';

// 2. Update the timelineData to use the new icons
const timelineData = [
  {
    step: '01',
    title: 'Choose Your Tool',
    description: 'Browse through our calculators, quizzes, or analysis tools.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Input Your Data',
    description: 'Enter your financial details in our simple, user-friendly interface.',
    icon: Calculator,
  },
  {
    step: '03',
    title: 'Get Insights',
    description: 'Receive instant calculations, scores, and recommendations.',
    icon: LineChart,
  },
  {
    step: '04',
    title: 'Take Action',
    description: 'Make informed decisions and achieve your financial goals.',
    icon: CheckCircle2,
  },
];

export function Timeline() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  const handleScroll = () => {
    if (!sectionRef.current) return;
    const element = sectionRef.current;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const elementTop = rect.top;
    const elementHeight = rect.height;

    if (elementTop < viewportHeight && elementTop + elementHeight > 0) {
      // Using a slightly adjusted calculation for a good scroll feel
      const percentage = ((viewportHeight - elementTop) / (elementHeight * 0.8)) * 100;
      setScrollPercentage(Math.max(0, Math.min(100, percentage)));
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="working"
      ref={sectionRef}
      className="py-8  mb-0 px-4 sm:px-6 min-h-screen flex flex-col justify-center"
    >
      <h2 className="text-4xl sm:text-6xl text-center font-bold mb-5 text-gray-800">
        How It <span className="text-blue-900">Works?</span>
      </h2>
      <h3 className="text-xl sm:text-2xl text-center font-semibold mb-6 text-gray-700">Four simple steps to financial clarity</h3>

      {/* Mobile: Vertical Timeline */}
      <div className="sm:hidden">
        <div className="relative max-w-md mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-5 top-0 bottom-0 w-1 bg-blue-200">
            <div
              className="absolute top-0 left-0 w-full bg-blue-600 transition-all duration-300"
              style={{
                height: `${scrollPercentage}%`,
              }}
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => {
              const isActive = scrollPercentage > (index / timelineData.length) * 100;
              const IconComponent = item.icon;

              return (
                <div key={index} className="relative flex items-start pl-16">
                  {/* Icon Circle */}
                  <div
                    className={`absolute left-0 z-10 flex items-center justify-center w-12 h-12 bg-white border-4 rounded-full transition-colors duration-300 ${
                      isActive ? 'border-blue-600' : 'border-blue-200'
                    }`}
                  >
                    <IconComponent
                      className={`transition-colors duration-300 ${
                        isActive ? 'text-blue-600' : 'text-blue-200'
                      }`}
                      size={24} // 3. Use size prop for lucide-react icons
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`bg-white p-6 rounded-lg shadow-lg transition-all duration-300 relative ${
                      isActive ? 'shadow-blue-200' : ''
                    }`}
                  >
                    <span className="absolute text-6xl font-bold text-blue-100/80 z-0 right-4 -top-2">
                      {item.step}
                    </span>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-base">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal Timeline */}
      <div className="hidden sm:block">
        <div className="relative max-w-6xl mx-auto px-4">
          {/* Horizontal Line Container */}
          <div className="relative mb-24">
            <div className="absolute left-0 right-0 top-6 h-1 bg-blue-200">
              <div
                className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${scrollPercentage}%`,
                }}
              />
            </div>

            {/* Timeline items */}
            <div className="grid grid-cols-4 gap-5">
              {timelineData.map((item, index) => {
                const isActive = scrollPercentage > (index / timelineData.length) * 100;
                const IconComponent = item.icon;

                return (
                  <div key={index} className="relative flex flex-col items-center">
                    {/* Icon Circle */}
                    <div
                      className={`z-10 flex items-center justify-center w-14 h-14 bg-white border-4 rounded-full mb-6 transition-colors duration-300 ${
                        isActive ? 'border-blue-600' : 'border-blue-200'
                      }`}
                    >
                      <IconComponent
                        className={`transition-colors duration-300 ${
                          isActive ? 'text-blue-600' : 'text-blue-200'
                        }`}
                        size={28} // 3. Use size prop for lucide-react icons
                      />
                    </div>

                    {/* Content */}
                    <div
                      className={`bg-white p-6 rounded-lg shadow-lg transition-all duration-300 relative w-full ${
                        isActive ? 'shadow-blue-200' : ''
                      }`}
                    >
                      <span className="absolute text-6xl font-bold text-blue-100/80 z-0 right-4 -top-2">
                        {item.step}
                      </span>
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}