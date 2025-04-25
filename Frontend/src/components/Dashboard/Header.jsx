import logoWeb from "../../assets/LOGO FREAKY AHH.png";

/**
 * The topmost bar of the Dashboard page that contains the logo and page title.
 *
 * @returns {React.ReactElement} The JSX element representing the Header.
 */

const Header = ({ page }) => {
  return (
    <div className="fixed top-0 inset-x-0 z-10 flex justify-between items-center px-4 sm:px-8 md:px-18 py-4 sm:py-6 bg-gradient-to-r from-[#EDB1C5] to-pink-400">
      {/* LOGO */}
      <div className="flex-shrink-0 flex items-center">
        <a href="/" className="flex items-center gap-1 sm:gap-2">
          <img src={logoWeb} alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
          <span className="text-sm sm:text-lg md:text-xl font-bold text-[#573C27]">
            S3NS4T1IONAL
          </span>
        </a>
      </div>

      {/* PAGE TITLE */}
      <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">
        <span className="text-[#573C27]">Kenal.In</span> {page}
      </p>
    </div>
  );
};

export default Header;