import { useState, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppContent from "./AppContent";
import SplashScreen from "./layouts/SplashScreen";
import Navbar from "./components/navBars/NavBar1";
import Welcome from "./pages/welcome";

export default function App() {
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // splash duration (1.5 seconds)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      {loading ? <SplashScreen /> : <AppContent />}
    </BrowserRouter>
  );
 
}
