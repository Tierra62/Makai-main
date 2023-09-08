import React, { useState } from "react";
import { BsWatch, BsCheckCircleFill, BsPinMapFill } from "react-icons/bs";
import { Card, Row, Col, Container } from "react-bootstrap";
import { FaSnowboarding } from "react-icons/fa";
import Loki from "react-loki";
import ProductSelection from "./ProductSelection";
import Reservations from "./Reservations";
import ReservationDetails from "./ReservationDetails";
import StandSelection from "./StandSelection";
import "./reservationwizardstyles.css";

function ReservationsWizard() {
  const currentDate = new Date();
  currentDate.setHours(new Date().getHours());
  currentDate.setMinutes(new Date().getMinutes());

  const [reservation, setReservation] = useState({
    productId: "",
    dateCheckIn: currentDate,
    rentalTime: "",
    chargeId: "",
    statusId: 3,
  });

  const mergeValues = (values) => {
    setReservation((prevState) => {
      let res = { ...prevState, ...values };
      return res;
    });
  };

  const customSteps = [
    {
      label: "Select Stand Location",
      icon: <BsPinMapFill />,
      component: <StandSelection reservation={reservation} />,
    },
    {
      label: "Select a Product",
      icon: <FaSnowboarding />,
      component: <ProductSelection reservation={reservation} />,
    },
    {
      label: "Select Check-In Date & Time",
      icon: <BsWatch />,
      component: <Reservations reservation={reservation} />,
    },
    {
      label: "Confirm Reservation Details",
      icon: <BsCheckCircleFill />,
      component: <ReservationDetails reservation={reservation} />,
    },
  ];

  return (
    <Container className="mt-3">
      <Card>
        <Card.Header>
          <div className="mb-3 mb-lg-0 ">
            <h2 className="fw-bold">Reservation</h2>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="mb-5">
            <Col lg={12} md={12} sm={12}>
              <Loki
                steps={customSteps}
                onNext={mergeValues}
                onBack={mergeValues}
                backLabel={"Back"}
                nextLabel={"Next"}
                noActions
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default ReservationsWizard;
