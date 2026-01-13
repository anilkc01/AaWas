import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, MapPin } from 'lucide-react';
import api from '../../../api/axios';

const API_BASE = process.env.REACT_APP_API_BASE;

export const AddPropertyDialog = ({ isOpen, onClose, onSubmit, property }) => {
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
    washroom: 1,
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

  // Load property data when editing
  useEffect(() => {
    if (isOpen && property) {
      // Editing mode - populate form with property data
      setFormData({
        propertyType: property.propertyType || '',
        listedFor: property.listedFor || '',
        price: property.price || '',
        location: property.location || '',
        latitude: property.latitude || null,
        longitude: property.longitude || null,
        description: property.description || '',
        beds: property.beds || 1,
        living: property.living || 1,
        kitchen: property.kitchen || 1,
        washroom: property.washroom || 1,
        dpImage: null, // Keep null, will use existing image
        images: [],
        isBidding: property.isBidding || false
      });

      // Set existing display image preview
      if (property.dpImage) {
        setDpImagePreview(`${API_BASE}/${property.dpImage}`);
      }

      // Set existing images preview
      if (property.images && property.images.length > 0) {
        setImagePreviews(property.images.map(img => `${API_BASE}/${img}`));
      }
    } else if (isOpen && !property) {
      // Adding mode - reset to empty form
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
        washroom: 1,
        dpImage: null,
        images: [],
        isBidding: false
      });
      setDpImagePreview(null);
      setImagePreviews([]);
    }
  }, [isOpen, property]);

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
        washroom: 1,
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
    if (!formData.dpImage && !property) {
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
      data.append('washroom', formData.washroom);
      data.append('isBidding', formData.isBidding);
      
      // Only append new display image if one was selected
      if (formData.dpImage) {
        data.append('dpImage', formData.dpImage);
      }
      
      // Only append new images if any were selected
      formData.images.forEach((image) => {
        if (image instanceof File) {
          data.append('images', image);
        }
      });

      let response;
      if (property) {
        // Update existing property
        response = await api.patch(`/api/properties/${property.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        alert("Property updated successfully!");
      } else {
        // Create new property
        response = await api.post('/api/properties/create', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        alert("Property created successfully!");
      }

      onSubmit(response.data);
      onClose();
      
    } catch (err) {
      console.error('Error saving property:', err);
      setError(err.response?.data?.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!property;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[999] p-2">
      <div className="bg-white rounded-2xl shadow-xl w-[280px] max-w-[90%] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-3 py-2 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xs font-semibold">
            {isEditing ? 'Edit Property' : 'Add Property'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={14} />
          </button>
        </div>

        <div className="p-3 space-y-2.5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1.5 rounded-lg text-[9px]">
              {error}
            </div>
          )}

          {/* Display Picture */}
          <div>
            <label className="block text-[9px] font-medium text-gray-700 mb-1">
              Display Picture {!isEditing && <span className="text-red-500">*</span>}
              {isEditing && <span className="text-gray-500">(leave empty to keep current)</span>}
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleDpImageChange}
                className="hidden"
                id="dpImage"
                required={!isEditing}
              />
              <label
                htmlFor="dpImage"
                className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                {dpImagePreview ? (
                  <img src={dpImagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-gray-400 mb-1" size={16} />
                    <p className="text-[8px] text-gray-500">Add picture</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Property Type & Listing Type */}
          <div className="grid grid-cols-2 gap-2">
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              required
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-[9px] text-gray-700"
            >
              <option value="" disabled>Type *</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="room">Room</option>
            </select>

            <select
              name="listedFor"
              value={formData.listedFor}
              onChange={handleInputChange}
              required
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-[9px] text-gray-700"
            >
              <option value="" disabled>For *</option>
              <option value="sell">Sell</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          {/* Bidding Toggle */}
          <div className="flex items-center justify-between py-1.5 border-b">
            <label className="text-[9px] font-medium text-gray-700">
              Enable Bidding
            </label>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, isBidding: !prev.isBidding }))}
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                formData.isBidding ? 'bg-red-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  formData.isBidding ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Price */}
          <div>
            <label className="block text-[9px] font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span> {formData.listedFor === 'rent' && <span className="text-gray-500">(monthly)</span>}
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              placeholder="Enter price"
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-[9px]"
            />
            {formData.isBidding && (
              <p className="text-[8px] text-blue-600 mt-0.5">
                Starting bid price
              </p>
            )}
          </div>

          {/* Location with Map */}
          <div>
            <label className="block text-[9px] font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Enter location"
                className="flex-1 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-[9px]"
              />
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <MapPin size={11} />
                <span className="text-[8px]">{showMap ? 'Hide' : 'Map'}</span>
              </button>
            </div>
            
            {showMap && (
              <div className="mt-2">
                <div 
                  ref={mapRef} 
                  className="w-full h-32 rounded-lg border border-gray-300"
                />
                <p className="text-[7px] text-gray-500 mt-1">
                  Click map to select location
                  {formData.latitude && formData.longitude && (
                    <span className="ml-1 text-blue-600">
                      ({formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Room Counts */}
          <div className="grid grid-cols-4 gap-1.5">
            <div>
              <label className="block text-[8px] text-gray-600 mb-0.5">Living *</label>
              <input
                type="number"
                name="living"
                value={formData.living}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-1.5 py-1 border border-gray-300 rounded text-[9px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[8px] text-gray-600 mb-0.5">Bed *</label>
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-1.5 py-1 border border-gray-300 rounded text-[9px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[8px] text-gray-600 mb-0.5">Kitchen *</label>
              <input
                type="number"
                name="kitchen"
                value={formData.kitchen}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-1.5 py-1 border border-gray-300 rounded text-[9px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-[8px] text-gray-600 mb-0.5">Bath *</label>
              <input
                type="number"
                name="washroom"
                value={formData.washroom}
                onChange={handleInputChange}
                min="1"
                required
                className="w-full px-1.5 py-1 border border-gray-300 rounded text-[9px] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[9px] font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="3"
              placeholder="Property description"
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-[9px]"
            />
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-[9px] font-medium text-gray-700 mb-1">
              More Photos (Optional)
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
              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-[9px]"
            >
              <Plus size={11} className="mr-1" />
              Add photos
            </label>
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-1 mt-1.5">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-12 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[9px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-[9px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isEditing ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                isEditing ? 'Update' : 'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};