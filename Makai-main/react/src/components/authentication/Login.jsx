import React from "react";
import { Link } from "react-router-dom";
import AuthCardLayout from "layouts/AuthCardLayout";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <div className="fluid-container my-3">
      <AuthCardLayout
        leftSideContent={
          <p className="text-white">
            Don&apos;t have an account?
            <br />
            <Link
              className="text-white text-decoration-underline"
              to="/register"
            >
              Get started!
            </Link>
          </p>
        }
      >
        <h3>Account Login</h3>
        <LoginForm layout="card" />
      </AuthCardLayout>
    </div>
  );
};

export default Login;
