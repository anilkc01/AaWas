import { X, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginModal() {
  const navigate = useNavigate();
  const closeModal = () => navigate("/");

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative bg-white rounded-2xl shadow-xl p-3 w-[196px] max-w-[90%]">

        {/* Close Button */}
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

        {/* Header */}
        <h2 className="text-[11px] font-semibold text-center mb-2">
          Login to your account
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border-b border-gray-300 px-2 py-1 mb-2 text-[10px]
            focus:outline-none focus:border-[#B59353] bg-transparent"
        />

        {/* Password */}
        <div className="relative mb-1.5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border-b border-gray-300 px-2 py-1 pr-7 text-[10px]
              focus:outline-none focus:border-[#B59353] bg-transparent"
          />

          {/* Eye Toggle */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
          >
            {showPassword ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
        </div>

        <div className="text-right text-[8px] text-gray-700 mb-2 cursor-pointer hover:underline">
          Forgot Password?
        </div>

        {/* Login Button */}
        <button className="w-full bg-[#B59353] hover:bg-[#a68546] text-white py-1 rounded-full text-[10px] transition">
          Log In
        </button>

        {/* Footer */}
        <p className="mt-2 text-[8px] text-center text-gray-600">
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
