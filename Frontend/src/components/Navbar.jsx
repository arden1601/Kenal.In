import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoWeb from '../assets/logoweb.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Information', href: '/information' },
    { name: 'Community', href: '/community' },
    { name: 'Feature', href: '/feature' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <nav className="bg-white w-full shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center gap-2">
              <img src={logoWeb} alt="Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-[#573C27]">S3NS4T1IONAL</span>
            </a>
          </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#A98360] hover:text-[#573C27] px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
            <button className="custom-button">
              Register Now →
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#A98360] hover:text-[#573C27] hover:bg-[#FFADC6] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#E34989]"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#A98360] hover:text-[#573C27] block px-3 py-2 text-base font-medium transition-colors"
              >
                {item.name}
              </a>
            ))}
            <button className="w-full bg-[#E34989] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#FFADC6] hover:text-[#573C27] transition-colors mt-4">
              Register Now →
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;