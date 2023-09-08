import React from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const _logger = debug.extend("orders");

const OrderCard = (props) => {
  const navigate = useNavigate();

  const order = props.order;

  const onViewMoreClicked = (e) => {
    e.preventDefault();
    _logger("Redirecting to: /", order.id);

    const information = { type: "ORDER_VIEW", payload: order };
    navigate(`/orders/${order.id}`, { state: information });
  };

  return (
    <React.Fragment>
      <Card className="p-1 m-2" style={{ maxWidth: "15rem" }}>
        <Card.Body className="d-flex flex-column justify-content-center">
          <Card.Title as="h5" className="text-center">
            {order?.user?.firstName} {order?.user?.lastName}
          </Card.Title>
          <Card.Text className="text-center">
            Order Status: {order?.orderStatus?.name}
          </Card.Text>
          <p className="text-muted text-center">
            <small className="text-muted text-center">
              Order Date: {new Date(order?.dateCreated).toLocaleDateString()}{" "}
              {new Date(order?.dateCreated).toLocaleTimeString()}
            </small>
          </p>
          <div className="d-flex justify-content-center">
            <Button type="submit" onClick={onViewMoreClicked}>
              <small>Order Detail</small>
            </Button>
          </div>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    orderStatus: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      mi: PropTypes.string,
      avatarUrl: PropTypes.string,
    }).isRequired,
    startTime: PropTypes.string,
    estimatedStop: PropTypes.string,
    actualStop: PropTypes.string,
    priceInCents: PropTypes.number,
    priceWithTax: PropTypes.number,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
  }).isRequired,
};

export default React.memo(OrderCard);
