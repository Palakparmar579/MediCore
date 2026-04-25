import { useState } from "react";
import { FaEye, FaEyeSlash, FaTimes, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../Config/Axios";
import MiniLoader from "../../component/CommonPages/MiniLoader";
import Forget from "../auth/Forget";
import CryptoJS from "crypto-js";
import whiteLogo1 from '../../assets/whiteLogo1.png'
import { encryptData } from "../../utils/encrypt";

function Login() {
  const navigate = useNavigate();
  const [LoaderId, setLoaderId] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmail, seterrorEmail] = useState("");
  const [errorPassword, seterrorPassword] = useState("");
  const [showDisabled, setshowDisabled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    seterrorEmail("");
    seterrorPassword("");
    setError("");
    setshowDisabled(false);
  };

  const isFormFilled = form.email && form.password;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email) {
      return seterrorEmail("Please enter your email");
    }

    if (!emailPattern.test(form.email)) {
      return seterrorEmail(
        "Please enter a valid email address (example: user@example.com)"
      );
    }

    if (!form.password) {
      return seterrorPassword("Please enter your password");
    }

    setLoaderId(true);
    setError("");

    try {
      if (showDisabled) return;
      setshowDisabled(true);

      const response = await api.post("/api/auth/login", form);

      if (response.status === 200) {
        toast.success("Login Successfully!");

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", encryptData(response.data.user.role));

        const role = response.data.user.role;

        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else if (role === "doctor") {
          navigate("/doctor", { replace: true });
        } else if (role === "patient") {
          navigate("/patient", { replace: true });
        } else if (role === "nurse") {
          navigate("/nurse", { replace: true });
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
      setshowDisabled(false);
    } finally {
      setLoaderId(false);
    }

    setForm({ email: "", password: "" });
    setshowDisabled(false);
  };

  const handleForget = () => setShowPopup(true);
  const handleCross = () => setShowPopup(false);
  const handleCancel = () => setShowPopup(false);

  const handleConfirm = async (email) => {
    try {
      const response = await api.post("/api/request/forgetRequest", { email });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setShowPopup(false);
  };

 return (
  <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#1e3a8a] relative overflow-hidden">

    {/* Background glow */}
    <div className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[160px] top-[-150px] left-[-150px]"></div>
    <div className="absolute w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[160px] bottom-[-120px] right-[-120px]"></div>

    {/* Card */}
    <div className="relative w-full max-w-md bg-[#0f172a]/90 backdrop-blur-xl border border-blue-900/40 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.6)] px-6 py-10 sm:px-10">

      <div className="text-center mb-8">

        {/* Logo Glow */}
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">

          <div className="absolute w-20 h-20 bg-blue-500/30 blur-2xl rounded-full"></div>

          <img
            src={whiteLogo1}
            className="relative w-14 h-14 object-contain drop-shadow-[0_0_18px_rgba(37,99,235,0.5)]"
            alt="logo"
          />
        </div>

        <h2 className="mt-3 text-2xl font-bold text-white tracking-wide">
          Medi<span className="text-blue-400">Core</span>
        </h2>

        <p className="text-gray-400 text-sm mt-1">
          Smart Healthcare System
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">

       
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-[#111827] text-white border border-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500"
          />

          {errorEmail && (
            <p className="text-red-400 text-xs mt-1">{errorEmail}</p>
          )}
        </div>

      
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 pr-10 rounded-xl bg-[#111827] text-white border border-blue-900/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-blue-400 transition"
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>

          {errorPassword && (
            <p className="text-red-400 text-xs mt-1">{errorPassword}</p>
          )}
        </div>

       
        <button
          type="submit"
          disabled={showDisabled || LoaderId}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg
          ${
            !isFormFilled || showDisabled || LoaderId
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
          }`}
        >
          {LoaderId ? (
            <>
              <MiniLoader size="w-4 h-4" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

       
        <div className="text-center text-sm mt-6 space-y-2">

          <p className="text-gray-400">
            Forgot your password?
          </p>

          <p
            onClick={handleForget}
            className="text-blue-400 font-medium hover:text-blue-300 cursor-pointer transition"
          >
            Contact Admin
          </p>

        </div>

      </form>
    </div>

   
    {showPopup && (
      <Forget
        handleCross={handleCross}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
      />
    )}
  </div>
);
}

export default Login;
