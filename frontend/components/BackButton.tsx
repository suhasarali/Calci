// components/BackButton.jsx
'use client'; 

import React from 'react';
import { useRouter } from 'next/navigation'; 
import { ArrowLeft } from 'lucide-react';

const BackButton = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/calculator/home');
  };

  return (
    <button
      onClick={handleGoBack}
      className="
        inline-flex items-center gap-2 px-4 py-2 w-fit m-4
        bg-gray-100 text-gray-800 border border-gray-300
        font-medium text-base rounded-lg
        cursor-pointer
        transition-all duration-150 ease-in-out
        hover:bg-gray-200 hover:scale-105
        active:scale-95 active:bg-gray-300
        focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <ArrowLeft size={20} />
    </button>
  );
};

export default BackButton;