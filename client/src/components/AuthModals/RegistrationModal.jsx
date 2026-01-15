import { X, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";
import {
  RegistrationFieldsSchema,
  RegistrationSchema,
} from "./schema.registration";

export default function RegisterModal() {
  const navigate = useNavigate();
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

    setFormData({
      ...formData,
      [name]: limitedVal,
    });
  } else {
    // Logic for other fields
    setFormData({
      ...formData,
      [name]: value,
    });
  }
};


  const handleSubmit = async () => {
    setLoading(true);

    // clear previous errors
    setErrors({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    });

    const result = RegistrationSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!field) return;

        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }

        fieldErrors[field].push(issue.message);
      });

      setErrors((prev) => ({
        ...prev,
        ...fieldErrors,
      }));

      setLoading(false);
      return;
    }

    try {
      await api.post("/api/auth/register", formData);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } })
    } catch (err) {
      if (err.response?.data?.errors) {
        // backend field-level validation
        setErrors((prev) => ({
          ...prev,
          ...err.response.data.errors,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          rePassword: "Network error. Please try again.",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-[999]">
      <div
        className="
          relative bg-white rounded-2xl shadow-xl
          w-[360px] max-w-[92vw]
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
            className="w-[72px] h-[72px] rounded-full border shadow-sm object-cover"
            alt="logo"
          />
        </div>

        <h2 className="text-[16px] font-semibold text-center">
          Create your account
        </h2>

        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-[14px] bg-transparent border-b focus:outline-none ${
              errors.fullName
                ? "border-red-500"
                : "border-gray-300 focus:border-[#B59353]"
            }`}
          />
          {errors.fullName && (
            <p className="text-[12px] text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
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

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <input
            type="tel"
            name="phone"
            maxLength={10} 
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-[14px] bg-transparent border-b focus:outline-none ${
              errors.phone
                ? "border-red-500"
                : "border-gray-300 focus:border-[#B59353]"
            }`}
          />
          {errors.phone && (
            <p className="text-[12px] text-red-500">{errors.phone}</p>
          )}
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
            <ul className="text-[8px] text-red-500 mb-1">
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
              placeholder="Re-enter Password"
              value={formData.rePassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 pr-10 text-[14px] bg-transparent border-b focus:outline-none ${
                errors.rePassword
                  ? "border-red-500"
                  : "border-gray-300 focus:border-[#B59353]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowRePassword(!showRePassword)}
              className="absolute right-3 text-gray-600"
            >
              {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.rePassword && (
            <p className="text-[12px] text-red-500">{errors.rePassword}</p>
          )}
        </div>

        {/* Register button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#B59353] hover:bg-[#a68546]
            text-white py-2 rounded-full text-[14px]
            transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-[12px] text-center text-gray-600">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-[#B59353] ml-1 cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
