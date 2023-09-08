import React, { useContext } from "react";
import PropTypes from "prop-types";
import NavbarDropdown from "./NavbarDropdown";
import {
  appRoutes,
  pagesRoutes,
  modulesRoutes,
  settingsRoutes,
  documentationRoutes,
  partnerRoutes,
} from "../vertical/navbarVerticalRoutes";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { flatRoutes } from "helpers/utils";
import NavbarDropdownApp from "./NavbarDropdownApp";
import NavbarDropdownPages from "./NavbarDropdownPages";
import NavbarDropdownModules from "./NavbarDropdownModules";
import AppContext from "context/context.js";

const NavbarTopDropDownMenus = (props) => {
  const currentUser = props.currentUser;
  const {
    config: { navbarCollapsed, showBurgerMenu },
    setConfig,
  } = useContext(AppContext);

  const handleDropdownItemClick = () => {
    if (navbarCollapsed) {
      setConfig("navbarCollapsed", !navbarCollapsed);
    }
    if (showBurgerMenu) {
      setConfig("showBurgerMenu", !showBurgerMenu);
    }
  };

  const mapRoutes = (route) => {
    if (currentUser.roles.includes("User") && route.roles.includes("User")) {
      return (
        <Dropdown.Item
          key={route.name}
          as={Link}
          className={route.active ? "link-600" : "text-500"}
          to={route.to}
          onClick={handleDropdownItemClick}
        >
          {route.name}
        </Dropdown.Item>
      );
    } else if (
      currentUser.roles.includes("Admin") &&
      route.roles.includes("Admin")
    ) {
      return (
        <Dropdown.Item
          key={route.name}
          as={Link}
          className={route.active ? "link-600" : "text-500"}
          to={route.to}
          onClick={handleDropdownItemClick}
        >
          {route.name}
        </Dropdown.Item>
      );
    } else if (
      currentUser.roles.includes("Partner") &&
      route.roles.includes("Partner")
    ) {
      return (
        <Dropdown.Item
          key={route.name}
          as={Link}
          className={route.active ? "link-600" : "text-500"}
          to={route.to}
          onClick={handleDropdownItemClick}
        >
          {route.name}
        </Dropdown.Item>
      );
    }
  };

  const documentationDropdown = flatRoutes(documentationRoutes.children).map(
    mapRoutes
  );

  const settingDropdown = flatRoutes(settingsRoutes.children).map(mapRoutes);

  const partnerDropdown = flatRoutes(partnerRoutes.children).map(mapRoutes);

  return (
    <>
      <NavbarDropdown title="Partner With Us">
        <NavbarDropdownApp items={appRoutes.children} />
      </NavbarDropdown>
      <NavbarDropdown title="Products">
        <NavbarDropdownPages items={pagesRoutes.children} />
      </NavbarDropdown>
      <NavbarDropdown title="Support">
        <NavbarDropdownModules items={modulesRoutes.children} />
      </NavbarDropdown>
      {currentUser.isLoggedIn && currentUser.roles.includes("Partner") && (
        <NavbarDropdown title="Partners">{partnerDropdown}</NavbarDropdown>
      )}
      {currentUser.isLoggedIn && currentUser.roles.includes("User") && (
        <NavbarDropdown title="User Settings">{settingDropdown}</NavbarDropdown>
      )}
      {currentUser.isLoggedIn && currentUser.roles.includes("Admin") && (
        <NavbarDropdown title="Admin Settings">
          {documentationDropdown}
        </NavbarDropdown>
      )}
      {currentUser.isLoggedIn && (
        <li className="nav-item">
          <a className="nav-link" href="/stands/standsfinder">
            Find Stands
          </a>
        </li>
      )}
    </>
  );
};

NavbarTopDropDownMenus.propTypes = {
  currentUser: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default NavbarTopDropDownMenus;
