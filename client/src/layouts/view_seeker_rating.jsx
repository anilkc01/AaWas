import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, MapPin } from 'lucide-react';
import api from '../../api/axios';

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
         
            import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus, MapPin } from 'lucide-react';
import api from '../../api/axios';

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
         