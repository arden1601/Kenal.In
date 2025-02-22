import React from 'react';
import heroImage from '../assets/pinkanime.jpeg';

const Hero = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-24">
          {/* Left side - Text content */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-[#573C27] mb-4">
              Optimalkan Presensi{' '}
              <span className="block mt-2 text-[#E34989]">dengan S3NS4S1ONAL</span>
            </h1>
            <p className="text-[#A98360] text-lg mb-8">
              Lorem ipsum dolor sit amet? aigo yaaa
            </p>
            <button className="custom-button">
              Register
            </button>
          </div>

          {/* Right side - Illustration */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <div className="relative z-10 data-aos=flip-left">
                <img
                  src={heroImage}
                  alt="Development illustration"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
              
              <div className="absolute top-0 right-0 -mr-4 p-2 bg-[#FFADC6] rounded-full z-0">
                <div className="w-4 h-4 bg-[#E34989] rounded-full"/>
              </div>
              <div className="absolute bottom-0 left-0 -ml-4 p-2 bg-[#FDEED9] rounded-full z-0">
                <div className="w-4 h-4 bg-[#A98360] rounded-full"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;