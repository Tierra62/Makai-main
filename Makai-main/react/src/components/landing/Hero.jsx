import Section from "components/common/Section";
import AppContext from "context/context.js";
import React, { useContext } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import kayakImage from "../../assets/img/products/kayak.jpg";

const Hero = () => {
  const {
    config: { isRTL },
  } = useContext(AppContext);

  return (
    <Section
      className="py-0 overflow-hidden light"
      image={kayakImage}
      position="center bottom"
    >
      <Row className="justify-content-center align-items-center pt-8 pt-lg-10 pb-lg-9 pb-xl-0">
        <Col
          md={12}
          lg={8}
          xl={4}
          className="pb-7 pb-xl-9 text-center text-xl-start"
        >
          <h1 className="text-white fw-light text-center">
            <p> Bring</p>{" "}
            <span className="fw-bold">
              <Typewriter
                words={["kayaks", "surfboards", "paddleboards", "excitement"]}
                loop={false}
                cursor={!isRTL ? true : false}
                cursorStyle="|"
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>
            <br />
            to your beach day!
          </h1>
          <p className="lead text-white text-center">
            With the help of Makai, you can focus on having fun! Hit the stand,
            then hit the beach!
          </p>
          <Button
            as={Link}
            variant="outline-light"
            size="lg"
            className="border-2 rounded-pill mt-4 fs-0 py-2 centered-button"
            to="/products"
          >
            Get Started
          </Button>
        </Col>
        <Col
          xl={{ span: 7, offset: 1 }}
          className="align-self-end mt-4 mt-xl-0"
        />
      </Row>
    </Section>
  );
};

export default Hero;
