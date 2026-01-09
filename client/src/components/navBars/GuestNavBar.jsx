import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="w-full mx-auto flex justify-between items-center h-16 px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center select-none">
          <img src="/logo.png" alt="AaWAS Logo" className="h-14 w-auto" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6 text-gray-700 text-base">
          <Link
            to="/about-us"
            className="hover:text-black px-3 py-1.5"
          >
            About Us
          </Link>

          <Link
            to="/login"
            className="border border-yellow-700 text-yellow-700
              px-4 py-2 rounded-md hover:bg-yellow-100 text-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
