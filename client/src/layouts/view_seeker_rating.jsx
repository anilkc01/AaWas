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