import { X, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ForgotPasswordStep1Schema, ForgotPasswordStep2Schema, ForgotPasswordStep3Schema } from "./schema.forgotPassword";
import z from "zod";

export default function ForgotPasswordModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const closeModal = () => navigate("/");

  const handleNext = async () => {
    setLoading(true);
    try {
      if (step === 1) {
        ForgotPasswordStep1Schema.parse({ email: data.email });
        await api.post("/api/auth/forgot-password", { email: data.email });
        toast.success("OTP sent to your email");
        setStep(2);
      } else if (step === 2) {
        ForgotPasswordStep2Schema.parse({ otp: data.otp });
        await api.post("/api/auth/verify-otp", {
          email: data.email,
          otp: data.otp,
        });
        toast.success("OTP Verified");
        setStep(3);
      } else if (step === 3) {
        ForgotPasswordStep3Schema.parse({
          password: data.password,
          confirmPassword: data.confirmPassword,
        });
        if (data.password !== data.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        await api.post("/api/auth/reset-password", {
          email: data.email,
          otp: data.otp,
          password: data.password,
        });
        toast.success("Password reset successful!");
        navigate(`${location.pathname}?modal=login`);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } 
     
      else {
        const serverMessage = err.response?.data?.message || "Something went wrong";
        toast.error(serverMessage, { id: "auth-error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl w-[400px] max-w-[95vw] p-8 box-border flex flex-col gap-5">
      <button
        onClick={closeModal}
        className="absolute top-5 right-5 text-gray-400 hover:text-black"
      >
        <X size={24} />
      </button>

      <div className="flex justify-center">
        <img
          src="/logoRound.png"
          className="w-[84px] h-[84px] rounded-full border-2 shadow-md"
          alt="logo"
        />
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800">
        {step === 1 && "Forgot Password?"}
        {step === 2 && "Enter OTP"}
        {step === 3 && "Reset Password"}
      </h2>

      {/* STEP 1: EMAIL */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-700 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-[#B59353] focus:outline-none"
            />
            <p className="text-[12px] text-gray-500 ml-1">
              We will send you OTP in your email to verify it's you.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: OTP */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Enter your OTP"
              value={data.otp}
              onChange={(e) => setData({ ...data, otp: e.target.value })}
              className="w-full px-4 py-3 text-center text-xl tracking-widest bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#B59353] focus:outline-none"
            />
            <p className="text-[12px] text-gray-500 text-center">
              Check your email for OTP at <b>{data.email}</b>. It expires in 5
              minutes.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: NEW PASSWORD */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your New Password"
              className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-[#B59353] focus:outline-none"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your New Password"
              className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 focus:border-[#B59353] focus:outline-none"
              onChange={(e) =>
                setData({ ...data, confirmPassword: e.target.value })
              }
            />
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={loading}
        className="w-full bg-[#B59353] hover:bg-[#a68546] text-white py-4 rounded-xl text-[18px] font-bold transition-all shadow-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : step === 3 ? "SUBMIT" : "CONTINUE"}
      </button>

      <p className="text-[14px] font-medium text-center text-gray-600 mt-2">
        Login with Password?
        <span
          onClick={() => navigate(`${location.pathname}?modal=login`)}
          className="text-[#B59353] font-bold ml-2 cursor-pointer hover:underline"
        >
          Login here
        </span>
      </p>
    </div>
  );
}
