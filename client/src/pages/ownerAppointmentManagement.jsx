import { useState } from "react";

// Simple Navbar component
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Property Manager</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-gray-700 hover:text-blue-600">Dashboard</button>
          <button className="px-4 py-2 text-gray-700 hover:text-blue-600">Properties</button>
          <button className="px-4 py-2 text-gray-700 hover:text-blue-600">Appointments</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Logout</button>
        </div>
      </div>
    </nav>
  );
};

// Appointment card component
const AppointmentCard = ({ appointment, onUpdateStatus, onCancel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{appointment.propertyTitle}</h3>
            <p className="text-gray-600 text-sm">{appointment.propertyAddress}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
        
        <div className="mb-3 space-y-2">
          <div className="flex items-center text-gray-700 text-sm">
            <span className="font-medium mr-2">Guest:</span>
            <span>{appointment.guestName}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <span className="font-medium mr-2">Contact:</span>
            <span>{appointment.guestPhone}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <span className="font-medium mr-2">Email:</span>
            <span>{appointment.guestEmail}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <span className="font-medium mr-2">Date:</span>
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <span className="font-medium mr-2">Time:</span>
            <span>{appointment.time}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="mb-3 p-2 bg-gray-50 rounded">
            <p className="text-gray-700 text-sm"><span className="font-medium">Notes:</span> {appointment.notes}</p>
          </div>
        )}

        {appointment.status === 'pending' && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Confirm
            </button>
            <button
              onClick={() => onCancel(appointment.id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Decline
            </button>
          </div>
        )}

        {appointment.status === 'confirmed' && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onUpdateStatus(appointment.id, 'completed')}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Mark Complete
            </button>
            <button
              onClick={() => onCancel(appointment.id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Filter component for appointments
const AppointmentFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
          <input
            type="text"
            placeholder="Search property"
            value={filters.property}
            onChange={(e) => onFilterChange('property', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange('dateTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          onClick={() => onFilterChange('apply', null)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

// Stats card component
const StatsCard = ({ title, count, color }) => {
  return (
    <div className={`${color} rounded-lg p-4 shadow-md`}>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{count}</p>
    </div>
  );
};

// Main OwnerAppointmentManagement component
export default function OwnerAppointmentManagement() {
  // Initial filters state
  const [filters, setFilters] = useState({
    status: "",
    property: "",
    dateFrom: "",
    dateTo: ""
  });

  // Mock data - replace with actual API call
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      propertyTitle: "Modern Apartment in Downtown",
      propertyAddress: "123 Main St, New York, NY",
      guestName: "John Smith",
      guestPhone: "+1 (555) 123-4567",
      guestEmail: "john.smith@email.com",
      date: "2026-01-20",
      time: "2:00 PM",
      status: "pending",
      notes: "Interested in viewing the apartment and discussing lease terms."
    },
    {
      id: 2,
      propertyTitle: "Luxury Villa with Pool",
      propertyAddress: "456 Luxury Ln, Los Angeles, CA",
      guestName: "Sarah Johnson",
      guestPhone: "+1 (555) 987-6543",
      guestEmail: "sarah.j@email.com",
      date: "2026-01-22",
      time: "10:00 AM",
      status: "confirmed",
      notes: "Looking for long-term rental options."
    },
    {
      id: 3,
      propertyTitle: "Cozy Studio Apartment",
      propertyAddress: "789 Oak Ave, Chicago, IL",
      guestName: "Mike Davis",
      guestPhone: "+1 (555) 456-7890",
      guestEmail: "mike.davis@email.com",
      date: "2026-01-18",
      time: "3:30 PM",
      status: "completed",
      notes: "First-time renter, showed property successfully."
    },
    {
      id: 4,
      propertyTitle: "Downtown Loft",
      propertyAddress: "321 Broadway, Seattle, WA",
      guestName: "Emma Wilson",
      guestPhone: "+1 (555) 234-5678",
      guestEmail: "emma.w@email.com",
      date: "2026-01-25",
      time: "1:00 PM",
      status: "pending",
      notes: "Prefers afternoon viewing times."
    },
    {
      id: 5,
      propertyTitle: "Beachfront Condo",
      propertyAddress: "555 Ocean Dr, Miami, FL",
      guestName: "Robert Brown",
      guestPhone: "+1 (555) 345-6789",
      guestEmail: "r.brown@email.com",
      date: "2026-01-21",
      time: "11:30 AM",
      status: "confirmed",
      notes: ""
    },
    {
      id: 6,
      propertyTitle: "Suburban Family Home",
      propertyAddress: "890 Maple St, Austin, TX",
      guestName: "Lisa Anderson",
      guestPhone: "+1 (555) 567-8901",
      guestEmail: "lisa.a@email.com",
      date: "2026-01-15",
      time: "4:00 PM",
      status: "cancelled",
      notes: "Guest cancelled due to schedule conflict."
    }
  ]);

  const [sortBy, setSortBy] = useState("date-newest");

  // Calculate stats
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length
  };

  // Filter handler
  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        status: "",
        property: "",
        dateFrom: "",
        dateTo: ""
      });
    } else if (key === 'apply') {
      console.log("Applying filters:", filters);
      // Here you would filter the appointments based on the filters
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  // Update appointment status
  const handleUpdateStatus = (id, newStatus) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  // Cancel appointment
  const handleCancelAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status: 'cancelled' } : app
        )
      );
    }
  };

  // Sort appointments
  const getSortedAppointments = () => {
    let sorted = [...appointments];
    switch (sortBy) {
      case "date-newest":
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case "date-oldest":
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "status":
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      case "property":
        return sorted.sort((a, b) => a.propertyTitle.localeCompare(b.propertyTitle));
      default:
        return sorted;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Appointment Management
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage all your property viewing appointments in one place. 
              Confirm, reschedule, or track appointment status easily.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Total Appointments" count={stats.total} color="bg-blue-50" />
            <StatsCard title="Pending" count={stats.pending} color="bg-yellow-50" />
            <StatsCard title="Confirmed" count={stats.confirmed} color="bg-green-50" />
            <StatsCard title="Completed" count={stats.completed} color="bg-purple-50" />
          </div>

          {/* Filters */}
          <AppointmentFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />

          {/* Results Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Appointments
                <span className="text-gray-600 text-lg ml-2">
                  ({appointments.length} total)
                </span>
              </h2>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="date-newest">Sort by: Date (Newest)</option>
                <option value="date-oldest">Date (Oldest)</option>
                <option value="status">Status</option>
                <option value="property">Property Name</option>
              </select>
            </div>

            {/* Appointments Grid */}
            {appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getSortedAppointments().map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id} 
                    appointment={appointment}
                    onUpdateStatus={handleUpdateStatus}
                    onCancel={handleCancelAppointment}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 text-lg">No appointments found.</p>
                <button 
                  onClick={() => handleFilterChange('reset', null)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>    
        </div>
      </div>
    </div>
  );
}