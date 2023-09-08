import FalconCardHeader from "components/common/FalconCardHeader";
import React from "react";
import { Card, Form } from "react-bootstrap";
import "../profile.css";

const NotificationCard = () => {
  return (
    <Card className="mb-3">
      <FalconCardHeader title="Notifications" />
      <Card.Body className="bg-light">
        <div className="ps-2">
          <h6 className="fw-bold profile-card-subheader ps-0">Newsletters</h6>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Recieve emails about new events and website features"
            className="form-label-nogutter"
            name="newFeatures"
          />
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Recieve emails with news about surfing, paddleboarding, and all watersports"
            className="form-label-nogutter"
            name="altheticNews"
          />
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Recieve all emails"
            className="form-label-nogutter"
            name="allNewsletters"
          />
        </div>
        <div className="border-dashed border-bottom my-3" />

        <div className="ps-2">
          <h6 className="fw-bold profile-card-subheader ps-0">Discounts</h6>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Recieve emails about discounts on surfing equipment only"
            className="form-label-nogutter"
            name="surfingDiscounts"
          />
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Recieve emails about discounts on kayaking equipment only"
            className="form-label-nogutter"
            name="kayakingDiscounts"
          />
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Recieve emails about discounts on all rental watersport equipment"
            className="form-label-nogutter"
            name="allDiscounts"
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default NotificationCard;
