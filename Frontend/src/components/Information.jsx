import React, { useEffect, useRef } from 'react';

const InfoSection = ({ image, title, description, buttonText }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        } else {
          entry.target.classList.remove('animate-in');
        }
      },
      {
        threshold: 0.1
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div 
      id="information" 
      ref={sectionRef}
      className="slide-from-left max-w-6xl mx-auto px-4 py-16"
    >
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        <div className="w-full lg:w-1/2 flex justify-center mb-8 lg:mb-0">
          <img 
            src={image} 
            alt="Information graphic" 
            className="w-full max-w-sm md:max-w-md rounded-lg shadow-md"
          />
        </div>
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center lg:text-left">
            {title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
          <div className="flex justify-center lg:justify-start">
            <button className="bg-[#E34989] text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-[#FFADC6] hover:text-[#573C27] transition-colors">
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;