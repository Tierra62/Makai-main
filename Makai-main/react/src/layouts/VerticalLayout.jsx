import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppContext from "context/context";
import classNames from "classnames";
import NavbarTop from "components/navbar/top/NavbarTop";
import NavbarVertical from "components/navbar/vertical/NavbarVertical";
import Footer from "components/footer/Footer";
import ProductProvider from "components/common/misc/ProductProvider";
import CourseProvider from "components/common/misc/CourseProvider";
import PropTypes from "prop-types";

const VerticalLayout = (props) => {
  const { hash, pathname } = useLocation();
  const isKanban = pathname.includes("kanban");
  // const isChat = pathname.includes('chat');

  const {
    config: { isFluid, navbarPosition },
  } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => {
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      }
    }, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={isFluid ? "container-fluid" : "container"}>
      {(navbarPosition === "vertical" || navbarPosition === "combo") && (
        <NavbarVertical currentUser={props.currentUser} />
      )}
      {/* <NavbarVertical /> */}
      <ProductProvider>
        <CourseProvider>
          <div className={classNames("content", { "pb-0": isKanban })}>
            <NavbarTop currentUser={props.currentUser} />
            {/*------ Main Routes ------*/}
            {props.children}
            {/* <Outlet /> */}
            {!isKanban && <Footer />}
          </div>
        </CourseProvider>
      </ProductProvider>
    </div>
  );
};

VerticalLayout.propTypes = {
  children: PropTypes.element,
  currentUser: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    roles: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default VerticalLayout;
