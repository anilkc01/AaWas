import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from 'react';

export default function Welcome() {
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  return (
    <div
      className="w-full h-screen bg-cover bg-center pt-20"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="bg-black/10 w-full h-full flex items-center content-center">
        <div className="max-w-2xl mx-auto px-6 relative">

          {/* Bigger heading */}
          <h1 className="text-6xl font-extrabold text-yellow-500 drop-shadow-xl leading-tight animate-fade-in-up">
            Find your space <br /> Live your story.
          </h1>

          <div className="flex flex-row w-fit  animate-slide-in-up relative ">

          {/* Search box */}
          <div className=" bg-white p-0.1 rounded-xl shadow flex items-center space-x-5 pe-2">

            <input
              type="text"
              placeholder="Search"
              className="flex-1 px-2 py-1.5 rounded-xl text-sm focus:outline-none"
            />

            <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className={`pl-2 py-1.5 text-sm border-gray-200 rounded-md focus:outline-none appearance-none bg-transparent focus:text-black ${
                    selectedType === '' ? 'text-gray-400' : 'text-black'
                  } pr-8`} 
                >
                  <option value="" disabled hidden>Type</option>
                  <option value="apartment" className="text-black">Apartment</option>
                  <option value="house" className="text-black">House</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none mr-2 text-gray-400" />
              </div>

            <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  
                  className={`pl-2 py-1.5 text-sm border-gray-200 rounded-xl focus:outline-none appearance-none bg-transparent focus:text-black ${
                    selectedLocation === '' ? 'text-gray-400' : 'text-black'
                  } pr-8`}
                >
                  <option value="" disabled hidden>Location</option>
                  <option value="kathmandu" className="text-black">Kathmandu</option>
                  <option value="pokhara" className="text-black">Pokhara</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none mr-2 text-gray-400" />
              </div>

          </div>
          <div className="w-1 "></div>
          
         <button className="ml-2 p-2 bg-yellow-500 text-black rounded-full shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:ring-opacity-75 transition duration-300 transform hover:scale-105">
              <ArrowRight className="h-4 w-4" />
            </button>

          </div>

          
          
        </div>
        
      </div>
    </div>
  );
}
