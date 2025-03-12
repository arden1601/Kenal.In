import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/pinkanime.jpeg';

const Hero = () => {
  return (
    <div className="bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-16 lg:py-24">
          {/* Left side - Text content */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#573C27] mb-4">
              Optimalkan Presensi{' '}
              <span className="block mt-2 text-[#E34989]">dengan S3NS4S1IONAL</span>
            </h1>
            <p className="text-[#A98360] text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Lorem ipsum dolor sit amet? aigo yaaa
            </p>
            <div className="flex justify-center md:justify-start">
              <Link to="/register" className="bg-[#E34989] text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-[#FFADC6] hover:text-[#573C27] transition-colors">
                Register
              </Link>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="w-full md:w-1/2 flex justify-center px-4 md:px-0">
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg">
              <div className="relative z-10">
                <img
                  src={heroImage}
                  alt="Development illustration"
                  className="w-full h-auto rounded-2xl shadow-lg"
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