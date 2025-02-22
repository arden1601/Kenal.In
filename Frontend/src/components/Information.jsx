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
      className="slide-from-left flex items-center justify-center gap-16 max-w-6xl mx-auto px-4 py-16"
    >
      <div className="flex-1">
        <img 
          src={image} 
          alt="Information graphic" 
          className="w-full max-w-md"
        />
      </div>
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {title}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
        <button className="custom-button">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default InfoSection;