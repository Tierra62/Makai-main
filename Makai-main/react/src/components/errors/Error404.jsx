import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Error404 = () => {
  return (
    <Card className="text-center">
      <Card.Body className="p-5">
        <div className="display-1 text-300 fs-error">404</div>
        <p className="lead mt-4 text-800 font-sans-serif fw-semi-bold">
          The page you&apos;re looking for could not be not found.
        </p>
        <hr />
        <p>
          Make sure the address is correct and that the page hasn&apos;t moved.
          If you think this is a mistake,
          <a href="mailto:info@exmaple.com" className="ms-1">
            contact us
          </a>
          .
        </p>
        <Link className="btn btn-primary btn-sm mt-3" to="/">
          <FaHome className="me-2" />
          Take me home
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Error404;
