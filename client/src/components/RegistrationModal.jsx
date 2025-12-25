import { X, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterModal() {
  const navigate = useNavigate();
  const closeModal = () => navigate("/");

  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const [formData, setFormData] = useState({
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
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      alert("Server error");
      console.error(error);
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

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border-b px-2 py-1 mb-2 text-[10px] focus:outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border-b px-2 py-1 mb-2 text-[10px] focus:outline-none"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border-b px-2 py-1 mb-2 text-[10px] focus:outline-none"
        />

        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border-b px-2 py-1 pr-7 text-[10px] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
        </div>

        <div className="relative mb-2">
          <input
            type={showRePassword ? "text" : "password"}
            name="rePassword"
            placeholder="Re-enter Password"
            value={formData.rePassword}
            onChange={handleChange}
            className="w-full border-b px-2 py-1 pr-7 text-[10px] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowRePassword(!showRePassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showRePassword ? <EyeOff size={11} /> : <Eye size={11} />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#B59353] text-white py-1 rounded-full text-[10px]"
        >
          Register
        </button>

        <p className="mt-2 text-[8px] text-center text-gray-600">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-[#B59353] ml-1 cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
