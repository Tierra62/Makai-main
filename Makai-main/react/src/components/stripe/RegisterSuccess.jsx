import React from "react";
import Card from "react-bootstrap/Card";
import registerImg from "../../assets/img/stripe/register.jpg";
import "./stripe.css";

function RegisterSuccess() {
  return (
    <div className="container p-4 ">
      <div className="row">
        <div className="col-flex justify-content-center">
          <Card className="success-card">
            <Card.Img variant="top" src={registerImg} />
            <Card.Body>
              <Card.Title>
                Thank you for registering an account with us!
              </Card.Title>
              <Card.Text>
                We appreciate your business and we will be in contact with you
                shortly! If you have any questions in the meantime, please email
                us at:{" "}
                <a href="mailto:orders@example.com">orders@example.com</a>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default React.memo(RegisterSuccess);
