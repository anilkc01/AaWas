import React from 'react';
import { Link } from 'react-router-dom';

export default function KycPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      <main className="p-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-bold mb-4">Pending Verifications</h2>
          <p className="text-gray-500">User documents and approval controls go here.</p>
        </div>
      </main>
    </div>
  );
}