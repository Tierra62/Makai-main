import React from "react";
import PropTypes from "prop-types";
import Section from "components/common/Section";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { menuList1, menuList2 } from "data/footer";
import WeatherDisplay from "../../components/weather/WeatherDisplay";
import { version } from "config";
import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const FooterTitle = ({ children }) => (
  <h5 className="text-uppercase text-white opacity-85 mb-3">{children}</h5>
);

FooterTitle.propTypes = { children: PropTypes.node.isRequired };

const FooterList = ({ list }) => (
  <ul className="list-unstyled">
    {list.map(({ title, to }, index) => (
      <li className="mb-1" key={index}>
        <Link className="text-600" to={to}>
          {title}
        </Link>
      </li>
    ))}
  </ul>
);

FooterList.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const FooterStandard = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Section bg="dark" className="pt-10 pb-8 light">
        <div
          className="position-absolute btn-back-to-top cursor-pointer bg-dark"
          onClick={scrollToTop}
        >
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </div>
        <Row>
          <Col lg={4}>
            <FooterTitle>Our Mission</FooterTitle>
            <p className="text-600">
              To give customers the means to easily rent beach gear and owners
              the means to effortlessly manage their locations and equipment. By
              doing this, we help to reduce costs for location and equipment
              owners.
            </p>
          </Col>
          <Col className="ps-lg-6 ps-xl-8">
            <Row className="mt-5 mt-lg-0">
              <Col xs={6} md={3}>
                <FooterTitle>Company</FooterTitle>
                <FooterList list={menuList1} />
              </Col>
              <Col xs={6} md={3}>
                <FooterTitle>Product</FooterTitle>
                <FooterList list={menuList2} />
              </Col>
              <Col xs={6}>
                <WeatherDisplay />
              </Col>
            </Row>
          </Col>
        </Row>
      </Section>
      <section className=" bg-dark py-0 text-center fs--1 light">
        <hr className="my-0 border-600 opacity-25" />
        <div className="container py-3">
          <Row className="justify-content-between">
            <Col xs={12} sm="auto">
              <p className="mb-0 text-600">
                Thank you for renting with Makai{" "}
                <span className="d-none d-sm-inline-block">| </span>
                <br className="d-sm-none" /> {new Date().getFullYear()} &copy;{" "}
                <a
                  className="text-white opacity-85"
                  href="https://themewagon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Makai
                </a>
              </p>
            </Col>
            <Col xs={12} sm="auto">
              <p className="mb-0 text-600">v{version}</p>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default FooterStandard;
