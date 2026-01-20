import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGetStarted = () => {
   
    navigate(`${location.pathname}?modal=login`);
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      {/* Container: Adjusted height and padding for mobile vs desktop */}
      <div className="w-full mx-auto flex justify-between items-center h-16 md:h-20 px-4 md:px-10">
        
        {/* Logo: Scaled down for mobile */}
        <Link to="/" className="flex items-center select-none transition-transform hover:scale-105 shrink-0">
          <img src="/logo.png" alt="AaWAS Logo" className="h-10 md:h-16 w-auto" />
        </Link>

        {/* Right side: Tighter gap on mobile */}
        <div className="flex items-center gap-4 md:gap-10 text-gray-800">
          <Link
            to="/about-us"
            className="text-sm md:text-lg font-bold hover:text-[#B59353] transition-colors"
          >
            About Us
          </Link>

          <button
            onClick={handleGetStarted}
            className="bg-[#B59353] text-white font-bold
              px-4 py-2 md:px-8 md:py-3 rounded-lg md:rounded-xl 
              text-sm md:text-lg hover:bg-[#a68546] 
              transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}