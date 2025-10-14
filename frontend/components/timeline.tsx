'use client'; // This is required for using hooks like useState, useEffect, etc.

import { useState, useEffect, useRef } from 'react';

const timelineData = [
  {
    step: '01',
    title: 'Choose Your Tool',
    description: 'Browse through our calculators, quizzes, or analysis tools.',
  },
  {
    step: '02',
    title: 'Input Your Data',
    description: 'Enter your financial details in our simple, user-friendly interface.',
  },
  {
    step: '03',
    title: 'Get Insights',
    description: 'Receive instant calculations, scores, and personalized recommendations.',
  },
  {
    step: '04',
    title: 'Take Action',
    description: 'Make informed decisions and achieve your financial goals.',
  },
];

export const Timeline = () => {
  const [scrollYPercentage, setScrollYPercentage] = useState(0);
  const timelineRef = useRef(null);

  const handleScroll = () => {
    if (!timelineRef.current) return;

    const element = timelineRef.current;
    const { top, height } = element.getBoundingClientRect();
    
    // Calculate how much of the element is visible/scrolled past
    // Starts when the top of the element hits the bottom of the viewport
    // Ends when the bottom of the element hits the top of the viewport
    const scrollAmount = window.innerHeight - top;
    const percentage = (scrollAmount / (height + window.innerHeight)) * 100;

    // Clamp the value between 0 and 100
    setScrollYPercentage(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Initial check in case the component is already in view on page load
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={timelineRef} className=" py-4 px-2 sm:px-6">
     <h2 className="text-4xl sm:text-6xl text-center font-bold my-12 text-gray-800">
        How It  <span className="text-blue-900">Works ?</span>
      </h2>
      <div className="relative max-w-4xl mx-auto">
        
        {/* The Center Line Container */}
        <div className="hidden sm:block absolute top-0 h-full w-1 bg-blue-200 left-1/2 -translate-x-1/2">
          {/* The "Glow" or Fill Line */}
          <div 
            className="absolute top-0 w-full bg-blue-600 transition-all duration-300"
            style={{ height: `${scrollYPercentage}%` }}
          ></div>
        </div>
        
        <div className="space-y-12 sm:space-y-16">
          {timelineData.map((item, index) => {
            // Calculate the threshold for each item to become "active"
            const threshold = (index / timelineData.length) * 100;
            const isActive = scrollYPercentage > threshold;
            
            return (
              <div key={index} className="relative">
                
                {/* Mobile Line (static) */}
                <div className="sm:hidden absolute top-0 h-full w-1 bg-blue-200 left-5"></div>

                {/* The Circle */}
                <div className={`absolute w-10 h-10 bg-white border-4 rounded-full left-5 sm:left-1/2 sm:-translate-x-1/2 z-10 flex items-center justify-center transition-colors duration-300 ${isActive ? 'border-blue-600' : 'border-blue-200'}`}>
                  <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${isActive ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
                </div>

                {/* The Content Card */}
                <div
                  className={`ml-16 sm:ml-0 sm:w-1/2 relative ${
                    index % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8 sm:ml-auto'
                  }`}
                >
                  {/* The Arrow */}
                  <div
                    className={`hidden sm:block absolute top-4 w-4 h-4 bg-white transform rotate-45 transition-all duration-300 ${
                      index % 2 === 0
                        ? 'left-full -translate-x-1/2'
                        : 'right-full translate-x-1/2'
                    } ${isActive ? 'border-t border-r border-gray-200' : ''}`} // Optional: add border to arrow
                  ></div>
                  
                  <div className={`bg-white p-6 rounded-lg shadow-lg relative transition-all duration-300 ${isActive ? 'shadow-blue-200' : ''}`}>
                    <span className="absolute top-2 right-4 text-6xl font-bold text-blue-100/80 z-0">
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

