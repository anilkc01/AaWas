import { Link } from "react-router-dom";


export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-12 px-6">

        
        <Link to="/" className="flex items-center select-none">
          <img src="/logo.png" alt="AaWAS Logo" className="h-10 w-auto" />
        </Link>

        
        <div className="flex items-center gap-4 text-gray-700 text-sm">
          <Link to="/about" className="hover:text-black px-2 py-1">
            About Us
          </Link>

          

          <Link
            to="/login"
            className="border border-yellow-700 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-100 text-xs"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
