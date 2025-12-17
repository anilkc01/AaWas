import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, MapPin } from 'lucide-react';
import api from '../../api/axios';

export  const AddPropertyDialog = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    propertyType: '',
    listedFor: '',
    price: '',
    location: '',
    latitude: null,
    longitude: null,
    description: '',
    beds: 1,
    living: 1,
    kitchen: 1,
    dpImage: null,
    images: [],
    isBidding: false
  });

  const [dpImagePreview, setDpImagePreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        propertyType: '',
        listedFor: '',
        price: '',
        location: '',
        latitude: null,
        longitude: null,
        description: '',
        beds: 1,
        living: 1,
        kitchen: 1,
        dpImage: null,
        images: [],
        isBidding: false
      });
      setDpImagePreview(null);
      setImagePreviews([]);
      setShowMap(false);
      setError(null);
      
      if (markerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    }
  }, [isOpen]);

  // Load Leaflet CSS and JS
  useEffect(() => {
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Initialize OpenStreetMap
  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current && window.L) {
      const defaultLocation = [27.7172, 85.3240]; // Kathmandu
      
      mapInstanceRef.current = window.L.map(mapRef.current).setView(
        formData.latitude && formData.longitude 
          ? [formData.latitude, formData.longitude]
          : defaultLocation,
        13
      );

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add click listener
      mapInstanceRef.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));

        // Remove old marker if exists
        if (markerRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current);
        }

        // Add new marker
        markerRef.current = window.L.marker([lat, lng]).addTo(mapInstanceRef.current);

        // Reverse geocode using Nominatim
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          if (data.display_name) {
            setFormData(prev => ({
              ...prev,
              location: data.display_name
            }));
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
      });

      // Add existing marker if coordinates exist
      if (formData.latitude && formData.longitude) {
        markerRef.current = window.L.marker([formData.latitude, formData.longitude])
          .addTo(mapInstanceRef.current);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMap]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDpImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, dpImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setDpImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validation
    if (!formData.dpImage) {
      setError("Display image is required");
      return;
    }

    if (!formData.propertyType || !formData.listedFor) {
      setError("Please select property type and listing type");
      return;
    }

    if (!formData.price) {
      setError("Price is required");
      return;
    }

    if (!formData.location) {
      setError("Location is required");
      return;
    }

    if (!formData.description) {
      setError("Description is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = new FormData();
      
      data.append('propertyType', formData.propertyType);
      data.append('listedFor', formData.listedFor);
      data.append('price', formData.price);
      data.append('location', formData.location);
      
      if (formData.latitude) data.append('latitude', formData.latitude);
      if (formData.longitude) data.append('longitude', formData.longitude);
      
      data.append('description', formData.description);
      data.append('beds', formData.beds);
      data.append('living', formData.living);
      data.append('kitchen', formData.kitchen);
      data.append('isBidding', formData.isBidding);
      
      data.append('dpImage', formData.dpImage);
      
      formData.images.forEach((image) => {
        data.append('images', image);
      });

      const response = await api.post('/api/properties/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      alert("Property created successfully!");
      onSubmit(response.data);
      onClose();
      
    } catch (err) {
      console.error('Error creating property:', err);
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add New Property</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Display Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Picture <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleDpImageChange}
                className="hidden"
                id="dpImage"
                required
              />
              <label
                htmlFor="dpImage"
                className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                {dpImagePreview ? (
                  <img src={dpImagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-500">Tap to add display picture</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Property Type & Listing Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="" disabled>Property Type : *</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="room">Room</option>
              </select>
            </div>

            <div>
              <select
                name="listedFor"
                value={formData.listedFor}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="" disabled>Listing Type : *</option>
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
              </select>
            </div>
          </div>

          {/* Bidding Toggle */}
          <div className="flex items-center justify-between py-2 border-b">
            <label className="text-sm font-medium text-gray-700">
              Bid
            </label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isBidding: !prev.isBidding }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isBidding ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isBidding ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price <span className="text-red-500">*</span> {formData.listedFor === 'rent' && <span className="text-gray-500 text-xs">(per month)</span>}
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              placeholder="Enter price"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.isBidding && (
              <p className="text-xs text-blue-600 mt-1">
                This price will be used as the minimum starting price for bidding
              </p>
            )}
          </div>

          {/* Location with Map */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Enter location or select on map"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <MapPin size={18} />
                {showMap ? 'Hide' : 'Map'}
              </button>
            </div>
            
            {showMap && (
              <div className="mt-3">
                <div 
                  ref={mapRef} 
                  className="w-full h-64 rounded-lg border border-gray-300"
                  style={{ minHeight: '250px' }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Click on the map to select exact location
                  {formData.latitude && formData.longitude && (
                    <span className="ml-2 text-blue-600">
                      ({formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Room Counts */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Living <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="living"
                value={formData.living}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Bed <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Kitchen <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="kitchen"
                value={formData.kitchen}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Enter property description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Photos (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="hidden"
              id="images"
            />
            <label
              htmlFor="images"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm"
            >
              <Plus size={18} className="mr-2" />
              Add photos
            </label>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

