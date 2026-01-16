import { useState, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppContent from "./AppContent";
import SplashScreen from "./layouts/SplashScreen";
import "leaflet/dist/leaflet.css";



export default function App() {
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // splash duration (1.5 seconds)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>

    <Toaster />
      {loading ? <SplashScreen /> : <AppContent />}
    </BrowserRouter>
  );
 
}
