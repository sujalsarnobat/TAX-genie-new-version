import React, { useState } from "react";
import Stack from "react-bootstrap/Stack";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import CircleExpandButton from "../mis/CircleExpandButton/CircleExpandButton";

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
      .post("https://taxsaarthi.onrender.com/user/login", {
        email,
        password,
      })
      .then((result) => {
        console.log(result);

        // Assuming the server responds with a token
        const token = result.data.token;

        if (token) {
          // Store the token in localStorage
          localStorage.setItem("token", token);

          // Optionally, you may want to store other user information
          localStorage.setItem("userInfo", JSON.stringify(data));

          toast.success("Login Successful");
          navigate("/docs-list");
        } else if (result.data === "Password is incorrect") {
          toast.error("Incorrect Password");
          setPassword("");
        } else {
          toast.error("User Does Not Exist");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Try again after sometime");
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
    </Stack>
  );
}

export default SignIn;
