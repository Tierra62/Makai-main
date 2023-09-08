import React from "react";
import PropTypes from "prop-types";
import NavbarStandard from "../components/navbar/top/NavbarStandard";
import FooterStandard from "../components/footer/FooterStandard";
import Section from "components/common/Section";
const BlankLayout = (props) => {
  return (
    <>
      <NavbarStandard currentUser={props.currentUser} />
      <Section bg="dark" className="pt-7 pb-4 light" fluid={true}>
        {props.children}
      </Section>
      <FooterStandard />
    </>
  );
};

BlankLayout.propTypes = {
  children: PropTypes.element,
  currentUser: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }).isRequired,
};

export default BlankLayout;
