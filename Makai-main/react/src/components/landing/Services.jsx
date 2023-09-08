import React from "react";
import { Row, Col } from "react-bootstrap";
import className from "classnames";
import serviceList from "data/feature/serviceList";
import Section from "components/common/Section";
import CardService from "./ServiceCard";
import SectionHeader from "./SectionHeader";

const Services = () => (
  <Section className="text-center text-secondary landing-bg-ocean-dark">
    <SectionHeader subtitle="Why choose Makai?" />
    <Row className="mt-6">
      {serviceList.map((service, index) => (
        <Col
          lg={4}
          className={className({ "mt-6 mt-lg-0": index > 0 })}
          key={index}
        >
          <CardService {...service} />
        </Col>
      ))}
    </Row>
  </Section>
);

export default Services;
