import React, { useState } from "react";
import Stack from "react-bootstrap/Stack";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import CircleExpandButton from "../mis/CircleExpandButton/CircleExpandButton";
import { Link } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const data = { email, password };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleClick(e) {
    e.preventDefault();
    setLoading(true);

    await axios
      .post("http://localhost:8000/user/login", {
        email,
        password,
      })
      .then((result) => {
        const { token, user } = result.data;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("userInfo", JSON.stringify(user || data));

          toast.success("Login Successful");
          navigate("/docs-list");
        }
      })
      .catch((err) => {
        const errData = err.response?.data;
        if (errData?.errors) {
          errData.errors.forEach((e) => toast.error(e.message));
        } else {
          toast.error(errData?.message || "Something went wrong");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Stack gap={2}>
      <input
        className="login-input"
        placeholder="Add your Email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        className="login-input"
        placeholder="Enter Your Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <div className="button">
        <CircleExpandButton
          text={loading ? "Loading..." : "Sign In"}
          onClick={handleClick}
          bgColor="transparent"
          hoverBgColor="#ffffff"
          textColor="#ffffff"
          hoverTextColor="#0e0e0e"
          borderColor="#ffffff"
          showArrow={!loading}
          className="login-button"
        />
        <span className="password-toggle" onClick={togglePasswordVisibility}>
          {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
        </span>
      </div>
      <Link to="/forgot-password" className="forgot-link">
        Forgot Password?
      </Link>
    </Stack>
  );
}

export default SignIn;
