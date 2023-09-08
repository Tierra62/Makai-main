import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import logo from "assets/img/logos/Makai.png";

const Logo = ({ at, className, textClass, ...rest }) => {
  return (
    <Link
      to="/"
      className={classNames(
        "text-decoration-none",
        { "navbar-brand text-left": at === "navbar-vertical" },
        { "navbar-brand text-left": at === "navbar-top" }
      )}
      {...rest}
    >
      <div
        className={classNames(
          "d-flex",
          {
            "align-items-center ": at === "navbar-vertical",
            "align-items-center": at === "navbar-top",
            "flex-center fw-bolder fs-5 mb-4": at === "auth",
          },
          className
        )}
      >
        <img className="me-2" src={logo} alt="Logo" width={"100px"} />
        <span className={classNames("font-sans-serif", textClass)}></span>
      </div>
    </Link>
  );
};

Logo.propTypes = {
  at: PropTypes.oneOf(["navbar-vertical", "navbar-top", "auth"]),
  width: PropTypes.number,
  className: PropTypes.string,
  textClass: PropTypes.string,
};

Logo.defaultProps = { at: "auth", width: "50" };

export default Logo;
