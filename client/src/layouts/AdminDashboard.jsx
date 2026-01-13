import { useState } from "react";



export default function AdminDashboard({ onLogout }) {
  const [view, setView] = useState("browse"); // "browse" | "my"

  return (
    <div className="flex h-screen">
    
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
          {/* Admin dashboard content goes here */}
        </main>
  
    </div>
  );
}
