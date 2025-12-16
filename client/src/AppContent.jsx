import {  useLocation } from "react-router-dom";
import Navbar from "./components/NavBar1";
import Welcome from "./pages/welcome";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegistrationModal";
import AboutUs from "./pages/aboutUs";

export default function AppContent() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";
  const isAboutUs = location.pathname === "/about-us";

  const showModal = isLogin || isRegister;

  return (
    <>
      <div className={showModal ? "filter blur-sm pointer-events-none" : ""}>
        <Navbar />
        {isAboutUs ? <AboutUs /> : <Welcome />}
        
      </div>
      
      {isLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20"></div>
          <LoginModal />
        </div>
      )}
      
      {isRegister && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20"></div>
          <RegisterModal />
        </div>
      )}
    </>
  );
}