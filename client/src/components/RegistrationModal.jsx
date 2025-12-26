import { X, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axois";


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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // clear field error on change
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

 const handleSubmit = async () => {
  try {
    setLoading(true);

    // reset errors
    setErrors({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    });

    const res = await api.post("/api/auth/register", formData);

    // success
    navigate("/login");
  } catch (err) {
    if (err.response) {
      const { data } = err.response;

      // backend field-level errors
      if (data.errors) {
        setErrors((prev) => ({
          ...prev,
          ...data.errors,
        }));
      }
    } else {
      // network / server down
      setErrors({
        rePassword: "Network error. Please try again.",
      });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-[999]">
      <div className="relative bg-white rounded-2xl shadow-xl p-3 w-[196px] max-w-[90%]">
        {/* Close */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <X size={11} />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-1.5">
          <img
            src="/logoRound.png"
            className="w-[45px] h-[45px] rounded-full border shadow-sm object-cover"
            alt="logo"
          />
        </div>

        <h2 className="text-[11px] font-semibold text-center mb-2">
          Create your account
        </h2>

        {/* FULL NAME */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className={`w-full px-2 py-1 mb-1 text-[10px] bg-transparent border-b
            focus:outline-none
            ${
              errors.fullName
                ? "border-red-500"
                : "border-gray-300 focus:border-[#B59353]"
            }`}
        />
        {errors.fullName && (
          <p className="text-[8px] text-red-500 mb-1">{errors.fullName}</p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-2 py-1 mb-1 text-[10px] bg-transparent border-b
            focus:outline-none
            ${
              errors.email
                ? "border-red-500"
                : "border-gray-300 focus:border-[#B59353]"
            }`}
        />
        {errors.email && (
          <p className="text-[8px] text-red-500 mb-1">{errors.email}</p>
        )}

        {/* PHONE */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-2 py-1 mb-1 text-[10px] bg-transparent border-b
            focus:outline-none
            ${
              errors.phone
                ? "border-red-500"
                : "border-gray-300 focus:border-[#B59353]"
            }`}
        />
        {errors.phone && (
          <p className="text-[8px] text-red-500 mb-1">{errors.phone}</p>
        )}

        {/* PASSWORD */}
        <div className="relative mb-1">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-2 py-1 pr-7 text-[10px] bg-transparent border-b
              focus:outline-none
              ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:border-[#B59353]"
              }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[8px] text-red-500 mb-1">{errors.password}</p>
        )}

        {/* RE-PASSWORD */}
        <div className="relative mb-1">
          <input
            type={showRePassword ? "text" : "password"}
            name="rePassword"
            placeholder="Re-enter Password"
            value={formData.rePassword}
            onChange={handleChange}
            className={`w-full px-2 py-1 pr-7 text-[10px] bg-transparent border-b
              focus:outline-none
              ${
                errors.rePassword
                  ? "border-red-500"
                  : "border-gray-300 focus:border-[#B59353]"
              }`}
          />
          <button
            type="button"
            onClick={() => setShowRePassword(!showRePassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showRePassword ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
        </div>
        {errors.rePassword && (
          <p className="text-[8px] text-red-500 mb-2">
            {errors.rePassword}
          </p>
        )}

        {/* REGISTER BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#B59353] hover:bg-[#a68546]
            text-white py-1 rounded-full text-[10px]
            transition disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-2 text-[8px] text-center text-gray-600">
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
