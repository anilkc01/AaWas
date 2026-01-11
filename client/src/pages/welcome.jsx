import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Welcome() {
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <div
      className="w-full h-screen bg-cover bg-center pt-20"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="bg-black/10 w-full h-full flex items-center">
        <div className="max-w-2xl mx-auto px-6 relative">

          {/* ✅ ANIMATION RESTORED */}
          <h1 className="text-[4rem] sm:text-[4.5rem] font-extrabold text-yellow-500 drop-shadow-xl leading-tight animate-fade-in-up">
            Find your space <br /> Live your story.
          </h1>

          {/* ✅ ANIMATION RESTORED */}
          <div className="flex items-center gap-2 mt-6 animate-slide-in-up relative">

            {/* Search box */}
            <div className="bg-white rounded-xl shadow flex items-center gap-5 pe-2">

              <input
                type="text"
                placeholder="Search"
                className="flex-1 px-2 py-1.5 rounded-xl text-[1rem] focus:outline-none"
              />

              {/* Type */}
              <div className="relative flex items-center">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`pl-2 py-1.5 text-[1rem] rounded-md focus:outline-none appearance-none bg-transparent pr-8 ${
                    selectedType === "" ? "text-gray-400" : "text-black"
                  }`}
                >
                  <option value="" disabled hidden>
                    Type
                  </option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                </select>
                <ChevronDown className="absolute right-2 h-5 w-5 pointer-events-none text-gray-400" />
              </div>

              {/* Location */}
              <div className="relative flex items-center">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={`pl-2 py-1.5 text-[1rem] rounded-xl focus:outline-none appearance-none bg-transparent pr-8 ${
                    selectedLocation === "" ? "text-gray-400" : "text-black"
                  }`}
                >
                  <option value="" disabled hidden>
                    Location
                  </option>
                  <option value="kathmandu">Kathmandu</option>
                  <option value="pokhara">Pokhara</option>
                </select>
                <ChevronDown className="absolute right-2 h-5 w-5 pointer-events-none text-gray-400" />
              </div>
            </div>

            {/* Button */}
            <button className="p-2 bg-yellow-500 text-black rounded-full shadow-lg hover:bg-yellow-600 focus:outline-none transition">
              <ArrowRight className="h-5 w-5" />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}
