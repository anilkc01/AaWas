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

  // --- LOGIC: Removal and Fetch ---
  const removeGalleryImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    if (isOpen && property) {
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
        dpImage: null,
        images: [],
        isBidding: property.isBidding || false
      });
      if (property.dpImage) setDpImagePreview(`${API_BASE}/${property.dpImage}`);
      if (property.images && property.images.length > 0) {
        setImagePreviews(property.images.map(img => `${API_BASE}/${img}`));
      }
    } else if (isOpen && !property) {
      setFormData({
        propertyType: '', listedFor: '', price: '', location: '', latitude: null, longitude: null,
        description: '', beds: 1, living: 1, kitchen: 1, washroom: 1, dpImage: null, images: [], isBidding: false
      });
      setDpImagePreview(null);
      setImagePreviews([]);
    }
  }, [isOpen, property]);

  useEffect(() => {
    if (!isOpen) {
      setShowMap(false);
      setError(null);
      if (markerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    }
  }, [isOpen]);

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

  useEffect(() => {
    if (showMap && mapRef.current && !mapInstanceRef.current && window.L) {
      const defaultLocation = [27.7172, 85.3240];
      mapInstanceRef.current = window.L.map(mapRef.current).setView(
        formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : defaultLocation, 13
      );
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current);

      mapInstanceRef.current.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
        if (markerRef.current) mapInstanceRef.current.removeLayer(markerRef.current);
        markerRef.current = window.L.marker([lat, lng]).addTo(mapInstanceRef.current);

        // ORIGINAL FETCH LOGIC
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await response.json();
          if (data.display_name) setFormData(prev => ({ ...prev, location: data.display_name }));
        } catch (error) { console.error('Geocoding error:', error); }
      });

      if (formData.latitude && formData.longitude) {
        markerRef.current = window.L.marker([formData.latitude, formData.longitude]).addTo(mapInstanceRef.current);
      }
    }
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [showMap]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDpImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, dpImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setDpImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'dpImage') data.append(key, formData[key]);
      });
      if (formData.dpImage) data.append('dpImage', formData.dpImage);
      formData.images.forEach((image) => { if (image instanceof File) data.append('images', image); });

      let response;
      if (property) {
        response = await api.patch(`/api/properties/${property.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        response = await api.post('/api/properties/create', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      onSubmit(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save property');
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;
  const isEditing = !!property;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[999] p-2 sm:p-4 lg:p-6">
      {/* Container: Responsive width/height */}
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[800px] max-h-[95vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Responsive Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 sm:px-8 sm:py-6 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-2xl font-black text-gray-900 tracking-tight">
            {isEditing ? 'Update Property' : 'Add New Property'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <X size={28} className="text-gray-500" />
          </button>
        </div>

        {/* Content: Scrollable + Responsive Spacing */}
        <div className="p-6 sm:p-8 space-y-6 sm:space-y-8 overflow-y-auto scrollbar-hide">
          {error && (
            <div className="bg-red-50 border-2 border-red-100 text-red-700 px-4 py-3 rounded-2xl font-black text-sm">{error}</div>
          )}

          {/* Responsive DP Upload */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-black text-gray-700 uppercase tracking-widest">Display Picture</label>
            <input type="file" accept="image/*" onChange={handleDpImageChange} className="hidden" id="dpImage" />
            <label htmlFor="dpImage" className="flex items-center justify-center w-full h-48 sm:h-64 border-4 border-dashed border-gray-100 rounded-[2rem] cursor-pointer hover:border-[#B59353] hover:bg-gray-50 transition-all overflow-hidden bg-gray-50">
              {dpImagePreview ? <img src={dpImagePreview} className="w-full h-full object-cover" /> : 
                <div className="text-center"><Upload className="mx-auto text-gray-300 mb-2" size={40} /><p className="text-sm font-black text-gray-400">Add Primary Photo</p></div>}
            </label>
          </div>

          {/* Type & Listed For */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-black text-gray-700 uppercase tracking-widest">Property Type</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-[#B59353] outline-none font-black text-gray-700 bg-white appearance-none">
                <option value="" disabled>Select Type</option>
                <option value="house">House</option><option value="apartment">Apartment</option><option value="room">Room</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-black text-gray-700 uppercase tracking-widest">Listed For</label>
              <select name="listedFor" value={formData.listedFor} onChange={handleInputChange} className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-[#B59353] outline-none font-black text-gray-700 bg-white appearance-none">
                <option value="" disabled>Select Purpose</option>
                <option value="sell">Sell</option><option value="rent">Rent</option>
              </select>
            </div>
          </div>

          {/* Bidding Toggle (RESTORED) */}
          <div className="flex items-center justify-between p-4 sm:p-5 bg-gray-50 rounded-2xl border-2 border-gray-100">
            <div>
              <label className="text-sm sm:text-base font-black text-gray-800">Enable Bidding</label>
              <p className="text-xs font-bold text-gray-400">Allow users to place offers</p>
            </div>
            <button type="button" onClick={() => setFormData(prev => ({ ...prev, isBidding: !prev.isBidding }))} className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${formData.isBidding ? 'bg-red-500' : 'bg-gray-300'}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.isBidding ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-black text-gray-700 uppercase tracking-widest">Price (NPR)</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-6 py-4 border-2 border-gray-100 rounded-2xl focus:border-[#B59353] outline-none font-black text-xl sm:text-2xl" placeholder="0.00" />
            {formData.isBidding && <p className="text-xs font-bold text-blue-600 pl-1">Starting bid price</p>}
          </div>

          {/* Location + Map */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-black text-gray-700 uppercase tracking-widest">Location</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="flex-1 px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-[#B59353] outline-none font-bold" placeholder="Address..."/>
              <button type="button" onClick={() => setShowMap(!showMap)} className="px-8 py-4 bg-[#B59353] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#a68546] transition-colors"><MapPin size={20}/> {showMap ? 'Hide' : 'Map'}</button>
            </div>
            {showMap && <div ref={mapRef} className="w-full h-64 sm:h-80 rounded-[2rem] border-2 border-gray-100 mt-4 overflow-hidden shadow-inner" />}
          </div>

          {/* Room Configuration (RESTORED) */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {['living', 'beds', 'kitchen', 'washroom'].map((room) => (
              <div key={room} className="space-y-1">
                <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase text-center tracking-wide">{room}</label>
                <input type="number" name={room} value={formData[room]} onChange={handleInputChange} min="0" className="w-full px-2 py-3 sm:py-4 border-2 border-gray-100 rounded-2xl font-black text-center text-lg outline-none focus:border-[#B59353]" />
              </div>
            ))}
          </div>

          {/* Description (RESTORED) */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-black text-gray-700 uppercase tracking-widest">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Highlight features..." className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl focus:border-[#B59353] outline-none font-bold resize-none text-sm sm:text-base" />
          </div>

          {/* Gallery with removal (X) */}
          <div className="space-y-4">
            <label className="text-xs sm:text-sm font-black text-gray-700 uppercase tracking-widest">Gallery Photos</label>
            <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" id="gallery" />
            <label htmlFor="gallery" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 font-black text-gray-400 transition-all text-sm sm:text-base"><Plus size={20}/> Add Photos</label>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 mt-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <img src={preview} className="w-full h-full object-cover rounded-2xl border-2 border-gray-50 shadow-sm" />
                  <button type="button" onClick={() => removeGalleryImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1.5 shadow-xl hover:scale-110 transition-all z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"><X size={14} strokeWidth={4}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Footer */}
        <div className="p-6 sm:px-10 sm:py-6 border-t bg-white sticky bottom-0 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 z-20">
          <button onClick={onClose} className="px-8 py-3 sm:py-4 border-2 border-gray-100 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all text-sm sm:text-base">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="px-8 sm:px-12 py-3 sm:py-4 bg-[#B59353] text-white rounded-2xl font-black hover:bg-[#a68546] disabled:opacity-50 transition-all shadow-xl shadow-[#B59353]/20 text-sm sm:text-base">
            {loading ? 'Processing...' : (isEditing ? 'Update Property' : 'Publish Property')}
          </button>
        </div>
      </div>
    </div>
  );
};