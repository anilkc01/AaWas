import { X, Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function LoginModal({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const closeModal = () => navigate("/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    
    if (location.state?.message) {
      toast.success(location.state.message, {id:"registration"});
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrors({ email: "", password: "" });
      setFormError("");

      const res = await api.post("/api/auth/login", {
        email,
        password,
        rememberMe,
      });

      const { token, user } = res.data;

      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      onLoginSuccess?.();
      navigate("/");
      navigate("/", { state: { message: 'Welcome !' } })
    } catch (err) {
      // unchanged error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative bg-white rounded-2xl shadow-xl
        w-[320px] max-w-[92vw]
        p-6 box-border
        flex flex-col gap-3
      "
    >
      {/* Close */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-black"
      >
        <X size={18} />
      </button>

      {/* Logo */}
      <div className="flex justify-center pt-2">
        <img
          src="/logoRound.png"
          className="w-[72px] h-[72px] rounded-full border shadow-sm"
          alt="logo"
        />
      </div>

      <h2 className="text-[16px] font-semibold text-center mt-1">
        Login to your account
      </h2>
      

      {formError && (
        <p className="text-[12px] text-red-600 text-center">{formError}</p>
      )}

      {/* Email */}
      <div className="flex flex-col gap-1">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full px-3 py-2 text-[14px] bg-transparent border-b focus:outline-none ${
            errors.email
              ? "border-red-500"
              : "border-gray-300 focus:border-[#B59353]"
          }`}
        />
        {errors.email && (
          <p className="text-[12px] text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 pr-10 text-[14px] bg-transparent border-b focus:outline-none ${
              errors.password
                ? "border-red-500"
                : "border-gray-300 focus:border-[#B59353]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-gray-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[12px] text-red-500">{errors.password}</p>
        )}
      </div>

      <p
        onClick={() => navigate("/forgot-password")}
        className="text-[12px] text-[#B59353] cursor-pointer hover:underline text-right"
      >
        Forgot password?
      </p>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="w-4 h-4 cursor-pointer"
        />
        <label
          htmlFor="rememberMe"
          className="text-[12px] text-gray-600 cursor-pointer"
        >
          Remember me
        </label>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-[#B59353] hover:bg-[#a68546]
          text-white py-2 rounded-full text-[14px]
          transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <p className="text-[12px] text-center text-gray-600">
        Don't have an account?
        <span
          onClick={() => navigate("/register")}
          className="text-[#B59353] ml-1 cursor-pointer hover:underline"
        >
          Register here
        </span>
      </p>
    </div>
  );
}
