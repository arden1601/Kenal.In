import React from 'react';
import 'aos/dist/aos.css';

const FeaturesSection = () => {

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Presensi Lah pake kita
        </h2>
        <h3 className="text-2xl text-gray-800 mb-4">
          di Kenal.in aja
        </h3>
        <p className="text-gray-600 mb-16">
          Kenal.in aja cocok sama siapa sih?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Membership Organizations Card */}
          <div className="p-6 flex flex-col items-center border border-gray-200 shadow-lg" data-aos="flip-left">
            <div className="w-16 h-16 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-[#E34989]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-4">
              Membership Organisations
            </h4>
            <p className="text-gray-600 text-center">
              Our membership management software provides full automation of membership renewals and payments
            </p>
          </div>

          {/* National Associations Card */}
          <div className="p-6 flex flex-col items-center border border-gray-200 shadow-lg" data-aos="flip-left">
            <div className="w-16 h-16 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-[#E34989]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-4">
              National Associations
            </h4>
            <p className="text-gray-600 text-center">
              Our membership management software provides full automation of membership renewals and payments
            </p>
          </div>

          {/* Clubs and Groups Card */}
          <div className="p-6 flex flex-col items-center border border-gray-200 shadow-lg" data-aos="flip-left">
            <div className="w-16 h-16 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-[#E34989]">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold mb-4">
              Clubs And Groups
            </h4>
            <p className="text-gray-600 text-center">
              Our membership management software provides full automation of membership renewals and payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;