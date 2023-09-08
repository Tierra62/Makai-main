import React from "react";
import { Card, CardGroup, Col, Container, Row } from "react-bootstrap";
import { BsUniversalAccess } from "react-icons/bs";
import { TbKayak } from "react-icons/tb";
import { SiHandshake } from "react-icons/si";
import { FaLeaf } from "react-icons/fa";
import "./aboutus.css";

function AboutUs() {
  return (
    <div>
      <Container className="text-center mt-5" fluid>
        <Card className="mb-6">
          <Card.Img
            variant="top"
            src="https://i.ibb.co/1KP80dy/fondo-aboutus-1.png"
          />
          <Card.ImgOverlay>
            <Card.Title className="pt-11 mt-4 text-white text-center aboutus-title">
              About Us
            </Card.Title>
            <div>
              <h1 className=""></h1>
            </div>
          </Card.ImgOverlay>
          <div>
            <Card.Body>
              <Card.Text className="p-5 text-center">
                <h5 className="aboutus-welcome-text">
                  <b>Welcome to Makai Rentals!</b>
                </h5>
                <p className="aboutus-body-text">
                  The mobile app that makes renting kayaks easy and convenient!
                  We believe that kayaking is an exciting way to experience the
                  beauty of nature and enjoy some physical activity at the same
                  time.
                </p>
                <CardGroup>
                  <Card className="m-2 p-4">
                    <BsUniversalAccess className="aboutus-icon-img" />
                    <Card.Title className="mb-3">
                      Acessible to everyone
                    </Card.Title>
                    <Card.Text>
                      Our app allows you to rent a kayak from our locking system
                      with just a few taps on your phone. Our locking system is
                      similar to those used by Lime and Spin scooters, which
                      means you can pick up and drop off your kayak at
                      designated locations throughout the city.
                    </Card.Text>
                  </Card>
                  <Card className="m-2 p-4">
                    <TbKayak className="aboutus-icon-img" />
                    <Card.Title className="mb-3">
                      Variety of kayak options
                    </Card.Title>
                    <Card.Text>
                      To suit your needs and preferences, whether you are a
                      beginner or an experienced kayaker. Our kayaks are of the
                      highest quality and are regularly maintained to ensure
                      your safety and comfort.
                    </Card.Text>
                  </Card>
                  <Card className="m-2 p-4">
                    <SiHandshake className="aboutus-icon-img" />
                    <Card.Title className="mb-3">
                      Exceptional customer service
                    </Card.Title>
                    <Card.Text>
                      Our team is always available to answer any questions you
                      may have and to assist you with your rental.
                    </Card.Text>
                  </Card>
                  <Card className="m-2 p-4">
                    <FaLeaf className="aboutus-icon-img" />
                    <Card.Title className="mb-3">
                      Promote environmental awarenes
                    </Card.Title>
                    <Card.Text>
                      We believe that kayaking is not only a fun activity but
                      also a way to promote environmental awareness and
                      conservation. We encourage our customers to respect nature
                      and to take care of their surroundings while kayaking.
                    </Card.Text>
                  </Card>
                </CardGroup>
                <h5 className="mt-5">
                  Thank you for choosing Makai Rentals as your go-to mobile app
                  for renting kayaks. We are excited to help you explore the
                  great outdoors and create unforgettable memories!
                </h5>
              </Card.Text>
            </Card.Body>
          </div>
        </Card>

        <h1 className="s2-heading text-center ">Our Team</h1>
        <Container className="mb-5 text-white d-flex justify-content-around">
          <Row xs="auto">
            <Col>
              <Card className="bg-dark m-5">
                <Card.Img
                  src="https://www.claysys.com/app/uploads/2019/01/img01.jpg"
                  className="aboutus-img-team"
                  variant="top"
                />
                <Card.Body>
                  <Card.Title>
                    <h5 className="text-white">Vinod Tharakan</h5>
                  </Card.Title>
                  <Card.Text>Managing Director</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="bg-dark m-5">
                <Card.Img
                  src="https://www.claysys.com/app/uploads/2019/01/dan.jpg"
                  className="aboutus-img-team"
                  variant="top"
                />
                <Card.Body>
                  <Card.Title>
                    <h5 className="text-white">Daniel R Vena</h5>
                  </Card.Title>
                  <Card.Text>VP - Corporate Development</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="bg-dark m-5">
                <Card.Img
                  src="https://www.claysys.com/app/uploads/2019/01/img03.jpg"
                  className="aboutus-img-team"
                  variant="top"
                />
                <Card.Body>
                  <Card.Title>
                    <h5 className="text-white">Mubarak Musthafa</h5>
                  </Card.Title>
                  <Card.Text> VP - Technology &amp; Services</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default AboutUs;
