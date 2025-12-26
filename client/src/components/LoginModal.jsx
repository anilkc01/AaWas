import { X, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axois";

export default function LoginModal() {
  const navigate = useNavigate();
  const closeModal = () => navigate("/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);



  // field-level errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

 const handleLogin = async () => {
  try {
    setLoading(true);
    setErrors({ email: "", password: "" });

    const res = await api.post("/api/auth/login", {
      email,
      password,
    });

    const data = res.data;

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard");
  } catch (err) {
    if (err.response) {
      const { status, data } = err.response;

      if (status === 401 && data.error === "EMAIL_NOT_FOUND") {
        setErrors({ email: "No account found with this email.", password: "" });
      }

      if (status === 401 && data.error === "INVALID_PASSWORD") {
        setErrors({ email: "", password: "Incorrect password." });
      }

      if (status === 400) {
        setErrors({
          email: !email ? "Please enter an email address." : "",
          password: !password ? "Please enter a password." : "",
        });
      }
    } else {
      setErrors({
        email: "",
        password: "Network error. Please try again.",
      });
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative bg-white rounded-2xl shadow-xl p-3 w-[196px] max-w-[90%]">
      {/* Close button */}
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
          className="w-[45px] h-[45px] rounded-full border shadow-sm"
          alt="logo"
        />
      </div>

      <h2 className="text-[11px] font-semibold text-center mb-2">
        Login to your account
      </h2>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      {/* PASSWORD */}
      <div className="relative mb-1">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <p className="text-[8px] text-red-500 mb-2">{errors.password}</p>
      )}

      {/* Login button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-[#B59353] hover:bg-[#a68546]
          text-white py-1 rounded-full text-[10px]
          transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

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
