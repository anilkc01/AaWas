import React from 'react';
import { Link } from 'react-router-dom';

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Content */}
      <main className="p-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-bold mb-4">All Registered Users</h2>
          <p className="text-gray-500">Table of users will be implemented here.</p>
        </div>
      </main>
    </div>
  );
}