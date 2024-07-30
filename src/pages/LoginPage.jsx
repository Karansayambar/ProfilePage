import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import ButtonComponent from "../components/ButtonComponent";
import { toast } from "react-toastify";

const LoginPage = () => {
  // State to manage email and password inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handles user login process
  const handleLogin = async () => {
    try {
      // Authenticate user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Store user information in localStorage
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      // Redirect to profile page
      navigate("/profile");
      toast.success("User Logged In Successfully");
    } catch (error) {
      // Handle any errors during login
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto mt-5">
      {/* Card container with responsive width */}
      <div className="cont card mx-auto w-75 p-4" style={{ maxWidth: '400px' }}>
        <div className="card-body">
          <h2 className="card-title mb-4">Login</h2>
          
          {/* Input field for email */}
          <Input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3"
          />
          
          {/* Input field for password */}
          <Input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3"
          />
          
          {/* Login button and link to registration page */}
          <div className="d-flex flex-column align-items-center">
            <ButtonComponent text="Login" onClick={handleLogin} />
            <Link to="/register" className="mt-3">Please Register if you are new on this site</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
