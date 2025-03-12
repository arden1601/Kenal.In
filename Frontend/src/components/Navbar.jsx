import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logoWeb from '../assets/LOGO FREAKY AHH.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/#home' },  
    { name: 'Information', href: '/#information' },
    { name: 'Community', href: '/#community' },
    { name: 'Feature', href: '/#feature' },
    { name: 'Pricing', href: '/#pricing' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.getElementById('mobile-menu-container');
      if (isOpen && nav && !nav.contains(event.target) && !event.target.closest('button[aria-label="Toggle menu"]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Function to handle navigation
  const handleNavigation = (e, href) => {
    e.preventDefault();
    
    // If we're on a different page and need to go to home page sections
    if (location.pathname !== '/' && href.startsWith('/#')) {
      // Navigate to home page first
      navigate('/');
      
      // After navigation, scroll to the section (with a slight delay to ensure navigation completes)
      setTimeout(() => {
        const targetId = href.replace('/#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } 
    // If we're already on the home page and need to scroll to a section
    else if (location.pathname === '/' && href.startsWith('/#')) {
      const targetId = href.replace('/#', '');
      const element = document.getElementById(targetId);
      
      if (element) {
        // Close mobile menu if open
        setIsOpen(false);
        
        // Scroll to the element
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Function to open register in new tab
  const openRegisterInNewTab = (e) => {
    e.preventDefault();
    window.open('/register', '_blank', 'noopener,noreferrer');
    // Close mobile menu if it was open
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - now uses handleNavigation */}
          <div className="flex-shrink-0 flex items-center">
            <a 
              href="/#home" 
              className="flex items-center gap-2"
              onClick={(e) => handleNavigation(e, '/#home')}
            >
              <img src={logoWeb} alt="Logo" className="h-10 w-10 sm:h-12 sm:w-12" />
              <span className="text-lg sm:text-xl font-bold text-[#573C27]">S3NS4T1IONAL</span>
            </a>
          </div>

          {/* Desktop Navigation - now uses handleNavigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#A98360] hover:text-[#573C27] px-2 lg:px-3 py-2 text-sm font-medium transition-colors"
                onClick={(e) => handleNavigation(e, item.href)}
              >
                {item.name}
              </a>
            ))}
            {/* Updated Register link to open in new tab */}
            <a 
              href="/register" 
              className="bg-[#E34989] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#FFADC6] hover:text-[#573C27] transition-colors whitespace-nowrap"
              target="_blank"
              rel="noopener noreferrer"
            >
              Register Now →
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
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

      {/* Mobile Navigation - now uses handleNavigation */}
      {isOpen && (
        <div 
          id="mobile-menu-container"
          className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg border-t border-gray-100"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#A98360] hover:text-[#573C27] block px-3 py-2 text-base font-medium transition-colors"
                onClick={(e) => handleNavigation(e, item.href)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-2 pb-1">
              {/* Updated Register link in mobile menu to open in new tab */}
              <a 
                href="/register" 
                className="block w-full bg-[#E34989] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#FFADC6] hover:text-[#573C27] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Register Now →
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;