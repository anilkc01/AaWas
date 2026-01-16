import React from 'react';
import { Link } from 'react-router-dom';

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <main className="p-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-bold mb-4">Property Listings</h2>
          <p className="text-gray-500">List of pending and active properties will be here.</p>
        </div>
      </main>
    </div>
  );
}