import React, { useState, useEffect, useRef } from "react";
import Stack from "react-bootstrap/Stack";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "./Main.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import CircleExpandButton from "../mis/CircleExpandButton/CircleExpandButton";

const API = "http://localhost:8000";

function SignUp() {
  const [step, setStep] = useState(1); // 1 = form, 2 = otp
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // ─── Step 1: Send OTP ─────────────────────
  async function handleSendOTP(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/user/send-otp`, { email });
      toast.success("OTP sent to your email!");
      setStep(2);
      setCooldown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.errors) {
        errData.errors.forEach((e) => toast.error(e.message));
      } else {
        toast.error(errData?.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  }

  // ─── Step 2: Verify OTP + Create Account ──
  async function handleVerifyAndSignup() {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/user/verify-otp`, { email, otp: otpString });

      const result = await axios.post(`${API}/user/signup`, {
        name,
        email,
        password,
      });

      const { token, user } = result.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user || { name, email }));

      toast.success("Account created successfully!");
      navigate("/profile");
    } catch (error) {
      const errData = error.response?.data;
      if (errData?.errors) {
        errData.errors.forEach((e) => toast.error(e.message));
      } else {
        toast.error(errData?.message || "Verification failed");
      }
    } finally {
      setLoading(false);
    }
  }

  // ─── Resend OTP ────────────────────────────
  async function handleResendOTP() {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      await axios.post(`${API}/user/send-otp`, { email });
      toast.success("OTP resent!");
      setCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  // ─── OTP Input Handlers ────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && otp.join("").length === 6) {
      handleVerifyAndSignup();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  // ─── Step 1: Registration Form ────────────
  if (step === 1) {
    return (
      <Stack gap={2}>
        <input
          className="login-input"
          placeholder="Enter your Name"
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="login-input"
          placeholder="Add your Email"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          placeholder="Enter Your Password"
          required
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="login-input"
          placeholder="Confirm Password"
          required
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="button">
          <CircleExpandButton
            text={loading ? "Sending OTP..." : "Sign Up"}
            onClick={handleSendOTP}
            bgColor="transparent"
            hoverBgColor="#ffffff"
            textColor="#ffffff"
            hoverTextColor="#0e0e0e"
            borderColor="#ffffff"
            showArrow={!loading}
            className="login-button"
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
          </span>
        </div>
      </Stack>
    );
  }

  // ─── Step 2: OTP Verification ──────────────
  return (
    <Stack gap={2} className="otp-step">
      <div className="otp-header">
        <p className="otp-subtitle">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <div className="otp-inputs" onPaste={handleOtpPaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="otp-box"
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(i, e)}
          />
        ))}
      </div>

      <div className="button">
        <CircleExpandButton
          text={loading ? "Verifying..." : "Verify & Create Account"}
          onClick={handleVerifyAndSignup}
          bgColor="transparent"
          hoverBgColor="#4ADE80"
          textColor="#ffffff"
          hoverTextColor="#0e0e0e"
          borderColor="#4ADE80"
          showArrow={!loading}
          className="login-button"
        />
      </div>

      <div className="otp-actions">
        <button
          className="otp-resend-btn"
          onClick={handleResendOTP}
          disabled={cooldown > 0 || loading}
        >
          {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
        </button>
        <button
          className="otp-back-btn"
          onClick={() => {
            setStep(1);
            setOtp(["", "", "", "", "", ""]);
          }}
        >
          ← Back
        </button>
      </div>
    </Stack>
  );
}

export default SignUp;
