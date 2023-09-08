import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import handleNavbarTransparency from "helpers/handleNavbarTransparency";
import NavbarTopDropDownMenus from "components/navbar/top/NavbarTopDropDownMenus";
import LandingRightSideNavItem from "../../landing/LandingRightSideNavItem";
import { topNavbarBreakpoint } from "config";
import AppContext from "context/context.js";
import logo from "../../../assets/img/logos/Makai.png";
import "./navbar.css";

const NavbarStandard = (props) => {
  const {
    config: { isDark },
  } = useContext(AppContext);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);

  useEffect(() => {
    window.addEventListener("scroll", handleNavbarTransparency);
    return () => window.removeEventListener("scroll", handleNavbarTransparency);
  }, []);

  return (
    <Navbar
      variant={isDark ? "light" : "dark"}
      fixed="top"
      expand={topNavbarBreakpoint}
      className={classNames("navbar-standard navbar-theme", {
        "bg-100": !navbarCollapsed && isDark,
        "bg-dark": !navbarCollapsed && !isDark,
      })}
    >
      <Container className="navbar__height">
        <Navbar.Brand className="text-white dark__text-white" as={Link} to="/">
          <img src={logo} alt="Makai Logo" className="makai__logo" />
        </Navbar.Brand>
        <Navbar.Toggle onClick={() => setNavbarCollapsed(!navbarCollapsed)} />
        <Navbar.Collapse className="scrollbar">
          <Nav>
            <NavbarTopDropDownMenus
              setNavbarCollapsed={setNavbarCollapsed}
              currentUser={props.currentUser}
            />
          </Nav>
          <LandingRightSideNavItem currentUser={props.currentUser} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

NavbarStandard.propTypes = {
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
    isLoggedIn: PropTypes.bool,
  }),
};

export default NavbarStandard;
