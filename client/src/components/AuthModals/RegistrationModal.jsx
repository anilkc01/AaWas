import { X, Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";
import { RegistrationSchema } from "./schema.registration";

export default function RegisterModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const closeModal = () => navigate("/");

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      const limitedVal = onlyNums.slice(0, 10);
      setFormData({ ...formData, [name]: limitedVal });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({
      fullName: "", email: "", phone: "", password: "", rePassword: "",
    });

    const result = RegistrationSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!field) return;
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      });
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      setLoading(false);
      return;
    }

    try {
      await api.post("/api/auth/register", formData);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors((prev) => ({ ...prev, ...err.response.data.errors }));
      } else {
        setErrors((prev) => ({ ...prev, rePassword: "Network error. Please try again." }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[999]">
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
            className="w-[84px] h-[84px] rounded-full border-2 shadow-md object-cover"
            alt="logo"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create your account
        </h2>

        {/* Form Container with slightly more gap */}
        <div className="flex flex-col gap-4">
          
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <input
              type="text"
              name="fullName"
              maxLength={30}
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-[16px] font-medium bg-gray-50 border-b-2 focus:outline-none transition-all ${
                errors.fullName ? "border-red-500" : "border-gray-200 focus:border-[#B59353]"
              }`}
            />
            {errors.fullName && <p className="text-[13px] font-bold text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <input
              type="email"
              name="email"
              maxLength={30}
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-[16px] font-medium bg-gray-50 border-b-2 focus:outline-none transition-all ${
                errors.email ? "border-red-500" : "border-gray-200 focus:border-[#B59353]"
              }`}
            />
            {errors.email && <p className="text-[13px] font-bold text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <input
              type="tel"
              name="phone"
              maxLength={10} 
              placeholder="Phone Number (10 digits)"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-[16px] font-medium bg-gray-50 border-b-2 focus:outline-none transition-all ${
                errors.phone ? "border-red-500" : "border-gray-200 focus:border-[#B59353]"
              }`}
            />
            {errors.phone && <p className="text-[13px] font-bold text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 text-[16px] font-medium bg-gray-50 border-b-2 focus:outline-none transition-all ${
                  errors.password ? "border-red-500" : "border-gray-200 focus:border-[#B59353]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-500"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            {errors.password && (
              <ul className="text-[11px] font-bold text-red-500 mt-1 space-y-0.5">
                {errors.password.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Re-password */}
          <div className="flex flex-col gap-1">
            <div className="relative flex items-center">
              <input
                type={showRePassword ? "text" : "password"}
                name="rePassword"
                placeholder="Confirm Password"
                value={formData.rePassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 text-[16px] font-medium bg-gray-50 border-b-2 focus:outline-none transition-all ${
                  errors.rePassword ? "border-red-500" : "border-gray-200 focus:border-[#B59353]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute right-4 text-gray-500"
              >
                {showRePassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
            {errors.rePassword && <p className="text-[13px] font-bold text-red-500 mt-1">{errors.rePassword}</p>}
          </div>
        </div>

        {/* Register button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#B59353] hover:bg-[#a68546]
            text-white py-4 rounded-xl text-[18px] font-bold
            transition-all transform active:scale-[0.98] shadow-lg disabled:opacity-50 mt-2"
        >
          {loading ? "Creating Account..." : "REGISTER"}
        </button>

        <p className="text-[14px] font-medium text-center text-gray-600">
          Already have an account?
          <span
            onClick={() => navigate(`${location.pathname}?modal=login`)}
            className="text-[#B59353] font-bold ml-2 cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}