import React from "react";
import AuthCardLayout from "layouts/AuthCardLayout";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import RegistrationForm from "./RegistrationForm";

const Registration = () => {
  return (
    <div className="fluid-container my-6">
      <AuthCardLayout
        leftSideContent={
          <p className="pt-3 text-white ">
            Have an account?
            <br />
            <Button
              as={Link}
              variant="outline-light"
              className="mt-2 px-4"
              to="/login"
            >
              Log In
            </Button>
          </p>
        }
      >
        <h3>Register</h3>
        <RegistrationForm />
      </AuthCardLayout>
    </div>
  );
};

export default Registration;
