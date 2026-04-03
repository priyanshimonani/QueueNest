import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/user/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      const redirectPath =
        new URLSearchParams(location.search).get("redirect") || "/search";
      navigate(redirectPath);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="mr-2 ml-2 mt-20">
      <div id="new login">
        <div className="backgroundlogin">
          <div className="shapelogin"></div>
          <div className="shapelogin"></div>
        </div>

        <form id="loginform">
          
<h3 className="title1">Login</h3>
          <label>Email</label>
          <input
            type="text"
            placeholder="Email"
            className="container"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            className="container"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="button" className="admin-btn" onClick={handleLogin}>
            Login
          </button>

          <label>
            Dont have an account? Click <a href="/signup"><u>here</u></a>
          </label>
        </form>
      </div>
    </div>
  );
};

export default Login;
