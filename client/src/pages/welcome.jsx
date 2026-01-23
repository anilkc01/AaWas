import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <div
      className="w-full h-screen bg-cover bg-center pt-20"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="bg-black/20 w-full h-full flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full relative">

          {/* Headline - Responsive sizing */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white drop-shadow-2xl leading-tight animate-fade-in-up">
            Find your <span className="text-[#B59353]">space</span> <br /> 
            Live your <span className="text-[#B59353]">story.</span>
          </h1>

          {/* Search Section */}
          <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center gap-4 md:gap-5 animate-slide-in-up">
            
            {/* The Search Bar - More Rounded */}
            <div className="bg-white rounded-[2rem] md:rounded-full shadow-2xl flex flex-col md:flex-row flex-1 items-stretch md:items-center md:divide-x divide-gray-100 w-full max-w-3xl overflow-hidden border border-white/20">
              
              {/* Search input */}
              <div className="flex items-center gap-3 px-6 md:px-7 flex-1 border-b md:border-b-0 border-gray-100">
                {/* FIXED: Removed md:size and used a standard size */}
                <Search className="text-gray-400 shrink-0" size={22} />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full py-4 text-base md:text-[18px] font-bold focus:outline-none placeholder:text-gray-400 placeholder:font-medium bg-transparent"
                />
              </div>

              {/* Type Select */}
              <div className="relative flex items-center px-6 md:px-6 w-full md:w-48 border-b md:border-b-0 border-gray-100">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`w-full py-4 text-base md:text-[18px] font-bold focus:outline-none appearance-none bg-transparent pr-6 cursor-pointer ${
                    selectedType === "" ? "text-gray-400" : "text-black"
                  }`}
                >
                  <option value="" disabled hidden>Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                </select>
                <ChevronDown className="absolute right-6 h-5 w-5 pointer-events-none text-gray-400" />
              </div>

              {/* Location Select */}
              <div className="relative flex items-center px-6 md:px-6 w-full md:w-48">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={`w-full py-4 text-base md:text-[18px] font-bold focus:outline-none appearance-none bg-transparent pr-6 cursor-pointer ${
                    selectedLocation === "" ? "text-gray-400" : "text-black"
                  }`}
                >
                  <option value="" disabled hidden>Location</option>
                  <option value="kathmandu">Kathmandu</option>
                  <option value="pokhara">Pokhara</option>
                </select>
                <ChevronDown className="absolute right-6 h-5 w-5 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Separate Action Button - Perfect Circle */}
            <button className="bg-[#B59353] text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl hover:bg-[#a68546] flex items-center justify-center transition-all hover:scale-110 active:scale-95 group shrink-0">
              <ArrowRight
                onClick={() => navigate("/browse")}
                className="h-7 w-7 md:h-8 md:w-8 stroke-[3px]" />

            </button>

          </div>

          

        </div>
      </div>
    </div>
  );
}