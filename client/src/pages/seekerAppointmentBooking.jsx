import { useState } from "react";

// Appointment Card Component
const AppointmentCard = ({ appointment, onBook }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{appointment.propertyTitle}</h3>
            <p className="text-gray-600 text-sm mt-1">{appointment.address}</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {appointment.propertyType}
          </span>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-gray-500 text-xs mb-1">Agent</p>
              <p className="text-gray-800 font-medium">{appointment.agentName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Contact</p>
              <p className="text-gray-800">{appointment.agentPhone}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-gray-500 text-xs mb-1">Available Time Slots</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {appointment.availableSlots.map((slot, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                  {slot}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-1">Price</p>
            <p className="text-blue-600 font-bold text-lg">${appointment.price}/month</p>
          </div>
        </div>
        
        <button
          onClick={() => onBook(appointment)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

// Booking Modal Component
const BookingModal = ({ appointment, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [visitType, setVisitType] = useState("in-person");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time");
      return;
    }
    
    onConfirm({
      ...appointment,
      selectedDate,
      selectedTime,
      visitType,
      notes
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
            <p className="text-gray-600 mt-1">{appointment.propertyTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time Slot
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a time</option>
              {appointment.availableSlots.map((slot, idx) => (
                <option key={idx} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visit Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="in-person"
                  checked={visitType === "in-person"}
                  onChange={(e) => setVisitType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">In-Person Visit</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="virtual"
                  checked={visitType === "virtual"}
                  onChange={(e) => setVisitType(e.target.value)}
                  className="mr-2"
                />
                <span className="text-gray-700">Virtual Tour</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any specific requirements or questions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">Appointment Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Property:</span> {appointment.propertyTitle}</p>
              <p><span className="font-medium">Agent:</span> {appointment.agentName}</p>
              <p><span className="font-medium">Contact:</span> {appointment.agentPhone}</p>
              <p><span className="font-medium">Price:</span> ${appointment.price}/month</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

// Search Filters Component
const SearchFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="Enter city or address"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onFilterChange('date', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange('propertyType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="villa">Villa</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
          <select
            value={filters.priceRange}
            onChange={(e) => onFilterChange('priceRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Price</option>
            <option value="0-1000">$0 - $1,000</option>
            <option value="1000-2000">$1,000 - $2,000</option>
            <option value="2000-3000">$2,000 - $3,000</option>
            <option value="3000+">$3,000+</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onFilterChange('reset', null)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md mr-2 hover:bg-gray-50"
        >
          Reset Filters
        </button>
        <button
          onClick={() => onFilterChange('search', null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </div>
  );
};

// Main Component
export default function SeekerAppointmentBooking() {
  const [filters, setFilters] = useState({
    location: "",
    date: "",
    propertyType: "",
    priceRange: ""
  });

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Mock data - replace with actual API call
  const [appointments] = useState([
    {
      id: 1,
      propertyTitle: "Modern Downtown Apartment",
      address: "123 Main St, New York, NY",
      propertyType: "Apartment",
      agentName: "John Smith",
      agentPhone: "(555) 123-4567",
      price: 1500,
      availableSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
    },
    {
      id: 2,
      propertyTitle: "Luxury Villa with Pool",
      address: "456 Luxury Ln, Los Angeles, CA",
      propertyType: "Villa",
      agentName: "Sarah Johnson",
      agentPhone: "(555) 987-6543",
      price: 3500,
      availableSlots: ["10:00 AM", "1:00 PM", "3:00 PM"]
    },
    {
      id: 3,
      propertyTitle: "Cozy Suburban House",
      address: "789 Oak Ave, Chicago, IL",
      propertyType: "House",
      agentName: "Mike Davis",
      agentPhone: "(555) 456-7890",
      price: 2200,
      availableSlots: ["9:30 AM", "12:00 PM", "2:30 PM", "5:00 PM"]
    },
    {
      id: 4,
      propertyTitle: "Stylish Loft in Arts District",
      address: "321 Creative St, Portland, OR",
      propertyType: "Condo",
      agentName: "Emily Chen",
      agentPhone: "(555) 246-8135",
      price: 1800,
      availableSlots: ["10:30 AM", "1:30 PM", "4:30 PM"]
    }
        {
      id: 1,
      propertyTitle: "Modern Downtown Apartment",
      address: "123 Main St, New York, NY",
      propertyType: "Apartment",
      agentName: "John Smith",
      agentPhone: "(555) 123-4567",
      price: 1500,
      availableSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
    },
    {
      id: 2,
      propertyTitle: "Luxury Villa with Pool",
      address: "456 Luxury Ln, Los Angeles, CA",
      propertyType: "Villa",
      agentName: "Sarah Johnson",
      agentPhone: "(555) 987-6543",
      price: 3500,
      availableSlots: ["10:00 AM", "1:00 PM", "3:00 PM"]
    },
    {
      id: 3,
      propertyTitle: "Cozy Suburban House",
      address: "789 Oak Ave, Chicago, IL",
      propertyType: "House",
      agentName: "Mike Davis",
      agentPhone: "(555) 456-7890",
      price: 2200,
      availableSlots: ["9:30 AM", "12:00 PM", "2:30 PM", "5:00 PM"]
    },
    {
      id: 4,
      propertyTitle: "Stylish Loft in Arts District",
      address: "321 Creative St, Portland, OR",
      propertyType: "Condo",
      agentName: "Emily Chen",
      agentPhone: "(555) 246-8135",
      price: 1800,
      availableSlots: ["10:30 AM", "1:30 PM", "4:30 PM"]
    }
  ]);

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        location: "",
        date: "",
        propertyType: "",
        priceRange: ""
      });
    } else if (key === 'search') {
      console.log("Searching with filters:", filters);
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleBookAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (bookingDetails) => {
    console.log("Booking confirmed:", bookingDetails);
    alert(`Appointment booked successfully!\n\nProperty: ${bookingDetails.propertyTitle}\nDate: ${bookingDetails.selectedDate}\nTime: ${bookingDetails.selectedTime}\nType: ${bookingDetails.visitType}`);
    setShowBookingModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">PropertyFinder</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Book Your Property Viewing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Schedule appointments to view your favorite properties. Choose a convenient time slot and meet with our professional agents.
          </p>
        </div>

        {/* Search Filters */}
        <SearchFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />

        {/* Results Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Available Appointments
              <span className="text-gray-600 text-lg ml-2">
                ({appointments.length} properties)
              </span>
            </h3>
            <select className="px-3 py-2 border border-gray-300 rounded-md">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Soonest Available</option>
            </select>
          </div>

          {/* Appointments Grid */}
          {appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment.id}
                  appointment={appointment}
                  onBook={handleBookAppointment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No appointments available matching your criteria.</p>
              <button 
                onClick={() => handleFilterChange('reset', null)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-lg p-6 mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Book With Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Professional Agents</h4>
              <p className="text-gray-600 text-sm">Meet with experienced real estate professionals who know the market.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Flexible Scheduling</h4>
              <p className="text-gray-600 text-sm">Choose from multiple time slots that fit your busy schedule.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Virtual Options</h4>
              <p className="text-gray-600 text-sm">Can't visit in person? Book a virtual tour from anywhere.</p>
            </div>
          </div>
        </div>
      </div>
              <div className="bg-blue-50 rounded-lg p-6 mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Book With Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Professional Agents</h4>
              <p className="text-gray-600 text-sm">Meet with experienced real estate professionals who know the market.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Flexible Scheduling</h4>
              <p className="text-gray-600 text-sm">Choose from multiple time slots that fit your busy schedule.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Virtual Options</h4>
              <p className="text-gray-600 text-sm">Can't visit in person? Book a virtual tour from anywhere.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBookingModal(false)}></div>
          <div className="relative z-10">
            <BookingModal
              appointment={selectedAppointment}
              onClose={() => setShowBookingModal(false)}
              onConfirm={handleConfirmBooking}
            />
          </div>
        </div>
      )}
    </div>
  );
}


































