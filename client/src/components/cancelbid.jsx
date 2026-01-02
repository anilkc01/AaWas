import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';

export const CancelBidDialog = ({ isOpen, onClose, property, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reason, setReason] = useState('');

  const handleCancel = async () => {
    if (!property) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.patch(`/api/properties/${property.id}/cancel-bid`, {
        reason: reason || 'Property owner cancelled bidding'
      });

      alert('Bidding cancelled successfully!');
      onCancel(response.data);
      onClose();
      
    } catch (err) {
      console.error('Error cancelling bid:', err);
      setError(err.response?.data?.message || 'Failed to cancel bidding');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[999] p-2">
      <div className="bg-white rounded-2xl shadow-xl w-[280px] max-w-[90%]">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-100 px-3 py-2 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-red-600" />
            <h2 className="text-xs font-semibold text-red-900">Cancel Bidding</h2>
          </div>
          <button onClick={onClose} className="text-red-600 hover:text-red-700">
            <X size={14} />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1.5 rounded-lg text-[9px]">
              {error}
            </div>
          )}

          {/* Property Info */}
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-[9px] font-medium text-gray-900">{property.location}</p>
            <p className="text-[8px] text-gray-600 mt-0.5">
              {property.propertyType} • {property.listedFor}
            </p>
            <p className="text-[9px] font-semibold text-red-600 mt-1">
              Rs. {property.price?.toLocaleString()}
            </p>
          </div>

          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <p className="text-[9px] text-yellow-800 font-medium mb-1">
              ⚠️ Warning
            </p>
            <p className="text-[8px] text-yellow-700">
              Cancelling will:
            </p>
            <ul className="list-disc list-inside text-[8px] text-yellow-700 mt-0.5 space-y-0.5">
              <li>Close all active bids</li>
              <li>Notify all bidders</li>
              <li>Change property to regular listing</li>
            </ul>
          </div>

          {/* Reason (Optional) */}
          <div>
            <label className="block text-[9px] font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="2"
              placeholder="Why are you cancelling bidding?"
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 resize-none text-[9px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[9px]"
            >
              Keep Bidding
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-[9px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Cancelling...
                </>
              ) : (
                'Cancel Bidding'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};