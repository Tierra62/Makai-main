import React from "react";
import { Form, Button, Col, Row } from "react-bootstrap";

const SocialAuthButtons = () => (
  <Form.Group className="mb-0">
    <Row>
      <Col sm={6} className="pe-sm-1">
        <Button
          variant=""
          size="sm"
          className="btn-outline-google-plus mt-2 w-100"
        >
          google
        </Button>
      </Col>
      <Col sm={6} className="ps-sm-1">
        <Button
          variant=""
          size="sm"
          className="btn-outline-facebook mt-2 w-100"
        >
          facebook
        </Button>
      </Col>
    </Row>
  </Form.Group>
);

export default SocialAuthButtons;
