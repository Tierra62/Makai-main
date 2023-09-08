import React from "react";
import "./donations.css";
import {
  Button,
  Carousel,
  Col,
  Container,
  Row,
  Card,
  CardGroup,
} from "react-bootstrap";
import { BiWorld } from "react-icons/bi";
import { FaHandsHelping, FaHandHoldingHeart, FaLeaf } from "react-icons/fa";
import cover from "../../assets/img/donations/donations-cover.jpg";
import carousel1 from "../../assets/img/donations/carousel1.webp";
import carousel2 from "../../assets/img/donations/carousel2.jpeg";
import carousel3 from "../../assets/img/donations/carousel3.jpeg";

function CoverDonate() {
  const handleScroll = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 1650,
      left: 100,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section>
        <div className="donate-container">
          <img src={cover} className="img-fluid" />
          <div className="donate-img-over">
            <h1 className="text-white">
              WE CAN&apos;T HELP EVERYONE, BUT EVERYONE CAN HELP SOMEONE.
            </h1>
            <Button
              variant="success"
              className="donate-now-button"
              onClick={handleScroll}
            >
              Donate Now
            </Button>
          </div>
        </div>
      </section>
      <Container>
        <CardGroup className="text-center donate-groupcards">
          <Card className="m-2 p-4 donate-color-card">
            <BiWorld className="donate-icon-img" />
            <Card.Title className="mb-3">Direct Help</Card.Title>
            <Card.Text>
              Your donations go directly to the Charity Fund you choose. To
              projects all over the world.
            </Card.Text>
          </Card>
          <Card className="m-2 p-4 donate-color-card">
            <FaHandsHelping className="donate-icon-img" />
            <Card.Title className="mb-3">Take Action</Card.Title>
            <Card.Text>
              Whatever it is that you care about, there will be a charity
              working on it. You can donate to them or go their page directly
              and sign as volunteer.
            </Card.Text>
          </Card>
          <Card className="m-2 p-4 donate-color-card">
            <FaHandHoldingHeart className="donate-icon-img" />
            <Card.Title className="mb-3">Relieving Poverty</Card.Title>
            <Card.Text>
              Some projects are focus on education for child, teenengers and
              adults so they can enter the job market.
            </Card.Text>
          </Card>
          <Card className="m-2 p-4 donate-color-card">
            <FaLeaf className="donate-icon-img" />
            <Card.Title className="mb-3">Environmental Awarenes</Card.Title>
            <Card.Text>
              We personally collaborate directly to projects working on
              environmental issues.
            </Card.Text>
          </Card>
        </CardGroup>
      </Container>
      <Container className="mt-6 donate-carousel">
        <Row>
          <Col>
            <div className="mt-5 p-7">
              <h1 className="text-white">
                Fundraising for the people and causes you care.
              </h1>
              <p className="text-white mt-4">
                We provide a trusted donation channel for peoples of worldwide
                to support people and organizers.
              </p>
            </div>
          </Col>
          <Col>
            <Carousel fade indicators={false} controls={false} interval={3000}>
              <Carousel.Item>
                <img
                  className="d-block donate-carousel-img"
                  src={carousel1}
                  alt="people donating goods"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block donate-carousel-img"
                  src={carousel2}
                  alt="man and woman carrying medicine"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block donate-carousel-img"
                  src={carousel3}
                  alt="a woman in hijab giving out a packed food"
                />
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CoverDonate;
