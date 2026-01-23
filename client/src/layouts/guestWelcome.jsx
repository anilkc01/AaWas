import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navBars/GuestNavBar";
import Welcome from "../pages/welcome";
import AboutUs from "../pages/aboutUs";
import LoginModal from "../components/AuthModals/LoginModal";
import RegisterModal from "../components/AuthModals/RegistrationModal";
import GuestBrowse from "../pages/guestBrowse";
import ForgotPasswordModal from "../components/AuthModals/forgotPasword";



export default function GuestPage({ onLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  
  const searchParams = new URLSearchParams(location.search);
  const modalType = searchParams.get("modal"); 

  const isAboutUs = location.pathname === "/about-us";
  const isBrowse = location.pathname === "/browse";
  
  const isLogin = modalType === "login";
  const isRegister = modalType === "register";
  const isForgotPassword = modalType === "forgotPassword";
  const showModal = isLogin || isRegister || isForgotPassword;

  
const closeModal = () => {
    navigate(location.pathname, { replace: true });
  };

  return (
    <>
      <div className={showModal ? "filter blur-sm pointer-events-none" : ""}>
        <Navbar />
        {/* Now these stay TRUE even when the modal is open! */}
        {isAboutUs ? <AboutUs /> : isBrowse ? <GuestBrowse /> : <Welcome />}
      </div>

      {isLogin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20" onClick={closeModal}></div>
          <LoginModal onLoginSuccess={onLoginSuccess} />
        </div>
      )}

      {isRegister && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20" onClick={closeModal}></div>
          <RegisterModal />
        </div>
      )}
      {isForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/20" onClick={closeModal}></div>
          <ForgotPasswordModal />
        </div>
      )}
    </>
  );
}