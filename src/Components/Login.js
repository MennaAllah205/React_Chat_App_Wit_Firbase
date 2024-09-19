// Login.js
import React from "react";
import { useFirebase } from "../Context/FirebaseContext";
import { useNavigate } from "react-router-dom";
import "../Css/login.css";

const Login = () => {
  const { signInWithGoogle } = useFirebase();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/chat");
    } catch (error) {
      console.error("Sign-in Error:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign in to Chat</h2>
      <button onClick={handleSignIn}>Sign in With Google</button>
    </div>
  );
};

export default Login;
