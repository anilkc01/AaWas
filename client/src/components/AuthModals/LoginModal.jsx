import { X, Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { LoginSchema } from "./schema.login";

export default function LoginModal({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const closeModal = () => navigate("/");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, { id: "registration" });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrors({ email: "", password: "" });
    setFormError("");

    const result = LoginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!field) return;
        fieldErrors[field] = issue.message;
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/auth/login", {
        ...formData,
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
      navigate("/", { state: { message: "Welcome !" } });
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors((prev) => ({ ...prev, ...err.response.data.errors }));
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message, { id: "aaa" });
      } else {
        setFormError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative bg-white rounded-2xl shadow-2xl
        w-[400px] max-w-[95vw]
        p-8 box-border
        flex flex-col gap-5
      "
    >
      {/* Close */}
      <button
        onClick={closeModal}
        className="absolute top-5 right-5 text-gray-500 hover:text-black transition-colors"
      >
        <X size={24} />
      </button>

      {/* Logo */}
      <div className="flex justify-center">
        <img
          src="/logoRound.png"
          className="w-[84px] h-[84px] rounded-full border-2 shadow-md"
          alt="logo"
        />
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800">
        Login to your account
      </h2>

      {formError && (
        <p className="text-[14px] font-bold text-red-600 text-center bg-red-50 p-2 rounded">
          {formError}
        </p>
      )}

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-gray-700 ml-1">Email Address</label>
        <input
          type="email"
          name="email"
          maxLength={30}
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-3 text-[16px] font-medium bg-gray-50 border-b-2 focus:outline-none transition-all ${
            errors.email
              ? "border-red-500"
              : "border-gray-200 focus:border-[#B59353]"
          }`}
        />
        {errors.email && (
          <p className="text-[13px] font-bold text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-bold text-gray-700 ml-1">Password</label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-3 pr-12 text-[16px] font-medium bg-gray-50 border-b-2 focus:outline-none transition-all ${
              errors.password
                ? "border-red-500"
                : "border-gray-200 focus:border-[#B59353]"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-gray-500 hover:text-[#B59353]"
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[13px] font-bold text-red-500 mt-1">{errors.password}</p>
        )}
      </div>

      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-5 h-5 cursor-pointer accent-[#B59353]"
          />
          <label
            htmlFor="rememberMe"
            className="text-[14px] font-bold text-gray-600 cursor-pointer"
          >
            Remember me
          </label>
        </div>
        <p
          onClick={() => navigate("/forgot-password")}
          className="text-[14px] font-bold text-[#B59353] cursor-pointer hover:underline"
        >
          Forgot password?
        </p>
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-[#B59353] hover:bg-[#a68546]
          text-white py-4 rounded-xl text-[16px] font-bold
          transition-all transform active:scale-[0.98] shadow-lg disabled:opacity-50"
      >
        {loading ? "Logging in..." : "LOG IN"}
      </button>

      <p className="text-[14px] font-medium text-center text-gray-600 mt-2">
        Don't have an account?
        <span
          onClick={() => navigate("/register")}
          className="text-[#B59353] font-bold ml-2 cursor-pointer hover:underline"
        >
          Register here
        </span>
      </p>
    </div>
  );
}